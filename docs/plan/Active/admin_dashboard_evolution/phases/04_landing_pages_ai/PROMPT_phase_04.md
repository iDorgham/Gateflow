# PROMPT_admin_dashboard_evolution_phase_4.md

**Phase:** 4  
**Plan:** Admin Dashboard Evolution  
**Focus:** Landing Pages with AI Content & Image Generation  
**Type:** Frontend / Fullstack

---

## Overview

Phase 4 adds AI-powered content and image generation to the Front Builder, creating a complete workflow for landing page creation. This includes AI section generation, image generation, preview mode, and human-in-the-loop publishing workflow.

**Dependencies:** Phase 3 (Front Builder Core) must be completed first.

---

## Objectives

1. **AI Section Generation** — Generate block content from text prompts using Vercel AI SDK
2. **AI Image Generation** — Generate hero images and section backgrounds
3. **Preview Mode** — Full-screen preview of landing page
4. **Publish Workflow** — Save draft, review, and publish with human confirmation
5. **Landing Page Management** — List, edit, duplicate, delete landing pages

---

## Implementation Steps

### Step 1: Create AI Section Generator Hook

**File:** `apps/admin-dashboard/src/hooks/use-ai-section-generator.ts`

**Requirements:**

- Use Vercel AI SDK for streaming responses
- Accept prompt and block type
- Generate content for both EN and AR
- Return structured block content

```tsx
import { useAIStream } from 'ai';

interface GenerateSectionParams {
  prompt: string;
  blockType: Block['type'];
}

export function useAISectionGenerator() {
  const { submit, isLoading, output } = useAIStream({
    api: '/api/cms/generate-section',
  });

  const generateSection = async ({
    prompt,
    blockType,
  }: GenerateSectionParams) => {
    const response = await submit({
      prompt,
      blockType,
    });
    return response;
  };

  return { generateSection, isLoading, output };
}
```

### Step 2: Create AI Section Generator API

**File:** `apps/admin-dashboard/src/app/api/cms/generate-section/route.ts`

**Requirements:**

- Accept prompt and block type
- Use Vercel AI SDK to generate content
- Return content for both EN and AR
- Log AI action for audit

```tsx
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

const sectionSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  body: z.string(),
  ctaText: z.string(),
  ctaLink: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: Request) {
  const { prompt, blockType } = await req.json();

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: sectionSchema,
    prompt: `Generate marketing content for a ${blockType} section. ${prompt}`,
  });

  return Response.json({ section: result.object });
}
```

### Step 3: Integrate AI Section Generator into Builder

**File:** `apps/admin-dashboard/src/components/cms/builder/ai-section-generator.tsx`

**Requirements:**

- Floating button or panel in builder
- Text input for prompt
- Generate button with loading state
- Insert generated content into canvas

```tsx
export function AISectionGenerator({ onInsert }: AISectionGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const { generateSection, isLoading } = useAISectionGenerator();

  const handleGenerate = async () => {
    const section = await generateSection({ prompt, blockType: 'HERO' });
    onInsert(section);
  };

  return (
    <div className="ai-generator">
      <Label>AI Section Architect</Label>
      <Textarea
        placeholder="Describe your section..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
}
```

### Step 4: Create AI Image Generator Hook

**File:** `apps/admin-dashboard/src/hooks/use-ai-image-generator.ts`

**Requirements:**

- Use AI image generation endpoint
- Accept prompt describing desired image
- Return image URL
- Handle generation errors

```tsx
export function useAIImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cms/generate-image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImageUrl(data.imageUrl);
      return data.imageUrl;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateImage, isGenerating, imageUrl };
}
```

### Step 5: Create AI Image Generator API

**File:** `apps/admin-dashboard/src/app/api/cms/generate-image/route.ts`

**Requirements:**

- Accept image prompt
- Generate image using configured provider (e.g., DALL-E, Stable Diffusion)
- Store image and return URL
- Log AI action for audit

### Step 6: Add Image Controls to Style Panel

**File:** `apps/admin-dashboard/src/components/cms/builder/style-panel.tsx`

**Requirements:**

- Add "Background Image" control to style panel
- Upload button for custom images
- AI Generate button
- Image fit options: Cover, Contain, Auto

```tsx
// In StylePanel component
<Accordion type="multiple" defaultValue={['background']}>
  <AccordionItem value="background">
    <AccordionTrigger>Background</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-2">
        <Label>Image</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateImage(prompt)}
          >
            <Sparkles className="h-4 w-4" /> AI Generate
          </Button>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Step 7: Create Preview Mode

**File:** `apps/admin-dashboard/src/components/cms/builder/preview-modal.tsx`

**Requirements:**

- Full-screen modal
- Render all blocks as they would appear when published
- Mobile/Tablet/Desktop toggle
- Close button to return to editor

```tsx
export function PreviewModal({ blocks, isOpen, onClose }: PreviewModalProps) {
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-[100vw] h-[100vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-black uppercase">Preview</h2>
            <div className="flex gap-2">
              <Button
                variant={breakpoint === 'desktop' ? 'secondary' : 'ghost'}
                onClick={() => setBreakpoint('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              {/* ... tablet, mobile */}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted p-8">
            <div
              className={cn(
                'mx-auto bg-white shadow-xl',
                breakpoint === 'mobile'
                  ? 'max-w-sm'
                  : breakpoint === 'tablet'
                    ? 'max-w-2xl'
                    : 'max-w-full'
              )}
            >
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 8: Create Publish Workflow with Human Confirmation

**File:** `apps/admin-dashboard/src/components/cms/builder/publish-dialog.tsx`

**Requirements:**

- Show diff between current draft and published version
- AI-generated content highlighted
- Confirm button requires human action
- Cancel returns to editor

```tsx
export function PublishDialog({
  isOpen,
  onClose,
  onConfirm,
  aiGeneratedCount,
}: PublishDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Landing Page</DialogTitle>
          <DialogDescription>
            You are about to publish a page with {aiGeneratedCount} AI-generated
            sections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Content Detected</AlertTitle>
            <AlertDescription>
              This page contains {aiGeneratedCount} sections generated by AI.
              Please review all content before publishing.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Review Checklist</Label>
            <div className="space-y-1">
              <Checkbox id="review-content" />
              <Label htmlFor="review-content">
                I have reviewed all text content
              </Label>
            </div>
            <div className="space-y-1">
              <Checkbox id="review-images" />
              <Label htmlFor="review-images">I have reviewed all images</Label>
            </div>
            <div className="space-y-1">
              <Checkbox id="review-links" />
              <Label htmlFor="review-links">
                I have verified all links work
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 9: Implement Save & Publish API

**File:** `apps/admin-dashboard/src/app/api/cms/landing-pages/[id]/route.ts`

**Requirements:**

- PATCH to save draft
- POST to publish (requires confirmation)
- Version management for drafts
- Audit logging

```tsx
// PATCH - Save Draft
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { blocks, metadata } = await req.json();

  const landingPage = await prisma.landingPage.update({
    where: { id: params.id },
    data: {
      blocks: JSON.stringify(blocks),
      metadata,
      updatedAt: new Date(),
    },
  });

  return Response.json({ landingPage });
}

// POST - Publish
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { confirmed } = await req.json();

  if (!confirmed) {
    return Response.json({ error: 'Confirmation required' }, { status: 400 });
  }

  const landingPage = await prisma.landingPage.update({
    where: { id: params.id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      version: { increment: 1 },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'LANDING_PAGE_PUBLISHED',
      resourceId: params.id,
      userId: getCurrentUserId(),
    },
  });

  return Response.json({ landingPage });
}
```

### Step 10: Create Landing Page Management Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx`

**Requirements:**

- Grid of landing pages with thumbnails
- Status badges (Draft, Published, Scheduled)
- Quick actions: Edit, Preview, Duplicate, Delete
- Create new button

---

## Human Confirmation Gate

Every AI-generated element requires explicit human review before publishing:

1. **Detection:** Mark blocks with `aiGenerated: true` metadata
2. **Warning:** Show dialog listing AI-generated content count before publish
3. **Checklist:** Require user to check boxes confirming review
4. **Audit:** Log who confirmed and when

---

## API Requirements

### Generate Section Content

**Endpoint:** `POST /api/cms/generate-section`

**Request:**

```json
{
  "prompt": "Modern security features for luxury compounds",
  "blockType": "FEATURES"
}
```

**Response:**

```json
{
  "section": {
    "en": {
      "headline": "Enterprise-Grade Security Features",
      "items": [
        {
          "title": "HMAC-SHA256 Verification",
          "description": "Military-grade cryptographic signing"
        }
      ]
    },
    "ar": {
      "headline": "ميزات أمان على مستوى المؤسسات",
      "items": [
        { "title": "تحقق HMAC-SHA256", "description": "توقيع تشفيري عسكري" }
      ]
    }
  }
}
```

### Generate Image

**Endpoint:** `POST /api/cms/generate-image`

**Request:**

```json
{
  "prompt": "Modern luxury compound gate with modern architecture, golden hour lighting"
}
```

**Response:**

```json
{
  "imageUrl": "https://storage.gateflow.site/ai-images/img_xxx.jpg"
}
```

---

## Design System Enforcement (ADS)

All UI elements use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<Button
  style={{
    backgroundColor: token('ds.background.brand.bold'),
    color: token('ds.icon.inverse'),
  }}
>
  Publish
</Button>

// ❌ WRONG
<Button className="bg-blue-600 text-white">Publish</Button>
```

---

## Multi-Language (EN + AR RTL)

AI generation must produce both languages:

```tsx
// API generates both
const content = {
  en: { headline: 'Welcome to GateFlow', ... },
  ar: { headline: 'مرحباً بكم في GateFlow', ... }
};

// Canvas shows selected locale
<Canvas activeLocale={activeLocale} blocks={blocks} />
```

**RTL Requirements:**

- Generated Arabic content flows correctly
- AI prompt can specify language preference
- Layout automatically adjusts for RTL

---

## Acceptance Criteria

### AI Section Generation

- [ ] AI generates content from prompts
- [ ] Content includes both EN and AR
- [ ] Generated content insertable into canvas
- [ ] Loading state shown during generation

### AI Image Generation

- [ ] AI generates images from prompts
- [ ] Generated images usable as backgrounds
- [ ] Images stored and accessible
- [ ] Generation logged for audit

### Preview Mode

- [ ] Full-screen preview works
- [ ] Breakpoint toggles work
- [ ] Content renders as published

### Publish Workflow

- [ ] Save draft works
- [ ] Publish dialog shows AI content warning
- [ ] Human confirmation required
- [ ] Audit log entries created

### Landing Page Management

- [ ] List shows all landing pages
- [ ] Thumbnails display
- [ ] Status badges visible
- [ ] Quick actions work

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/hooks/use-ai-section-generator.ts`
- `apps/admin-dashboard/src/hooks/use-ai-image-generator.ts`
- `apps/admin-dashboard/src/components/cms/builder/ai-section-generator.tsx`
- `apps/admin-dashboard/src/components/cms/builder/preview-modal.tsx`
- `apps/admin-dashboard/src/components/cms/builder/publish-dialog.tsx`
- `apps/admin-dashboard/src/app/api/cms/generate-section/route.ts`
- `apps/admin-dashboard/src/app/api/cms/generate-image/route.ts`
- `apps/admin-dashboard/src/app/api/cms/landing-pages/[id]/route.ts`

### Files to Modify

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx` → add management features
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/[pageId]/page.tsx` → add AI generator integration

---

## Estimated Effort

**Complexity:** High  
**Files:** ~10  
**Key Challenge:** Integrating AI generation with the builder while maintaining human confirmation gates

---

## Next Phase

**Phase 5: Pages & Menus Builder**

This phase implements general pages editing and the visual drag-and-drop menu builder with RTL support.
