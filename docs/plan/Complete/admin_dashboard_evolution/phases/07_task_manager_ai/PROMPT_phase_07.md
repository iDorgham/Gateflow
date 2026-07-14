# PROMPT_admin_dashboard_evolution_phase_7.md

**Phase:** 7  
**Plan:** Admin Dashboard Evolution  
**Focus:** Task Manager AI Automation for Blog & Landing Page Creation  
**Type:** Fullstack

---

## Overview

Phase 7 creates dedicated AI automation bots in the Task Manager specifically for "Create Blog Post" and "Create Landing Page" tasks. These bots generate full drafts (structure, content, images) inside the Front Builder and queue them for team review and confirmation before publishing to `www.gateflow.site`.

**Dependencies:** Phase 4 (AI Integration) and Phase 6 (Blog Management) must be completed first.

---

## Objectives

1. **Task Bot System** — Framework for AI-powered task automation
2. **Blog Creation Bot** — Auto-generates blog post drafts from prompts
3. **Landing Page Bot** — Auto-generates landing page drafts from prompts
4. **Task Queue** — View and manage AI-generated drafts
5. **Human Review Flow** — Confirm/reject AI-generated content before publishing
6. **Task-Hub Integration** — Bots accessible from Task Hub interface

---

## Implementation Steps

### Step 1: Create Task Bot System Models

**File:** `packages/db/prisma/schema.prisma` (additions)

```prisma
model TaskBot {
  id             String        @id @default(cuid())
  name           String        // "Blog Writer", "Landing Page Generator"
  description    String?
  type           TaskBotType   // BLOG_WRITER, LANDING_PAGE_GENERATOR
  promptTemplate String       @db.Text // Template for AI prompts
  isActive       Boolean       @default(true)
  organizationId String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  runs           TaskBotRun[]
  rules          TaskBotRule[]
}

model TaskBotRun {
  id          String      @id @default(cuid())
  botId       String
  taskId      String?
  input       Json        // User input
  output      Json?       // Generated content
  status      BotRunStatus @default(PENDING)
  error       String?
  createdAt   DateTime    @default(now())
  completedAt DateTime?

  bot         TaskBot    @relation(fields: [botId], references: [id])
  task         Task?      @relation(fields: [taskId], references: [id])
}

enum TaskBotType {
  BLOG_WRITER
  LANDING_PAGE_GENERATOR
}

enum BotRunStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}
```

### Step 2: Create Task Hub Integration

**File:** `apps/admin-dashboard/src/components/tasks/task-bots-panel.tsx`

**Requirements:**

- Sidebar panel in Task Hub
- List of available bots
- Bot status indicators
- Quick action buttons

```tsx
export function TaskBotsPanel() {
  const bots = [
    {
      id: 'blog-writer',
      name: 'Blog Writer',
      description: 'Generate blog post drafts',
      icon: BookOpen,
    },
    {
      id: 'lp-generator',
      name: 'Landing Page Generator',
      description: 'Generate landing page drafts',
      icon: Rocket,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Task Bots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {bots.map((bot) => (
          <Button
            key={bot.id}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
          >
            <bot.icon className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-black uppercase text-sm">{bot.name}</p>
              <p className="text-xs text-ds-text-subtler">{bot.description}</p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
```

### Step 3: Create Blog Writer Bot Interface

**File:** `apps/admin-dashboard/src/components/tasks/bots/blog-writer-bot.tsx`

**Requirements:**

- Modal or panel for blog writing
- Input fields:
  - Topic/Title
  - Target keywords
  - Word count target
  - Tone (Professional, Casual, Technical)
- Generate button
- Progress indicator
- Preview of generated content

```tsx
export function BlogWriterBot() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<BlogDraft | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const response = await fetch('/api/tasks/bots/blog-writer', {
      method: 'POST',
      body: JSON.stringify({ topic, keywords, tone }),
    });
    const data = await response.json();
    setDraft(data.draft);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Topic or Title</Label>
        <Input
          placeholder="e.g., The Future of Smart Gate Access"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Target Keywords (comma-separated)</Label>
        <Input
          placeholder="smart gates, AI security, MENA"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !topic}
        className="w-full"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Draft...' : 'Generate Blog Post'}
      </Button>

      {draft && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black">{draft.title}</h4>
                <p className="text-sm text-ds-text-subtle">
                  {draft.sections.length} sections
                </p>
              </div>
              <Button onClick={() => openInEditor(draft)}>
                Open in Editor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Step 4: Create Landing Page Generator Bot Interface

**File:** `apps/admin-dashboard/src/components/tasks/bots/landing-page-bot.tsx`

**Requirements:**

- Modal or panel for landing page generation
- Input fields:
  - Page type (Product, Service, Event, Webinar)
  - Target audience
  - Key value propositions (up to 3)
  - Call-to-action goal
- Generate button
- Progress with section-by-section preview
- Open in Front Builder button

```tsx
export function LandingPageBot() {
  const [pageType, setPageType] = useState('product');
  const [audience, setAudience] = useState('');
  const [propositions, setPropositions] = useState(['', '', '']);
  const [ctaGoal, setCtaGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<LandingPageDraft | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const response = await fetch('/api/tasks/bots/landing-page', {
      method: 'POST',
      body: JSON.stringify({
        pageType,
        audience,
        propositions: propositions.filter(Boolean),
        ctaGoal,
      }),
    });
    const data = await response.json();
    setDraft(data.draft);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      {/* Form fields similar to Blog Writer */}

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !audience}
        className="w-full"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Landing Page...' : 'Generate Landing Page'}
      </Button>

      {isGenerating && (
        <div className="space-y-2">
          <p className="text-sm font-bold">Generating sections...</p>
          <Progress value={45} />
        </div>
      )}

      {draft && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-black">{draft.title}</h4>
            <div className="space-y-1 mt-2">
              {draft.sections.map((section, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>
                    {section.type}: {section.headline}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => openInBuilder(draft)}
            >
              Open in Front Builder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### Step 5: Create Blog Writer Bot API

**File:** `apps/admin-dashboard/src/app/api/tasks/bots/blog-writer/route.ts`

**Requirements:**

- Accept topic, keywords, tone
- Generate full blog post structure
- Save as draft blog post in database
- Return draft for review
- Log bot execution

```tsx
export async function POST(req: Request) {
  const { topic, keywords, tone } = await req.json();

  // Generate content using AI
  const result = await generateBlogContent({ topic, keywords, tone });

  // Create draft blog post
  const blogPost = await prisma.blogPost.create({
    data: {
      title: result.title,
      slug: slugify(result.title),
      excerpt: result.excerpt,
      content: JSON.stringify(result.blocks),
      status: 'DRAFT',
      aiDraftContent: JSON.stringify(result),
      authorId: getCurrentUserId(),
    },
  });

  // Create task for review
  const task = await prisma.task.create({
    data: {
      title: `Review: ${result.title}`,
      description: 'AI-generated blog post draft awaiting review',
      status: 'TODO',
      department: 'MARKETING',
      organizationId: getCurrentOrgId(),
      linkedType: 'BLOG_POST',
      linkedId: blogPost.id,
    },
  });

  // Log AI action
  await logAiAction({
    type: 'BLOG_DRAFT_GENERATED',
    input: { topic, keywords, tone },
    output: { postId: blogPost.id },
  });

  return Response.json({ draft: blogPost, task });
}
```

### Step 6: Create Landing Page Generator Bot API

**File:** `apps/admin-dashboard/src/app/api/tasks/bots/landing-page/route.ts`

**Requirements:**

- Accept pageType, audience, propositions, ctaGoal
- Generate full landing page structure with multiple blocks
- Save as draft landing page
- Return draft for review
- Log bot execution

```tsx
export async function POST(req: Request) {
  const { pageType, audience, propositions, ctaGoal } = await req.json();

  // Generate landing page sections
  const result = await generateLandingPage({
    pageType,
    audience,
    propositions,
    ctaGoal,
  });

  // Create draft landing page
  const landingPage = await prisma.landingPage.create({
    data: {
      title: result.title,
      slug: slugify(result.title),
      blocks: JSON.stringify(result.blocks),
      status: 'DRAFT',
      aiGenerated: true,
      organizationId: null, // Global site
    },
  });

  // Create task for review
  const task = await prisma.task.create({
    data: {
      title: `Review: ${result.title}`,
      description: 'AI-generated landing page draft awaiting review',
      status: 'TODO',
      department: 'MARKETING',
      organizationId: getCurrentOrgId(),
      linkedType: 'LANDING_PAGE',
      linkedId: landingPage.id,
    },
  });

  // Log AI action
  await logAiAction({
    type: 'LANDING_PAGE_DRAFT_GENERATED',
    input: { pageType, audience, propositions, ctaGoal },
    output: { pageId: landingPage.id },
  });

  return Response.json({ draft: landingPage, task });
}
```

### Step 7: Create Task Bot Runs Dashboard

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/tasks/bots/page.tsx`

**Requirements:**

- List of recent bot runs
- Status: Pending, Running, Completed, Failed
- View output button
- Retry failed runs
- Filter by bot type

```tsx
export function TaskBotsDashboard() {
  const [runs, setRuns] = useState<BotRun[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase">AI Bot Activity</h2>
      </div>

      <div className="space-y-2">
        {runs.map((run) => (
          <Card key={run.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StatusIndicator status={run.status} />
                <div>
                  <p className="font-black">{run.bot.name}</p>
                  <p className="text-xs text-ds-text-subtle">
                    {new Date(run.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewOutput(run)}
                >
                  View Output
                </Button>
                {run.status === 'FAILED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => retry(run)}
                  >
                    Retry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Step 8: Create Human Review Workflow

**File:** `apps/admin-dashboard/src/components/tasks/bots/review-dialog.tsx`

**Requirements:**

- Shows AI-generated content for review
- Diff view: original vs AI
- AI-generated sections highlighted
- Approve → publishes content
- Reject → deletes draft, marks task as rejected
- Comments field for feedback

```tsx
export function ReviewDialog({
  isOpen,
  onClose,
  onApprove,
  onReject,
  content,
  type,
}: ReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review AI-Generated {type}</DialogTitle>
          <DialogDescription>
            Please review the AI-generated content before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI-Generated Content</AlertTitle>
            <AlertDescription>
              This {type} was generated by AI. Please verify all content for
              accuracy.
            </AlertDescription>
          </Alert>

          {/* Content preview */}
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
            <ContentRenderer content={content} />
          </div>

          <div className="space-y-2">
            <Label>Comments (optional)</Label>
            <Textarea placeholder="Feedback for the AI or notes..." />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onReject}
            className="text-rose-500"
          >
            Reject
          </Button>
          <Button onClick={onApprove}>Approve & Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 9: Update Task Hub with Bot Integration

**File:** `apps/admin-dashboard/src/components/tasks/task-hub.tsx`

**Requirements:**

- Add "AI Bots" tab or section
- Quick access to Blog Writer and Landing Page Generator
- Show recent bot runs
- Link to Task Bots Dashboard

---

## Human Confirmation Workflow

Every AI-generated draft requires explicit human confirmation:

1. **Trigger:** User invokes bot with input
2. **Generation:** Bot generates draft, creates task
3. **Notification:** User notified of new draft awaiting review
4. **Review:** User opens task, reviews content
5. **Confirmation:** User clicks "Approve" or "Reject"
6. **Action:** Approved content published; Rejected content deleted
7. **Audit:** Both actions logged

---

## API Requirements

### Blog Writer Bot

**Endpoint:** `POST /api/tasks/bots/blog-writer`

**Request:**

```json
{
  "topic": "The Future of Smart Gate Access in MENA",
  "keywords": "smart gates, AI security, IoT, MENA",
  "tone": "professional"
}
```

**Response:**

```json
{
  "draft": {
    "id": "post_xxx",
    "title": "The Future of Smart Gate Access in MENA",
    "status": "DRAFT"
  },
  "task": {
    "id": "task_xxx",
    "title": "Review: The Future of Smart Gate Access in MENA"
  }
}
```

### Landing Page Generator Bot

**Endpoint:** `POST /api/tasks/bots/landing-page`

**Request:**

```json
{
  "pageType": "product",
  "audience": "Property developers in UAE",
  "propositions": [
    "HMAC-SHA256 security",
    "Offline-first verification",
    "Analytics dashboard"
  ],
  "ctaGoal": "Request demo"
}
```

---

## Design System Enforcement (ADS)

All bot components use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<Button style={{
  backgroundColor: token('ds.background.brand.bold'),
  color: token('ds.icon.inverse'),
}}>

// ❌ WRONG
<Button className="bg-blue-600 text-white">
```

---

## Acceptance Criteria

### Bot System

- [ ] Blog Writer bot generates full drafts
- [ ] Landing Page bot generates full drafts
- [ ] Both bots save drafts to database
- [ ] Both bots create review tasks

### Task Integration

- [ ] Tasks appear in Task Hub
- [ ] Tasks link to generated content
- [ ] Task status workflow works

### Human Review

- [ ] Review dialog shows content
- [ ] Approve publishes content
- [ ] Reject deletes draft
- [ ] Actions logged to audit

### Bot Dashboard

- [ ] Shows recent bot runs
- [ ] Shows status indicators
- [ ] View output works
- [ ] Retry failed runs works

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/tasks/bots-panel.tsx`
- `apps/admin-dashboard/src/components/tasks/bots/blog-writer-bot.tsx`
- `apps/admin-dashboard/src/components/tasks/bots/landing-page-bot.tsx`
- `apps/admin-dashboard/src/components/tasks/bots/review-dialog.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/[orgId]/tasks/bots/page.tsx`
- `apps/admin-dashboard/src/app/api/tasks/bots/blog-writer/route.ts`
- `apps/admin-dashboard/src/app/api/tasks/bots/landing-page/route.ts`

### Files to Modify

- `packages/db/prisma/schema.prisma` → add TaskBot, TaskBotRun models
- `apps/admin-dashboard/src/components/tasks/task-hub.tsx` → integrate bots panel

### Database

- New migration for bot models

---

## Estimated Effort

**Complexity:** High  
**Files:** ~10  
**Key Challenge:** Creating AI bots that generate high-quality drafts and integrating human review workflow

---

## Next Phase

**Phase 8: CRM, Support System, Analytics Dashboard & Team Roles**

This phase implements the dedicated CRM, Support System, Analytics Dashboard, and Team Roles sections with full functionality.
