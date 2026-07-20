-- NO-OP (2026-07-20)
-- Original SQL renamed `_BlogPostToBlogCategory` → `_BlogCategoryToBlogPost`, but that join
-- table is created later by `20260405181800_add_blog_cms`. Applying the rename before the
-- create fails on empty/prod DBs (P3009). Later schema uses BlogPost.categoryId (1:N).
-- Keep this migration as an empty applied step for history continuity.
SELECT 1;
