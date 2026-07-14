# PROMPT_admin_dashboard_evolution_phase_6.md

**Phase:** 6  
**Plan:** Admin Dashboard Evolution  
**Focus:** Blog Management with AI Topic Suggestion & Drafting  
**Type:** Fullstack

---

## Overview

Phase 6 implements the complete blog management system with AI-powered topic suggestions and full draft generation. Blog posts are created, edited, and managed using the Front Builder components, with AI assisting the content creation process.

**Dependencies:** Phase 3 (Front Builder Core) and Phase 4 (AI Integration) must be completed first.

---

## Objectives

1. **Blog Post Management** — Full CRUD for blog posts
2. **AI Topic Suggestion** — AI suggests blog topics based on industry trends
3. **AI Draft Generation** — AI generates full blog post drafts with structure
4. **Blog Editor** — Rich text editor with AI assistance
5. **Category & Tag Management** — Organize blog content
6. **Scheduling** — Schedule posts for future publication

---

## Implementation Steps

### Step 1: Create Blog Post Model Updates

**File:** `packages/db/prisma/schema.prisma` (additions)

```prisma
model BlogPost {
  id                  String      @id @default(cuid())
  title               String
  slug                String      @unique
  excerpt             String?     @db.Text
  content             Json        // Block-based content
  coverImageUrl       String?
  authorId            String
  categoryId          String?
  status              BlogStatus  @default(DRAFT)
  publishedAt         DateTime?
  scheduledAt         DateTime?
  aiTopicSuggestion   String?     // AI-generated topic
  aiDraftContent     Json?       // AI-generated draft
  views               Int         @default(0)
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  author              User        @relation(fields: [authorId], references: [id])
  category            BlogCategory? @relation(fields: [categoryId], references: [id])
  tags                BlogTag[]
}

model BlogCategory {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String?
  posts       BlogPost[]
}

model BlogTag {
  id    String     @id @default(cuid())
  name  String
  slug  String     @unique
  posts BlogPost[]
}
```

### Step 2: Create Blog Post List Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx`

**Requirements:**

- Table/grid of blog posts
- Columns: Title, Author, Category, Status, Date, Views
- Filter by status: All, Draft, Published, Scheduled
- Filter by category
- Search by title
- Quick actions: Edit, Preview, Delete, Duplicate
- Create new post button

### Step 3: Create Blog Post Editor

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/[postId]/page.tsx`

**Requirements:**

- Split layout: Editor + Preview
- Title input
- Excerpt editor
- Cover image upload + AI generation
- Category selector
- Tags input
- Status selector (Draft/Published/Scheduled)
- Publish date picker (for scheduling)
- Content blocks (use Front Builder blocks: Hero, Text, Image, Quote, etc.)

```tsx
export default function BlogEditorPage({
  params,
}: {
  params: { postId: string };
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>(
    'content'
  );

  return (
    <div className="flex h-screen">
      {/* Editor Panel */}
      <div className="w-[400px] border-r overflow-y-auto p-4">
        <Input
          placeholder="Post title..."
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="text-xl font-black mb-4"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {/* Cover image, excerpt, category, tags */}
          </TabsContent>

          <TabsContent value="seo">
            {/* Meta title, description, slug */}
          </TabsContent>

          <TabsContent value="settings">
            {/* Status, publish date, author */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto prose">
          <ContentBlocksRenderer blocks={post.content} />
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create AI Topic Suggestion Feature

**File:** `apps/admin-dashboard/src/components/cms/blog/ai-topic-suggester.tsx`

**Requirements:**

- Button to generate topics
- Generates 3-5 topic suggestions
- Each topic shows: Title, Excerpt, Target keywords
- Click to select and create draft

```tsx
export function AITopicSuggester({ onSelect }: AITopicSuggesterProps) {
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTopics = async () => {
    setIsLoading(true);
    const response = await fetch('/api/cms/blog/suggest-topics', {
      method: 'POST',
    });
    const data = await response.json();
    setSuggestions(data.topics);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={generateTopics} disabled={isLoading}>
        <Sparkles className="h-4 w-4" />
        {isLoading ? 'Generating Topics...' : 'Suggest Topics'}
      </Button>

      <div className="grid gap-2">
        {suggestions.map((topic, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:border-primary/50"
            onClick={() => onSelect(topic)}
          >
            <CardContent className="p-4">
              <h4 className="font-black uppercase">{topic.title}</h4>
              <p className="text-sm text-ds-text-subtle">{topic.excerpt}</p>
              <div className="flex gap-2 mt-2">
                {topic.keywords.map((kw: string) => (
                  <Badge key={kw} variant="outline" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Step 5: Create AI Draft Generator

**File:** `apps/admin-dashboard/src/components/cms/blog/ai-draft-generator.tsx`

**Requirements:**

- Input for topic/title
- Generates full blog post structure:
  - Introduction
  - 3-4 main sections with headings
  - Conclusion
- Includes both EN and AR content
- Includes suggested cover image prompt
- Insert into editor button

```tsx
export function AIDraftGenerator({ topic, onInsert }: AIDraftGeneratorProps) {
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraft = async () => {
    setIsGenerating(true);
    const response = await fetch('/api/cms/blog/generate-draft', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    setDraft(data.draft);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={generateDraft} disabled={isGenerating || !topic}>
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Draft...' : 'Generate Full Draft'}
      </Button>

      {draft && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" /> AI Generated
              </Badge>
              <Button onClick={() => onInsert(draft)} size="sm">
                Insert Draft
              </Button>
            </div>
            <h4 className="font-black">{draft.title}</h4>
            <p className="text-sm text-ds-text-subtle mt-2">
              {draft.sections.length} sections generated
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Step 6: Create Blog Topic Suggestion API

**File:** `apps/admin-dashboard/src/app/api/cms/blog/suggest-topics/route.ts`

**Requirements:**

- Analyze trending topics in PropTech/security/PropTech
- Generate 3-5 topic suggestions
- Include title, excerpt, keywords for each

### Step 7: Create Blog Draft Generation API

**File:** `apps/admin-dashboard/src/app/api/cms/blog/generate-draft/route.ts`

**Requirements:**

- Accept topic
- Generate full blog post structure
- Include EN and AR content
- Return block-based content compatible with Front Builder
- Log AI action

### Step 8: Create Category Management

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/categories/page.tsx`

**Requirements:**

- List categories
- Add/Edit/Delete categories
- Category slug auto-generation

### Step 9: Create Tag Management

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/tags/page.tsx`

**Requirements:**

- List tags
- Add/Edit/Delete tags
- Tag slug auto-generation

### Step 10: Create Blog API Routes

**Files:**

- `apps/admin-dashboard/src/app/api/cms/blog/route.ts` — CRUD operations
- `apps/admin-dashboard/src/app/api/cms/blog/[postId]/route.ts` — Single post operations

---

## API Requirements

### Suggest Topics

**Endpoint:** `POST /api/cms/blog/suggest-topics`

**Response:**

```json
{
  "topics": [
    {
      "title": "The Future of Smart Gate Access in MENA",
      "excerpt": "Exploring how AI and IoT are transforming perimeter security...",
      "keywords": ["smart gates", "AI security", "MENA", "IoT"]
    }
  ]
}
```

### Generate Draft

**Endpoint:** `POST /api/cms/blog/generate-draft`

**Request:**

```json
{
  "topic": "The Future of Smart Gate Access in MENA"
}
```

**Response:**

```json
{
  "draft": {
    "title": "The Future of Smart Gate Access in MENA",
    "excerpt": "The Middle East is witnessing a revolution in perimeter security...",
    "content": {
      "blocks": [
        {
          "type": "HERO",
          "content": { "headline": "The Future of Smart Gate Access" }
        },
        { "type": "TEXT", "content": { "body": "Introduction paragraph..." } }
        // ... more blocks
      ]
    },
    "en": {
      /* full content */
    },
    "ar": {
      /* full Arabic translation */
    }
  }
}
```

---

## Design System Enforcement (ADS)

All blog components use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<Card style={{
  backgroundColor: token('ds.background.default'),
  borderColor: token('ds.border'),
}}>

// ❌ WRONG
<Card className="bg-white border">
```

---

## Multi-Language (EN + AR RTL)

Blog management supports both languages:

```tsx
// Blog content structure
interface BlogPost {
  title: string;
  titleAr: string;
  content: {
    blocks: Block[];
  };
  excerpt: string;
  excerptAr: string;
}

// Editor shows language toggle
<Editor locale={activeLocale} />;
```

**RTL Requirements:**

- Arabic content input with correct direction
- Preview shows RTL layout
- Published blog respects language preference

---

## Human Confirmation Gate

AI-generated blog content requires human review:

1. **Detection:** Mark drafts with `aiGenerated: true`
2. **Warning:** Show AI-generated badge in editor
3. **Review:** Require checklist completion before publish
4. **Audit:** Log all AI generation and publish actions

---

## Acceptance Criteria

### Blog Post Management

- [ ] Can create, read, update, delete blog posts
- [ ] List shows all posts with filters
- [ ] Status workflow works (Draft → Published)

### AI Topic Suggestion

- [ ] Generates 3-5 topic suggestions
- [ ] Each suggestion shows title, excerpt, keywords
- [ ] Clicking suggestion creates draft

### AI Draft Generation

- [ ] Generates full blog post structure
- [ ] Content includes EN and AR
- [ ] Block-based content compatible with builder

### Blog Editor

- [ ] Title input works
- [ ] Cover image upload works
- [ ] Category/tags selection works
- [ ] Content blocks editable
- [ ] SEO fields present

### Scheduling

- [ ] Can schedule posts for future
- [ ] Scheduled posts publish automatically

### Category & Tags

- [ ] Category CRUD works
- [ ] Tag CRUD works

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/cms/blog/ai-topic-suggester.tsx`
- `apps/admin-dashboard/src/components/cms/blog/ai-draft-generator.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/[postId]/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/categories/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/tags/page.tsx`
- `apps/admin-dashboard/src/app/api/cms/blog/route.ts`
- `apps/admin-dashboard/src/app/api/cms/blog/[postId]/route.ts`
- `apps/admin-dashboard/src/app/api/cms/blog/suggest-topics/route.ts`
- `apps/admin-dashboard/src/app/api/cms/blog/generate-draft/route.ts`

### Files to Modify

- `packages/db/prisma/schema.prisma` → add BlogPost, BlogCategory, BlogTag models
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx` → implement list

### Database

- `packages/db/prisma/migrations/` → new migration for blog models

---

## Estimated Effort

**Complexity:** High  
**Files:** ~12  
**Key Challenge:** Building AI topic/draft generation that produces quality blog content in both languages

---

## Next Phase

**Phase 7: Task Manager AI Automation for Blog & Landing Page Creation**

This phase implements dedicated AI bots in the Task Manager that automatically create blog posts and landing page drafts, feeding them directly into the Front Builder for human review.
