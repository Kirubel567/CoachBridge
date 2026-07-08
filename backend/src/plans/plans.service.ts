import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import type { AuthUser } from '../auth/auth-user';
import { validatePlanContent } from './plan-content';
import { findTemplate, templateSummaries } from './templates';
import { CreatePlanDto, FromTemplateDto, UpdatePlanDto } from './dto/plans.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  listTemplates() {
    return templateSummaries();
  }

  getTemplate(key: string) {
    const t = findTemplate(key);
    if (!t) throw new AppException('NOT_FOUND', 'Template not found.');
    return t;
  }

  async create(trainerId: string, dto: CreatePlanDto) {
    validatePlanContent(dto.type, dto.content);
    await this.assertTrainee(dto.traineeId);
    return this.prisma.plan.create({
      data: {
        trainerId,
        traineeId: dto.traineeId,
        type: dto.type,
        title: dto.title,
        summary: dto.summary,
        content: dto.content as Prisma.InputJsonValue,
      },
    });
  }

  async createFromTemplate(trainerId: string, dto: FromTemplateDto) {
    const template = this.getTemplate(dto.templateKey);
    await this.assertTrainee(dto.traineeId);
    return this.prisma.plan.create({
      data: {
        trainerId,
        traineeId: dto.traineeId,
        type: template.type,
        title: template.title,
        summary: template.summary,
        content: template.content as unknown as Prisma.InputJsonValue,
        templateKey: template.key,
      },
    });
  }

  async get(id: string, user: AuthUser) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new AppException('NOT_FOUND', 'Plan not found.');
    if (plan.trainerId !== user.sub && plan.traineeId !== user.sub) {
      throw new AppException('FORBIDDEN', 'You do not have access to this plan.');
    }
    return plan;
  }

  async update(id: string, trainerId: string, dto: UpdatePlanDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new AppException('NOT_FOUND', 'Plan not found.');
    if (plan.trainerId !== trainerId) {
      throw new AppException('FORBIDDEN', 'Only the author can edit this plan.');
    }
    if (dto.content) validatePlanContent(plan.type, dto.content);
    return this.prisma.plan.update({
      where: { id },
      data: {
        title: dto.title,
        summary: dto.summary,
        content: dto.content ? (dto.content as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async remove(id: string, trainerId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new AppException('NOT_FOUND', 'Plan not found.');
    if (plan.trainerId !== trainerId) {
      throw new AppException('FORBIDDEN', 'Only the author can delete this plan.');
    }
    await this.prisma.plan.delete({ where: { id } });
    return { deleted: true };
  }

  mine(traineeId: string) {
    return this.prisma.plan.findMany({
      where: { traineeId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  forTrainee(trainerId: string, traineeId: string) {
    return this.prisma.plan.findMany({
      where: { trainerId, traineeId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  private async assertTrainee(traineeId: string) {
    const trainee = await this.prisma.user.findUnique({ where: { id: traineeId } });
    if (!trainee || trainee.role !== 'trainee') {
      throw new AppException('NOT_FOUND', 'Trainee not found.', 'traineeId');
    }
  }
}
