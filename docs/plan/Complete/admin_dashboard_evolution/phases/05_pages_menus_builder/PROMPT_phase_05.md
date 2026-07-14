# PROMPT_admin_dashboard_evolution_phase_5.md

**Phase:** 5  
**Plan:** Admin Dashboard Evolution  
**Focus:** Pages & Menus Builder  
**Type:** Frontend

---

## Overview

Phase 5 implements general CMS pages editing using the Front Builder and creates a visual drag-and-drop menu builder with full RTL support for `www.gateflow.site`.

**Dependencies:** Phase 3 (Front Builder Core) and Phase 4 (Landing Pages with AI) must be completed first.

---

## Objectives

1. **General Pages Editor** — Use Front Builder for non-landing pages (About, Contact, etc.)
2. **Page Templates** — Pre-built page templates for quick start
3. **Menu Builder** — Visual drag-and-drop menu editor with nested items
4. **Menu Localization** — Full EN + AR menu support
5. **Menu Preview** — Live preview of menus in context

---

## Implementation Steps

### Step 1: Create Page Template Registry

**File:** `apps/admin-dashboard/src/components/cms/templates/page-templates.tsx`

**Requirements:**

- Pre-built page templates
- Each template includes a set of blocks
- Templates: Blank, About, Contact, Pricing, Features, Blog Listing

```tsx
export const PAGE_TEMPLATES = {
  blank: {
    id: 'blank',
    label: 'Blank Page',
    description: 'Start from scratch',
    blocks: [],
  },
  about: {
    id: 'about',
    label: 'About Us',
    description: 'Company information page',
    blocks: [
      { type: 'HERO', content: { headline: 'About GateFlow', ... } },
      { type: 'SOCIAL_PROOF', content: { ... } },
      { type: 'CTA', content: { ... } },
    ],
  },
  contact: {
    id: 'contact',
    label: 'Contact Us',
    description: 'Contact form and information',
    blocks: [
      { type: 'HERO', content: { headline: 'Get in Touch', ... } },
      // Contact form block would go here
      { type: 'FAQ', content: { ... } },
    ],
  },
  pricing: {
    id: 'pricing',
    label: 'Pricing',
    description: 'Pricing tables page',
    blocks: [
      { type: 'HERO', content: { ... } },
      { type: 'PRICING', content: { ... } },
      { type: 'CTA', content: { ... } },
    ],
  },
  features: {
    id: 'features',
    label: 'Features',
    description: 'Product features showcase',
    blocks: [
      { type: 'HERO', content: { ... } },
      { type: 'FEATURES', content: { ... } },
      { type: 'TESTIMONIALS', content: { ... } },
      { type: 'CTA', content: { ... } },
    ],
  },
};
```

### Step 2: Create Template Picker Modal

**File:** `apps/admin-dashboard/src/components/cms/templates/template-picker.tsx`

**Requirements:**

- Grid of available templates
- Preview thumbnail for each
- Select button to use template
- Create from blank option

```tsx
export function TemplatePicker({
  isOpen,
  onClose,
  onSelect,
}: TemplatePickerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template or create from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {Object.values(PAGE_TEMPLATES).map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelect(template)}
            >
              <CardContent className="p-4">
                <div className="h-24 bg-muted rounded-lg mb-2" />
                <h4 className="font-black uppercase text-sm">
                  {template.label}
                </h4>
                <p className="text-xs text-ds-text-subtler">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 3: Integrate Templates into Pages List

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx`

**Requirements:**

- Add "Create New" button shows template picker
- Template selection creates new page with blocks pre-populated
- Create from blank opens empty editor

### Step 4: Create Menu Builder Component

**File:** `apps/admin-dashboard/src/components/cms/menus/menu-builder.tsx`

**Requirements:**

- Tree view of menu items
- Drag-and-drop reordering
- Add/remove menu items
- Nested submenus (up to 2 levels)
- Link to CMS pages or external URLs

```tsx
interface MenuItem {
  id: string;
  label: string;
  labelAr: string;
  url: string;
  type: 'page' | 'external' | 'divider';
  children?: MenuItem[];
  openInNewTab?: boolean;
}

export function MenuBuilder({ items, onChange }: MenuBuilderProps) {
  return (
    <div className="menu-builder">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black uppercase">Menu Items</h3>
        <Button onClick={() => addItem()}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <MenuItemRow
            key={item.id}
            item={item}
            index={index}
            onUpdate={(updated) => updateItem(index, updated)}
            onDelete={() => deleteItem(index)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 5: Create Menu Item Row Component

**File:** `apps/admin-dashboard/src/components/cms/menus/menu-item-row.tsx`

**Requirements:**

- Label input (EN)
- Label input (AR)
- URL type selector (page/external)
- Page picker or URL input
- Toggle for "Open in new tab"
- Drag handle
- Delete button
- Expand for children (submenu)

```tsx
export function MenuItemRow({ item, onUpdate, onDelete }: MenuItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(!!item.children?.length);

  return (
    <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
      <DragHandle />

      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          placeholder="Label (English)"
          value={item.label}
          onChange={(e) => onUpdate({ ...item, label: e.target.value })}
        />
        <Input
          placeholder="Label (Arabic)"
          value={item.labelAr}
          onChange={(e) => onUpdate({ ...item, labelAr: e.target.value })}
          dir="rtl"
        />
      </div>

      <Select
        value={item.type}
        onValueChange={(type) =>
          onUpdate({ ...item, type: type as 'page' | 'external' | 'divider' })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="page">CMS Page</SelectItem>
          <SelectItem value="external">External URL</SelectItem>
          <SelectItem value="divider">Divider</SelectItem>
        </SelectContent>
      </Select>

      {item.type === 'page' ? (
        <PagePicker
          value={item.url}
          onChange={(url) => onUpdate({ ...item, url })}
        />
      ) : item.type === 'external' ? (
        <Input
          placeholder="https://..."
          value={item.url}
          onChange={(e) => onUpdate({ ...item, url: e.target.value })}
          className="w-48"
        />
      ) : null}

      <Checkbox
        checked={item.openInNewTab}
        onCheckedChange={(checked) =>
          onUpdate({ ...item, openInNewTab: checked })
        }
      />
      <Label className="text-xs">New Tab</Label>

      {item.type !== 'divider' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown className={cn(isExpanded && 'rotate-180')} />
        </Button>
      )}

      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-rose-500" />
      </Button>
    </div>
  );
}
```

### Step 6: Create Menu Settings

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx`

**Requirements:**

- List of menus: Main, Footer, Mobile
- Edit button opens menu builder
- Create new menu option
- Duplicate menu option
- Delete menu option with confirmation

### Step 7: Add Menu Preview

**File:** `apps/admin-dashboard/src/components/cms/menus/menu-preview.tsx`

**Requirements:**

- Real-time preview of menu
- Shows both EN and AR versions
- Responsive preview (desktop/mobile)
- Click handling shows where links go

```tsx
export function MenuPreview({
  items,
  locale = 'en',
  breakpoint = 'desktop',
}: MenuPreviewProps) {
  const localeItems = items.map((item) => ({
    ...item,
    label: locale === 'ar' ? item.labelAr : item.label,
  }));

  return (
    <div className={cn('menu-preview', breakpoint)}>
      {breakpoint === 'mobile' ? (
        <select className="w-full">
          {localeItems.map((item) => (
            <option key={item.id} value={item.url}>
              {item.label}
            </option>
          ))}
        </select>
      ) : (
        <ul className="flex gap-4">
          {localeItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Step 8: Create Menu API

**File:** `apps/admin-dashboard/src/app/api/cms/menus/route.ts`

**Requirements:**

- GET list menus
- GET single menu
- POST create menu
- PATCH update menu
- DELETE menu

---

## Database Schema (Conceptual)

```prisma
model Menu {
  id          String     @id @default(cuid())
  name        String     // "Main", "Footer", "Mobile"
  slug        String     @unique // "main", "footer", "mobile"
  items       Json       // Array of MenuItem
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model CmsPage {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  blocks      Json
  status      String     @default("draft")
  templateId  String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  publishedAt DateTime?
}
```

---

## Design System Enforcement (ADS)

All components use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<div style={{
  backgroundColor: token('ds.background.default'),
  borderColor: token('ds.border'),
  padding: token('ds.space.300'),
}}>

// ❌ WRONG
<div className="bg-white border p-4">
```

---

## Multi-Language (EN + AR RTL)

Menu builder fully supports both languages:

```tsx
// Each menu item has both labels
interface MenuItem {
  label: string;      // English
  labelAr: string;    // Arabic
  url: string;
}

// Preview toggles locale
<MenuPreview items={items} locale={activeLocale} />

// RTL preview
<div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

**RTL Requirements:**

- Labels input with `dir="rtl"` for Arabic
- Preview shows correct RTL layout
- Drag handles and controls respect RTL
- Menu items flow correctly in RTL

---

## Acceptance Criteria

### Page Templates

- [ ] Template picker modal works
- [ ] Templates pre-populate blocks
- [ ] Blank template creates empty page

### General Pages

- [ ] Pages use Front Builder
- [ ] Can create, edit, delete pages
- [ ] Page templates apply correctly

### Menu Builder

- [ ] Can create menu items
- [ ] Can reorder items via drag-and-drop
- [ ] Can nest items (2 levels)
- [ ] Can link to CMS pages or external URLs
- [ ] Can delete items

### Menu Localization

- [ ] EN label input works
- [ ] AR label input works
- [ ] Preview shows correct language

### Menu Preview

- [ ] Desktop preview works
- [ ] Mobile preview works
- [ ] Language toggle works

### API

- [ ] Menu CRUD operations work
- [ ] Pages CRUD operations work

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/cms/templates/page-templates.tsx`
- `apps/admin-dashboard/src/components/cms/templates/template-picker.tsx`
- `apps/admin-dashboard/src/components/cms/menus/menu-builder.tsx`
- `apps/admin-dashboard/src/components/cms/menus/menu-item-row.tsx`
- `apps/admin-dashboard/src/components/cms/menus/menu-preview.tsx`
- `apps/admin-dashboard/src/app/api/cms/menus/route.ts`

### Files to Modify

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx` → add template picker
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx` → implement menu management

---

## Estimated Effort

**Complexity:** Medium  
**Files:** ~8  
**Key Challenge:** Creating intuitive drag-and-drop menu builder with full RTL support

---

## Next Phase

**Phase 6: Blog Management with AI Topic Suggestion & Drafting**

This phase implements blog post management with AI-powered topic suggestions and full draft generation.
