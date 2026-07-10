import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { paginate, PaginationQuery } from '../common/pagination';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import { SubmitCertificationDto } from './dto/certifications.dto';

type UploadedCertFiles = {
  document?: Express.Multer.File[];
  govId?: Express.Multer.File[];
};

@Injectable()
export class CertificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  async submit(trainerId: string, dto: SubmitCertificationDto, files: UploadedCertFiles) {
    const doc = files.document?.[0];
    if (!doc) {
      throw new AppException('VALIDATION_ERROR', 'A certification document is required.', 'document');
    }
    const govId = files.govId?.[0];

    const cert = await this.prisma.certification.create({
      data: {
        trainerId,
        title: dto.title,
        issuer: dto.issuer,
        documentUrl: `/uploads/certifications/${doc.filename}`,
        govIdUrl: govId ? `/uploads/certifications/${govId.filename}` : null,
        status: 'pending',
      },
    });
    // Reset the badge to pending while under review.
    await this.prisma.trainerProfile
      .update({ where: { userId: trainerId }, data: { verificationStatus: 'pending' } })
      .catch(() => undefined);
    return cert;
  }

  async status(trainerId: string) {
    const [certifications, profile] = await this.prisma.$transaction([
      this.prisma.certification.findMany({
        where: { trainerId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trainerProfile.findUnique({
        where: { userId: trainerId },
        select: { verificationStatus: true },
      }),
    ]);
    return { verificationStatus: profile?.verificationStatus ?? 'pending', certifications };
  }

  // --- admin ---

  async queue(q: PaginationQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where = { status: 'pending' as const };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.certification.count({ where }),
      this.prisma.certification.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { trainer: { select: { id: true, fullName: true, email: true } } },
      }),
    ]);
    return paginate(rows, total, page, limit);
  }

  async verify(id: string, adminId: string) {
    const cert = await this.find(id);
    const updated = await this.prisma.certification.update({
      where: { id },
      data: { status: 'verified', reviewedById: adminId, reviewedAt: new Date() },
    });
    await this.prisma.trainerProfile.update({
      where: { userId: cert.trainerId },
      data: { verificationStatus: 'verified' },
    });
    await this.audit.log('certification.verify', {
      actorId: adminId,
      targetType: 'certification',
      targetId: id,
    });
    await this.notifications.notify(cert.trainerId, {
      type: 'system',
      title: 'You are verified',
      body: 'Your certification was approved — you now have the Verified badge.',
      email: true,
    });
    return updated;
  }

  async reject(id: string, adminId: string, reason: string) {
    const cert = await this.find(id);
    const updated = await this.prisma.certification.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });
    await this.prisma.trainerProfile.update({
      where: { userId: cert.trainerId },
      data: { verificationStatus: 'rejected' },
    });
    await this.audit.log('certification.reject', {
      actorId: adminId,
      targetType: 'certification',
      targetId: id,
      meta: { reason },
    });
    await this.notifications.notify(cert.trainerId, {
      type: 'system',
      title: 'Verification needs attention',
      body: `Your certification was not approved: ${reason}`,
      email: true,
    });
    return updated;
  }

  private async find(id: string) {
    const cert = await this.prisma.certification.findUnique({ where: { id } });
    if (!cert) throw new AppException('NOT_FOUND', 'Certification not found.');
    return cert;
  }
}
