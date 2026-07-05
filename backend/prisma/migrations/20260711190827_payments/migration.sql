-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('requested', 'processing', 'paid', 'failed');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "txRef" TEXT NOT NULL,
    "bookingId" TEXT,
    "traineeId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "commissionCents" INTEGER NOT NULL,
    "payoutCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "chapaRef" TEXT,
    "checkoutUrl" TEXT,
    "escrowReleased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'requested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_txRef_key" ON "payments"("txRef");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_trainerId_idx" ON "payments"("trainerId");

-- CreateIndex
CREATE INDEX "payments_traineeId_idx" ON "payments"("traineeId");

-- CreateIndex
CREATE INDEX "payouts_trainerId_idx" ON "payouts"("trainerId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
