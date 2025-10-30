-- CreateTable TikTokAccount
CREATE TABLE "tiktok_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tiktokUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tiktok_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_accounts_userId_key" ON "tiktok_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_accounts_tiktokUserId_key" ON "tiktok_accounts"("tiktokUserId");

-- AddForeignKey
ALTER TABLE "tiktok_accounts" ADD CONSTRAINT "tiktok_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
