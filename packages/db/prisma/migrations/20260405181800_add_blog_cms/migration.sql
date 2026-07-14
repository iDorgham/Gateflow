-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'READY_TO_PUBLISH', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "slugAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "excerptEn" TEXT,
    "excerptAr" TEXT,
    "metaTitleEn" TEXT,
    "metaTitleAr" TEXT,
    "metaDescEn" TEXT,
    "metaDescAr" TEXT,
    "canonicalUrl" TEXT,
    "featuredImageId" TEXT,
    "organizationId" TEXT,
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostToBlogCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slugEn_key" ON "BlogPost"("slugEn");
CREATE UNIQUE INDEX "BlogPost_slugAr_key" ON "BlogPost"("slugAr");
CREATE INDEX "BlogPost_organizationId_idx" ON "BlogPost"("organizationId");
CREATE INDEX "BlogPost_slugEn_idx" ON "BlogPost"("slugEn");
CREATE INDEX "BlogPost_slugAr_idx" ON "BlogPost"("slugAr");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");
CREATE INDEX "BlogCategory_slug_idx" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToBlogCategory_AB_unique" ON "_BlogPostToBlogCategory"("A", "B");
CREATE INDEX "_BlogPostToBlogCategory_B_index" ON "_BlogPostToBlogCategory"("B");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogCategory" ADD CONSTRAINT "_BlogPostToBlogCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToBlogCategory" ADD CONSTRAINT "_BlogPostToBlogCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
