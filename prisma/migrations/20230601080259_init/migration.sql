-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "appId" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar" (
    "id" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "date" INTEGER NOT NULL,
    "todo" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT true,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER,
    "deletedAt" INTEGER,

    CONSTRAINT "calendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_appId_key" ON "users"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickName_key" ON "users"("nickName");

-- AddForeignKey
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
