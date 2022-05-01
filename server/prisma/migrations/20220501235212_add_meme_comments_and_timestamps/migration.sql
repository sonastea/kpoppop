/*
  Warnings:

  - You are about to alter the column `title` on the `Meme` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.

*/
-- AlterTable
ALTER TABLE "Meme" ALTER COLUMN "title" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(640) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "memeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
