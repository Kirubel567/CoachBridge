/*
  Warnings:

  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRAINER', 'TRAINEE', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userType",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contactInstagram" TEXT,
ADD COLUMN     "contactTelegram" TEXT,
ADD COLUMN     "contactWebsite" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "fitnessGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heightCm" DOUBLE PRECISION,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "membershipActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "weightKg" DOUBLE PRECISION,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- DropEnum
DROP TYPE "UserType";
