/*
  Warnings:

  - You are about to drop the column `userId` on the `Meme` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meme" DROP CONSTRAINT "Meme_userId_fkey";

-- AlterTable
ALTER TABLE "Meme" DROP COLUMN "userId";
