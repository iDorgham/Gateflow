# PROMPT_admin_dashboard_evolution_phase_3.md

**Phase:** 3  
**Plan:** Admin Dashboard Evolution  
**Focus:** Advanced Webflow-like Front Builder Core  
**Type:** Frontend

---

## Overview

Phase 3 implements the core of the Webflow-like Front Builder - the visual drag-and-drop canvas, style panel, responsive breakpoint controls, component library, and inline editing. The builder must feel powerful like Webflow while remaining safe and maintainable on structured React blocks backed by ADS tokens.

**Dependencies:** Phase 2 (CMS Shell) must be completed first.

---

## Objectives

1. **Component Library** — Pre-built block components (Hero, Features, CTA, etc.)
2. **Drag-and-Drop Canvas** — Reorderable sections with visual feedback
3. **Style Panel** — Control spacing, colors, typography using ADS tokens
4. **Responsive Preview** — Desktop, Tablet, Mobile breakpoints
5. **Inline Editing** — Click to edit text content directly on canvas
6. **Real-time Preview** — See changes instantly

---

## Architecture

### Block System

The builder operates on **structured blocks**, not raw HTML. Each block is a React component that enforces ADS tokens.

```tsx
// Block structure
interface Block {
  id: string;
  type: 'HERO' | 'FEATURES' | 'SOCIAL_PROOF' | 'CTA' | 'FAQ' | 'BLOG_GRID' | 'TESTIMONIALS' | 'PRICING' | 'FOOTER';
  content: {
    // Type-safe content based on block type
    headline?: string;
    subheadline?: string;
    body?: string;
    ctaText?: string;
    ctaLink?: string;
    items?: Array<{ icon: string; title: string; description: string }>;
    // ...
  };
  styles: {
    backgroundColor?: string;
    paddingBlock?: string;
    paddingInline?: string;
    textAlign?: 'start' | 'center' | 'end';
    // ...
  };
  locales: {
    en: { ... };
    ar: { ... };
  };
}
```

### Component Library

| Block Type   | Description            | Variants                     |
| ------------ | ---------------------- | ---------------------------- |
| HERO         | Main headline + CTA    | Centered, Split, Video BG    |
| FEATURES     | Grid of feature items  | 2-col, 3-col, 4-col          |
| SOCIAL_PROOF | Client logos, stats    | Logo carousel, Stats counter |
| CTA          | Call-to-action section | Simple, With form            |
| FAQ          | Accordion Q&A          | Default, Expandable          |
| BLOG_GRID    | Recent posts grid      | 2-col, 3-col                 |
| TESTIMONIALS | Customer quotes        | Slider, Grid                 |
| PRICING      | Pricing tables         | 3-col, 4-col                 |
| FOOTER       | Site footer            | Default, Minimal             |

---

## Implementation Steps

### Step 1: Create Block Component Registry

**File:** `apps/admin-dashboard/src/components/cms/blocks/registry.tsx`

**Requirements:**

- Map block type strings to React components
- Export each block component
- Include block metadata (default content, style presets)

```tsx
import { HeroBlock } from './hero-block';
import { FeaturesBlock } from './features-block';
// ... other imports

export const BLOCK_REGISTRY = {
  HERO: {
    component: HeroBlock,
    label: 'Hero Section',
    icon: Layout,
    defaultContent: { headline: 'Welcome to GateFlow', ... },
  },
  FEATURES: {
    component: FeaturesBlock,
    label: 'Features Grid',
    icon: Box,
    defaultContent: { ... },
  },
  // ... etc
};
```

### Step 2: Create Hero Block Component

**File:** `apps/admin-dashboard/src/components/cms/blocks/hero-block.tsx`

**Requirements:**

- Use ADS tokens for all styling
- Support inline editing via `contentEditable`
- Support both EN and AR content
- RTL-aware layout

```tsx
export function HeroBlock({
  content,
  styles,
  locale = 'en',
  onContentChange,
}: BlockProps) {
  const { headline, subheadline, ctaText, ctaLink, backgroundImage } = content;

  return (
    <section
      style={{
        backgroundColor:
          styles.backgroundColor || token('ds.background.default'),
        paddingBlock: styles.paddingBlock || token('ds.space.500'),
        textAlign: styles.textAlign || 'center',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onContentChange('headline', e.currentTarget.textContent)
          }
          className="text-4xl font-black uppercase tracking-tight"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {headline}
        </h1>
        {/* ... more content */}
      </div>
    </section>
  );
}
```

### Step 3: Create Features Block Component

**File:** `apps/admin-dashboard/src/components/cms/blocks/features-block.tsx`

**Requirements:**

- Grid layout with configurable columns
- Icon + title + description for each item
- Add/remove feature items
- Reorder features

### Step 4: Create Remaining Block Components

Implement all block types:

- `cta-block.tsx`
- `social-proof-block.tsx`
- `faq-block.tsx`
- `blog-grid-block.tsx`
- `testimonials-block.tsx`
- `pricing-block.tsx`
- `footer-block.tsx`

### Step 5: Create Canvas Component

**File:** `apps/admin-dashboard/src/components/cms/builder/canvas.tsx`

**Requirements:**

- Render list of blocks
- Support drag-and-drop reordering via `@dnd-kit` or `framer-motion` Reorder
- Show drag handles on hover
- Click to select block for editing
- Responsive preview at different breakpoints

```tsx
export function Canvas({
  blocks,
  selectedBlockId,
  breakpoint,
  onSelectBlock,
  onReorderBlocks,
  onUpdateBlock,
}: CanvasProps) {
  return (
    <div className="canvas-container">
      <div className={cn('canvas-frame', breakpoint)}>
        <Reorder.Group axis="y" values={blocks} onReorder={onReorderBlocks}>
          {blocks.map((block) => (
            <Reorder.Item key={block.id} value={block}>
              <BlockWrapper
                isSelected={block.id === selectedBlockId}
                onSelect={() => onSelectBlock(block.id)}
              >
                <BlockRenderer
                  block={block}
                  onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                />
              </BlockWrapper>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
```

### Step 6: Create Style Panel Component

**File:** `apps/admin-dashboard/src/components/cms/builder/style-panel.tsx`

**Requirements:**

- Appears when block is selected
- Organized by category: Layout, Colors, Typography, Spacing
- Uses ADS tokens for all options
- Live updates to canvas

**Panel Sections:**

#### Layout

- Display: Block, Flex, Grid
- Flex Direction: Row, Column
- Justify Content: Start, Center, End, Between
- Align Items: Start, Center, End
- Gap: token('ds.space.100') through token('ds.space.500')

#### Colors

- Background: Color picker with preset tokens
- Text: Color picker with preset tokens
- Accent: Color picker with preset tokens

#### Typography

- Font Size: token('ds.typography.heading.500') etc
- Font Weight: Regular, Medium, Bold, Black
- Text Align: Start, Center, End
- Line Height: Tight, Normal, Relaxed

#### Spacing

- Padding Block: token('ds.space.100') through token('ds.space.500')
- Padding Inline: same
- Margin Block: same

```tsx
// Style panel usage
<div className="style-panel">
  <Label>Background Color</Label>
  <ColorPicker
    value={selectedBlock.styles.backgroundColor}
    onChange={(color) => updateStyle('backgroundColor', color)}
    presets={[
      token('ds.background.default'),
      token('ds.background.neutral'),
      token('ds.background.brand.bold'),
    ]}
  />
</div>
```

### Step 7: Create Breakpoint Controls

**File:** `apps/admin-dashboard/src/components/cms/builder/breakpoint-controls.tsx`

**Requirements:**

- Three buttons: Desktop, Tablet, Mobile
- Visual indicator of current breakpoint
- Canvas resizes accordingly
- Icons: Monitor, Tablet, Smartphone

```tsx
export function BreakpointControls({
  breakpoint,
  onChange,
}: BreakpointControlsProps) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={breakpoint === 'desktop' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('desktop')}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      {/* ... tablet, mobile */}
    </div>
  );
}
```

### Step 8: Create Page Editor Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/[pageId]/page.tsx`

**Requirements:**

- Full-screen editor layout
- Canvas on left/center
- Block library on left sidebar
- Style panel on right sidebar
- Top toolbar with preview, save, publish

```tsx
export default function PageEditorPage({
  params,
}: {
  params: { pageId: string };
}) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="flex h-screen">
      {/* Block Library Sidebar */}
      <BlockLibrary onAddBlock={addBlock} />

      {/* Canvas */}
      <Canvas
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        breakpoint={breakpoint}
        onSelectBlock={setSelectedBlockId}
        onReorderBlocks={setBlocks}
        onUpdateBlock={updateBlock}
      />

      {/* Style Panel */}
      {selectedBlockId && (
        <StylePanel
          block={blocks.find(b => b.id === selectedBlockId)}
          onUpdate={(updates) => updateBlock(selectedBlockId, updates)}
        />
      )}

      {/* Top Toolbar */}
      <EditorToolbar
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onPreview={...}
        onSave={...}
        onPublish={...}
      />
    </div>
  );
}
```

### Step 9: Create Block Library Sidebar

**File:** `apps/admin-dashboard/src/components/cms/builder/block-library.tsx`

**Requirements:**

- Grid of available blocks
- Click to add to canvas
- Visual preview of each block type
- Category tabs: Layout, Content, Marketing, Footers

---

## Design System Enforcement (ADS)

Every block component MUST use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<section style={{
  backgroundColor: token('ds.background.default'),
  paddingBlock: token('ds.space.400'),
  color: token('ds.text'),
}}>

// ❌ WRONG
<section className="bg-white py-16 text-gray-900">
```

**Token Usage by Category:**

- Colors: `ds.background.*`, `ds.text.*`, `ds.icon.*`, `ds.border.*`
- Spacing: `ds.space.100` through `ds.space.500`
- Typography: `ds.typography.heading.*`, `ds.typography.body.*`, `ds.typography.label.*`
- Radius: `ds.border.radius.*`

---

## Multi-Language (EN + AR RTL)

The builder must fully support bilingual content:

```tsx
// Block content structure
{
  content: {
    en: { headline: 'Welcome', ... },
    ar: { headline: 'مرحبا', ... }
  }
}

// Canvas renders selected locale
<Canvas locale={activeLocale} ... />

// Block components use locale prop
<h1 dir={locale === 'ar' ? 'rtl' : 'ltr'}>
  {content[locale].headline}
</h1>
```

**RTL Requirements:**

- Layout automatically flips for RTL (margin-inline-start vs margin-inline-end)
- Text alignment respects locale
- Icons maintain visual direction where appropriate
- Builder UI itself is RTL-aware

---

## Acceptance Criteria

### Block Components

- [ ] All 9 block types implemented
- [ ] Each block uses ADS tokens exclusively
- [ ] Blocks support EN and AR content
- [ ] Blocks are responsive

### Canvas

- [ ] Blocks can be reordered via drag-and-drop
- [ ] Blocks can be selected
- [ ] Selected block shows visual indicator
- [ ] Responsive preview works (desktop/tablet/mobile)

### Style Panel

- [ ] Opens when block selected
- [ ] Layout controls work
- [ ] Color picker uses ADS token presets
- [ ] Typography controls work
- [ ] Spacing controls work
- [ ] Changes reflect immediately on canvas

### Block Library

- [ ] Shows all available block types
- [ ] Click adds block to canvas
- [ ] Visual previews accurate

### Editor Page

- [ ] Full-screen editor layout renders
- [ ] Save persists block data
- [ ] Preview shows published look

### Preflight

- [ ] `pnpm preflight` passes on admin-dashboard
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/cms/blocks/registry.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/hero-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/features-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/cta-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/social-proof-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/faq-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/blog-grid-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/testimonials-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/pricing-block.tsx`
- `apps/admin-dashboard/src/components/cms/blocks/footer-block.tsx`
- `apps/admin-dashboard/src/components/cms/builder/canvas.tsx`
- `apps/admin-dashboard/src/components/cms/builder/style-panel.tsx`
- `apps/admin-dashboard/src/components/cms/builder/breakpoint-controls.tsx`
- `apps/admin-dashboard/src/components/cms/builder/block-library.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/[pageId]/page.tsx`

### Existing Files to Leverage

- `apps/admin-dashboard/src/components/cms/PageBuilder.tsx` → Reference for existing patterns
- `@gate-access/ui` → Existing components

---

## Estimated Effort

**Complexity:** High  
**Files:** ~15  
**Key Challenge:** Building a cohesive drag-and-drop system with style panel while maintaining ADS token discipline

---

## Next Phase

**Phase 4: Landing Pages with AI Content & Image Generation**

This phase adds AI-powered content generation, image generation, and the publish workflow for landing pages.
