/*
  Warnings:

  - You are about to drop the `_UserLikesPost` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserMemeLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "UserMemeLike_pkey" PRIMARY KEY ("id")
);

-- Migrate and insert data from _UserLikesPost into UserMemeLike
INSERT INTO "UserMemeLike" ("memeId", "userId")
SELECT "A", "B"
FROM "_UserLikesPost";

-- DropForeignKey
ALTER TABLE "_UserLikesPost" DROP CONSTRAINT "_UserLikesPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesPost" DROP CONSTRAINT "_UserLikesPost_B_fkey";

-- DropTable
DROP TABLE "_UserLikesPost";

-- CreateIndex
CREATE UNIQUE INDEX "UserMemeLike_userId_memeId_key" ON "UserMemeLike"("userId", "memeId");

-- AddForeignKey
ALTER TABLE "UserMemeLike" ADD CONSTRAINT "UserMemeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMemeLike" ADD CONSTRAINT "UserMemeLike_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
