-- CreateTable
CREATE TABLE "BoardMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AboutSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "leadership_image_url" TEXT
);
