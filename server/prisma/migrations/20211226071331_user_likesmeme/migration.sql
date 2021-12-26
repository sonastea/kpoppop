-- CreateTable
CREATE TABLE "_UserLikesPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikesPost_AB_unique" ON "_UserLikesPost"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikesPost_B_index" ON "_UserLikesPost"("B");

-- AddForeignKey
ALTER TABLE "_UserLikesPost" ADD FOREIGN KEY ("A") REFERENCES "Meme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikesPost" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
