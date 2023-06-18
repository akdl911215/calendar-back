/*
  Warnings:

  - Added the required column `createdAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" INTEGER,
ADD COLUMN     "updatedAt" INTEGER;
