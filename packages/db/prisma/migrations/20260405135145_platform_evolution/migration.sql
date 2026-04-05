/*
  Warnings:

  - You are about to drop the `_BlogPostToBlogCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogPostToBlogCategory" DROP CONSTRAINT "_BlogPostToBlogCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToBlogCategory" DROP CONSTRAINT "_BlogPostToBlogCategory_B_fkey";

-- DropTable
DROP TABLE "_BlogPostToBlogCategory";

-- CreateTable
CREATE TABLE "_BlogCategoryToBlogPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogCategoryToBlogPost_AB_unique" ON "_BlogCategoryToBlogPost"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogCategoryToBlogPost_B_index" ON "_BlogCategoryToBlogPost"("B");

-- AddForeignKey
ALTER TABLE "_BlogCategoryToBlogPost" ADD CONSTRAINT "_BlogCategoryToBlogPost_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCategoryToBlogPost" ADD CONSTRAINT "_BlogCategoryToBlogPost_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
