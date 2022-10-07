-- CreateTable
CREATE TABLE "ReportMeme" (
    "id" BIGSERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "memeId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,

    CONSTRAINT "ReportMeme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportMeme" ADD CONSTRAINT "ReportMeme_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMeme" ADD CONSTRAINT "ReportMeme_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
