# PROMPT_admin_dashboard_evolution_phase_2.md

**Phase:** 2  
**Plan:** Admin Dashboard Evolution  
**Focus:** CMS Section Shell + Settings for www.gateflow.site  
**Type:** Frontend / Fullstack

---

## Overview

Phase 2 builds the CMS section shell and implements Settings specifically for `www.gateflow.site`. This includes SEO configuration, header tags, security settings, performance tuning, and cache management.

**Dependencies:** Phase 1 must be completed first (CMS routes already exist as placeholders).

---

## Objectives

1. **Build CMS Layout Shell** — Sidebar nav for CMS section with nested routes
2. **Implement CMS Settings** — SEO, Header Tags, Security, Performance, Cache for www.gateflow.site
3. **Create Page Listing** — List all CMS pages with status indicators
4. **Setup Landing Page Shell** — Placeholder for Landing Page management

---

## Implementation Steps

### Step 1: Create CMS Layout

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/layout.tsx`

**Requirements:**

- Nested layout for CMS section
- CMS-specific sidebar navigation
- Breadcrumb showing CMS section
- Context: Site selection (www.gateflow.site)

```tsx
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <CmsNestedNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

### Step 2: Create CMS Nested Navigation

**File:** `apps/admin-dashboard/src/components/cms/cms-nested-nav.tsx`

**Requirements:**

- Vertical nav with: Pages, Landing Pages, Blog, Menus, Settings
- Visual hierarchy with section headers
- Active state highlighting
- Collapsible with smooth animation

**Navigation Items:**

```
CMS Section
├── Pages (/cms/pages)
├── Landing Pages (/cms/landing-pages)
├── Blog (/cms/blog)
├── Menus (/cms/menus)
└── Settings (/cms/settings)
```

### Step 3: Implement CMS Settings Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/settings/page.tsx`

**Requirements:**

- Tabbed interface for different setting categories
- Settings persist to database
- Form validation
- Preview of changes

**Setting Tabs:**

#### Tab 1: General Settings

- Site Name: `www.gateflow.site`
- Site Description
- Default Language: EN / AR
- Timezone

#### Tab 2: SEO Settings

- Meta Title Template: `{page_title} | GateFlow`
- Meta Description Template
- Open Graph Image URL
- Twitter Card Type
- robots.txt content
- sitemap.xml enabled

#### Tab 3: Header & Scripts

- Custom Header Scripts (Google Tag Manager, Meta Pixel)
- Custom CSS
- Favicon URL
- Apple Touch Icon
- Microsoft Tile Config

#### Tab 4: Security

- HTTPS Enforced
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

#### Tab 5: Performance

- Image Optimization enabled
- Lazy Loading enabled
- CDN URL
- Cache Duration (seconds)
- Minify HTML/CSS/JS

#### Tab 6: Cache Management

- Clear All Cache button
- Clear Static Assets
- Clear API Cache
- Cache Statistics display

**UI Pattern:**

```tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="seo">SEO</TabsTrigger>
    <TabsTrigger value="scripts">Header Scripts</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="performance">Performance</TabsTrigger>
    <TabsTrigger value="cache">Cache</TabsTrigger>
  </TabsList>
  <TabsContent value="general">{/* General settings form */}</TabsContent>
  <TabsContent value="seo">{/* SEO settings form */}</TabsContent>
  // ... etc
</Tabs>
```

### Step 4: Create Pages List Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx`

**Requirements:**

- Table showing all CMS pages
- Columns: Title, Slug, Status (Draft/Published), Last Modified, Author
- Actions: Edit, Preview, Delete, Duplicate
- Create New Page button
- Search and filter

**Data Model (conceptual):**

```tsx
interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt?: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
}
```

### Step 5: Create Landing Pages List

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx`

**Requirements:**

- Grid or list view of landing pages
- Preview thumbnails
- Status indicators
- Create New Landing Page button
- Filter by: status, campaign, date

### Step 6: Create Blog Management Page (Shell)

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx`

**Requirements:**

- List of blog posts
- Columns: Title, Author, Status, Publish Date, Views
- Create New Post button
- AI Topic Suggestion button (Phase 6 feature, create button placeholder)

### Step 7: Create Menu Builder Page (Shell)

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx`

**Requirements:**

- List of menus (Main, Footer, Mobile)
- Edit menu button
- Create new menu button
- Menu builder opens in modal/drawer

---

## API Requirements

### Get CMS Settings

**Endpoint:** `GET /api/cms/settings`

**Response:**

```json
{
  "settings": {
    "siteName": "GateFlow",
    "siteDescription": "Modern Digital Gate Infrastructure",
    "defaultLanguage": "en",
    "timezone": "Asia/Dubai",
    "seo": {
      "metaTitleTemplate": "{page_title} | GateFlow",
      "metaDescriptionTemplate": "",
      "ogImageUrl": "https://www.gateflow.site/og.jpg",
      "twitterCardType": "summary_large_image"
    },
    "headers": {
      "gtmId": "GTM-XXXXX",
      "metaPixelId": "",
      "customCss": "",
      "faviconUrl": "/favicon.ico"
    },
    "security": {
      "httpsEnforced": true,
      "cspEnabled": false,
      "xFrameOptions": "DENY"
    },
    "performance": {
      "imageOptimization": true,
      "lazyLoading": true,
      "cdnUrl": "",
      "cacheDuration": 3600
    }
  }
}
```

### Update CMS Settings

**Endpoint:** `PATCH /api/cms/settings`

**Request:**

```json
{
  "settings": {
    "seo": {
      "metaTitleTemplate": "{page_title} | GateFlow"
    }
  }
}
```

### List CMS Pages

**Endpoint:** `GET /api/cms/pages`

**Response:**

```json
{
  "pages": [
    {
      "id": "page_xxx",
      "title": "Home",
      "slug": "/",
      "status": "published",
      "updatedAt": "2026-04-05T..."
    }
  ]
}
```

### Create CMS Page

**Endpoint:** `POST /api/cms/pages`

**Request:**

```json
{
  "title": "About Us",
  "slug": "/about",
  "content": { ... }
}
```

---

## Design System Enforcement (ADS)

All components must use ADS tokens:

```tsx
// ✅ CORRECT
import { token } from '@atlaskit/tokens';
<Card style={{ backgroundColor: token('ds.background.default') }}>
  <CardContent style={{ padding: token('ds.space.300') }}>

// ❌ WRONG
<Card className="bg-white p-4">
```

**Required Patterns:**

- Forms use `Label`, `Input`, `Textarea` from @gate-access/ui
- Buttons use `Button` with proper variants
- Tables use `@gate-access/ui` Table components if available
- Tabs use `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

---

## Multi-Language (EN + AR RTL)

All labels must be translated:

```tsx
const { t } = useTranslation();
// Tab labels
<TabsTrigger value="general">{t('cms:settings.general', 'General')}</TabsTrigger>
<TabsTrigger value="seo">{t('cms:settings.seo', 'SEO')}</TabsTrigger>
<TabsTrigger value="scripts">{t('cms:settings.scripts', 'Header Scripts')}</TabsTrigger>
```

**RTL Requirements:**

- Form labels align correctly
- Input text direction follows content
- Tab order reversed for RTL

---

## Security Requirements

1. **Authorization:** Only platform admins can access CMS settings
2. **Validation:** Validate all settings inputs server-side
3. **Sanitization:** Sanitize custom CSS and scripts
4. **Audit Log:** Log all settings changes

---

## Acceptance Criteria

### CMS Layout

- [ ] CMS layout renders with nested nav
- [ ] Active tab highlighted
- [ ] All CMS routes accessible

### Settings Page

- [ ] All 6 tabs render with forms
- [ ] Settings load from API
- [ ] Settings save to API
- [ ] Form validation works
- [ ] Success toasts on save

### Pages List

- [ ] Table displays all pages
- [ ] Create button navigates to editor
- [ ] Edit button navigates to editor
- [ ] Delete shows confirmation

### Landing Pages List

- [ ] Grid displays landing pages
- [ ] Status indicators visible
- [ ] Create button works

### Blog List

- [ ] List displays blog posts
- [ ] Status column visible

### Menus List

- [ ] List displays menus
- [ ] Edit opens menu builder

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/components/cms/cms-nested-nav.tsx`

### Files to Modify

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/settings/page.tsx` → implement settings
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/pages/page.tsx` → implement page list
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/landing-pages/page.tsx` → implement LP list
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/blog/page.tsx` → implement blog list
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/menus/page.tsx` → implement menu list
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/cms/layout.tsx` → implement layout

### API Files to Create

- `packages/api/src/cms/settings.ts` (or extend existing)
- `packages/api/src/cms/pages.ts`

---

## Estimated Effort

**Complexity:** Medium  
**Files:** ~10  
**Key Challenge:** Building comprehensive settings forms with proper validation

---

## Next Phase

**Phase 3: Advanced Webflow-like Front Builder Core**

This phase implements the visual drag-and-drop canvas, style panel, responsive breakpoint controls, component library, and inline editing. The builder must feel powerful like Webflow while remaining safe and maintainable on structured React blocks.
