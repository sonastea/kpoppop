-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "banner" DROP DEFAULT,
ALTER COLUMN "photo" DROP DEFAULT;

-- CreateTable
CREATE TABLE "DiscordUser" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "userId" INTEGER,

    CONSTRAINT "DiscordUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_discordId_key" ON "DiscordUser"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_userId_key" ON "DiscordUser"("userId");

-- AddForeignKey
ALTER TABLE "DiscordUser" ADD CONSTRAINT "DiscordUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
