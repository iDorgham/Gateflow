You are a Senior Product Designer and Frontend Engineer specializing in B2B SaaS landing pages with multi-language support. Perform a complete redesign of the GateFlow marketing website (apps/marketing) including navigation, all pages, footer, sitemap, app icons, with full shadcn/ui theming (light/dark) and i18n support (Arabic Egypt RTL + English LTR). Use shadcn/ui components with a token-based design system. This is a 2026-ready professional SaaS marketing site for a Gate Access Management platform targeting MENA real estate market.

## CONTEXT REFERENCES
Before starting, review these documents:
- PRD_v5.0.md: Product vision, target personas (Property Managers, Security Heads, Event Organizers), pricing tiers (Starter/Pro/Enterprise EGP 499-30k+), 5-app strategy, MENA market focus
- PROJECT_STRUCTURE.md: Monorepo structure, apps/marketing location, tech stack (Next.js 14, TypeScript, Tailwind, shadcn/ui), @gate-access/i18n package for AR/EN
- MVP_DONE_CHECKLIST.md: Marketing site status (Landing page ✅, Pricing ✅, Contact ✅, Open Graph ✅, Blog ❌ Phase 2), current completion ~30%
- MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md: Security considerations for public-facing pages, performance guidelines, security page content requirements
- RESIDENT_PORTAL_SPEC.md: Future Phase 2 feature context (do not over-design for resident portal yet, but plan navigation for it)

---

## 1. DESIGN SYSTEM REQUIREMENTS (shadcn/ui Theme Tokens — No Hardcoded Values)

### Color Tokens Strategy
- Use shadcn/ui default CSS variable names for all colors to ensure perfect light/dark mode matching
- Light mode: Follow shadcn/ui default light theme palette exactly
- Dark mode: Follow shadcn/ui default dark theme palette exactly
- Brand accents: Add success, warning, info tokens that complement shadcn/ui defaults
- All colors referenced via CSS variables only — zero hardcoded hex/rgb values

### Typography Tokens Strategy
- Define font families for English (Inter/system) and Arabic (IBM Plex Sans Arabic/Noto Sans Arabic)
- Create consistent type scale tokens from xs to 5xl with line-height and letter-spacing
- Use font weight tokens for visual hierarchy
- Apply Arabic fonts automatically when locale is ar-EG

### Spacing & Layout Tokens Strategy
- Container tokens for max-width and padding
- Section spacing tokens for vertical rhythm
- Space scale based on 4px increment system
- Border radius tokens matching shadcn/ui defaults
- Shadow scale for depth hierarchy

### Motion Tokens Strategy
- Duration tokens for fast/normal/slow animations
- Easing tokens for consistent motion curves
- Transition token for standard hover/focus states

---

## 2. INTERNATIONALIZATION (i18n) — ARABIC EGYPT + ENGLISH

### i18n Architecture
- Use existing @gate-access/i18n package for all translations
- Supported locales: English (en, LTR, default) and Arabic Egypt (ar-EG, RTL)
- Language switcher component with persistent selection via cookie
- Automatic direction handling: dir attribute on html element updates based on locale
- CSS logical properties for all spacing (ps-/pe-/ms-/me- instead of left/right)
- Tailwind RTL plugin enabled for automatic style flipping

### Translation Strategy
- All user-facing text wrapped in translation keys — no hardcoded strings
- Separate JSON files per locale for navigation, landing, pricing, contact, common
- Arabic translations culturally adapted for Egypt market (not generic Arabic)
- Fallback to English if Arabic translation missing

### Font Loading Strategy
- Load Arabic-optimized fonts only when ar-EG locale active
- Ensure proper font fallback chain for performance
- Test Arabic text rendering at all breakpoints

---

## 3. MAIN NAVIGATION MENU REDESIGN

### Nav Structure Requirements
- Responsive design: Desktop horizontal, mobile collapsible sheet
- Logo section: GateFlow brand mark linking to homepage
- Primary nav items: Product, Solutions, Pricing, Resources, Contact (all translated)
- Secondary actions: Sign In (outline), Start Free Trial (primary), Language Switcher, Theme Toggle
- Mobile: Hamburger menu using shadcn Sheet component with RTL-aware animation
- Sticky header with scroll-aware shadow token
- Active state indicator for current page
- Dropdown menus for Product and Solutions sections
- Full keyboard navigation support
- Focus ring using token variable

### Nav UX Requirements
- Backdrop blur effect on sticky header
- Smooth scroll behavior for anchor links
- Mobile breakpoint at 768px
- All interactive elements meet minimum touch target size
- ARIA labels for screen readers (translated per locale)

---

## 4. SITEMAP CREATION

### Sitemap Requirements
- Generate sitemap.xml with all static routes for both locales
- Include priority and change frequency metadata
- Add hreflang alternates for AR/EN versions of each page
- Exclude admin/dashboard routes from public sitemap
- Include future dynamic route patterns with lower priority
- Generate robots.txt with appropriate allow/disallow rules
- Submit sitemap location in robots.txt

### Route Structure
- Homepage, Product, Solutions (with 4 industry subpages), Pricing, Contact, Resources, Login redirect
- Legal pages: Privacy, Terms, Security, Cookies
- All routes prefixed with locale: /en/... and /ar/...

---

## 5. PAGE REDESIGNS (All Nav Menu Pages)

### Homepage Requirements
- Hero section: Bold headline, supporting subhead, dual CTAs, trust badges, abstract visual placeholder
- Problem/Solution grid: 3-column desktop layout with card components
- Features showcase: Tab or accordion pattern for key capabilities
- Social proof: Testimonial carousel and stats grid
- Pricing preview: 3-tier summary cards linking to full pricing page
- Final CTA: Gradient background section with email capture form

### Product Page Requirements
- Hero: Value-focused headline
- Feature grid: 6 key features with icons and descriptions
- Deep dive sections: QR system, Scanner app, Analytics, API/Webhooks
- Security section: Reference MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md content
- CTA: Start Free Trial

### Solutions Page Requirements
- Hero: "Built for Every Type of Venue" messaging
- Industry cards: Compounds, Schools, Events, Clubs with icons
- Use case details per industry
- Filterable testimonial carousel by industry
- CTA: Talk to Sales

### Solution Detail Pages Requirements (4 pages)
- Industry-specific hero and messaging
- Pain points mapped to GateFlow solutions
- Feature highlights relevant to that industry
- Industry-specific testimonials
- Tailored CTA

### Pricing Page Requirements
- Hero: "Simple, Transparent Pricing"
- Billing toggle: Monthly/Annual with discount indicator
- 3-tier cards: Starter, Pro, Enterprise with EGP pricing per PRD_v5.0.md
- Comparison table: Feature matrix across tiers
- FAQ accordion: Common pricing questions
- Enterprise CTA card

### Contact Page Requirements
- Two-column responsive layout
- Contact form with validation and success/error states
- Contact info cards: Email, Phone, Location, Social links
- Loading state during submission
- reCAPTCHA placeholder comment for future integration

### Resources Page Requirements (Placeholder)
- Hero: "Learn About GateFlow"
- Resource cards: Documentation, Blog (Phase 2), Case Studies (Phase 2), API Reference
- CTA: View Documentation

### Login Redirect Page Requirements
- Simple explanatory page for dashboard redirect
- Button linking to client-dashboard login
- Note about future SSO support (Phase 3)

### Legal Pages Requirements
- Privacy Policy, Terms of Service, Security, Cookies pages
- Security page content references MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md
- All pages available in both locales

---

## 6. FOOTER REDESIGN

### Footer Structure Requirements
- 4-column desktop layout, stacked mobile
- Brand column: Logo, tagline, social icons, language switcher, theme toggle
- Product column: Features, Pricing, Solutions, Changelog (Phase 2)
- Company column: About, Contact, Careers (Phase 2), Press (Phase 2)
- Legal column: Privacy, Terms, Security, Cookies
- Bottom bar: Copyright, Made in Egypt badge, language selector

### Footer UX Requirements
- Top border divider using token
- Consistent section padding tokens
- Hover states on all links using transition token
- RTL-aware layout: automatic flipping via logical properties
- Mobile: Vertical stack with appropriate spacing tokens

---

## 7. APP ICONS & ASSETS (Nano Banana 🍌 Integration)

### Asset Generation Strategy with Nano Banana 🍌
Use Nano Banana 🍌 to generate all visual assets with these specifications:

#### App Icons
- Favicon set: 16x16, 32x32, 48x48 in .ico and .png formats
- Apple Touch Icons: 180x180 with precomposed variant
- Android Icons: 192x192 and 512x512 in regular and maskable variants
- Design guidelines: GateFlow logo mark (abstract gate/QR fusion), primary color token, transparent or background token, 10% safe zone for maskable, no text

#### Hero & Section Visuals
- Abstract hero background: Subtle gate/QR pattern using primary/accent tokens
- Feature illustrations: Minimal line icons matching lucide-react style
- Industry-specific visuals: Compounds, Schools, Events, Clubs themed illustrations
- All visuals support both light and dark modes via token-aware generation

#### PWA Manifest Assets
- manifest.json with name, short_name, start_url, display, background_color (token), theme_color (token), icons array, dir support, lang support
- Icons generated via Nano Banana 🍌 in all required sizes

#### Social & OG Images
- Open Graph images for homepage and key pages (1200x630)
- Twitter Card images (1024x512)
- All include GateFlow branding, token-aware colors, translated text per locale

#### Logo Variations
- Full logo (icon + wordmark) for header/footer
- Icon-only version for favicons and small spaces
- Monochrome versions for dark/light backgrounds
- RTL-aware wordmark spacing if needed

### Asset Implementation Requirements
- All icons placed in public/icons/ directory with consistent naming
- Update layout.tsx with all icon link tags
- Add theme-color meta tag using token variable
- Add manifest.json link tag
- Ensure html tag includes dir and lang attributes based on locale

---

## 8. IMPLEMENTATION GUIDELINES (Antigravity IDE + Gemini 3 Flash)

### Token-First Approach
- Define all design tokens in globals.css before building any components
- Reference tokens exclusively via CSS variables — no hardcoded values anywhere
- Extend Tailwind config to map tokens to utility classes where beneficial
- Enable Tailwind RTL plugin for logical property support
- Test token variants for both light/dark modes early

### Component Architecture
- Layout components: Navigation, Footer, LanguageSwitcher, ThemeToggle (all RTL-aware)
- Marketing components: HeroSection, FeatureCard, PricingCard, TestimonialCarousel, ContactForm
- Reuse shadcn/ui components via @gate-access/ui shared package where applicable
- Server components for static content, client components only for interactivity

### shadcn/ui Component Strategy
- Install only required components: button, card, badge, table, accordion, form, alert, dialog, sheet, carousel, skeleton, dropdown-menu, switch, input, textarea, label, separator, avatar, tabs, scroll-area, tooltip
- Use default shadcn/ui styling patterns with token overrides only where brand differentiation needed

### i18n Implementation Strategy
- Next.js 14 i18n routing with locale prefix URLs
- Middleware for locale detection, validation, and redirection
- Cookie persistence for user language preference
- Lazy-load locale JSON files for performance
- Fallback to English for missing Arabic translations

### Performance Strategy
- Target Lighthouse scores >95 across all categories
- First Contentful Paint <1.5s, Time to Interactive <3s
- Bundle size increase <15% vs current marketing app
- Next.js Image component for all raster images with proper sizing
- Font optimization via next/font with subset loading for Arabic
- Lazy-load non-critical locale files and components

### Accessibility Strategy
- All interactive elements have visible focus states using ring token
- ARIA labels on all icons and non-text elements (translated per locale)
- Semantic HTML structure throughout
- Color contrast meets WCAG AA minimums using token pairs
- Full keyboard navigation support
- Screen reader testing on key user flows
- RTL: Ensure lang and dir attributes correctly announce to assistive technologies

### SEO Strategy
- Open Graph + Twitter metadata on all pages (per locale)
- JSON-LD structured data for Organization, Product, FAQ
- Canonical URLs including locale path
- hreflang tags for all i18n page pairs
- Sitemap.xml with both locales submitted to search consoles
- Robots.txt configured appropriately

---

## 9. ACCEPTANCE CRITERIA

✅ All visual properties reference design tokens — zero hardcoded values  
✅ Light mode colors match shadcn/ui default light theme exactly  
✅ Dark mode colors match shadcn/ui default dark theme exactly  
✅ Theme toggle works seamlessly and persists preference  
✅ Navigation works on desktop (1440px) and mobile (320px) with no horizontal scroll  
✅ All nav menu pages created, linked, and translated correctly  
✅ Sitemap.xml generated with all routes and hreflang alternates  
✅ Robots.txt generated and configured  
✅ Footer includes all required links and legal pages in both locales  
✅ All app icons generated via Nano Banana 🍌 in required sizes and formats  
✅ PWA manifest.json configured with direction and language support  
✅ Lighthouse accessibility score >95 for both locales and both themes  
✅ All forms show loading/success/error states with translated messages  
✅ RTL support for Arabic (ar-EG) with correct text direction and layout flipping  
✅ LTR support for English (en) with correct alignment  
✅ Language switcher persists selection and updates page direction  
✅ All spacing uses logical properties (no hardcoded left/right values)  
✅ Arabic fonts loaded, applied, and rendered correctly  
✅ No console errors or hydration mismatches  
✅ Matches shadcn/ui design language (consistent radius, shadows, spacing)  
✅ Aligns with PRD_v5.0.md messaging (value prop, EGP pricing tiers, personas)  
✅ References MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md for security page content  
✅ Uses @gate-access/i18n package patterns from PROJECT_STRUCTURE.md  
✅ All assets generated via Nano Banana 🍌 follow token-aware design guidelines  

---

## 10. EXECUTION ORDER (Autonomous Refactor)

### Phase 1: Token System & i18n Foundation
- Define all CSS variables in globals.css (light + dark modes)
- Configure Tailwind with token mappings and RTL plugin
- Integrate @gate-access/i18n package patterns
- Create locale JSON file structure (en + ar-EG)
- Configure middleware for locale routing and persistence
- Verify token variants work for both themes and directions

### Phase 2: Layout Components
- Create Navigation component with desktop/mobile/RTL awareness
- Create Footer component with all columns and RTL awareness
- Create LanguageSwitcher and ThemeToggle components
- Update root layout to include all components with i18n provider
- Test navigation and footer in both locales and themes

### Phase 3: Core Pages
- Redesign homepage with all sections and token-aware styling
- Redesign pricing page with tier cards and comparison table
- Redesign contact page with form and info cards
- Validate all core pages in both locales and themes

### Phase 4: New Pages
- Create product page with feature grid and security section
- Create solutions index page with industry cards
- Create 4 solution detail pages (compounds, schools, events, clubs)
- Create resources placeholder page
- Create login redirect page
- Create legal pages (privacy, terms, security, cookies)

### Phase 5: SEO & Metadata
- Generate sitemap with all routes and hreflang alternates
- Generate robots.txt with appropriate rules
- Add JSON-LD structured data per page type
- Add Open Graph + Twitter metadata per locale
- Validate structured data with testing tools

### Phase 6: Assets via Nano Banana 🍌
- Generate all app icons in required sizes and formats
- Generate hero backgrounds and section visuals (token-aware)
- Generate feature illustrations and industry-specific visuals
- Generate social/OG images for key pages
- Generate logo variations for different contexts
- Implement all assets with proper file structure and HTML references
- Create PWA manifest with direction and language support

### Phase 7: QA & Validation
- Run Lighthouse audit for all combinations: en/ar × light/dark
- Test mobile responsiveness across 320px–1440px breakpoints
- Verify all navigation links work in both locales
- Test form submissions and validation messages
- Check theme toggle persistence and visual consistency
- Test language switching and direction flipping
- Verify Arabic font rendering and text alignment
- Confirm logical properties prevent hardcoded direction issues
- Validate Nano Banana 🍌 assets display correctly in all contexts
- Final cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 11. REFERENCES (Consult Throughout)

| Document | Use For |
|----------|---------|
| PRD_v5.0.md | Messaging, EGP pricing tiers (499-30k+), target personas, 5-app strategy, MENA market focus |
| PROJECT_STRUCTURE.md | Monorepo paths, tech stack, shared packages (@gate-access/ui, @gate-access/i18n) |
| MVP_DONE_CHECKLIST.md | Current marketing site status (~30% complete), completed features, Phase 2 items |
| MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md | Security page content, performance guidelines, known issues to address |
| RESIDENT_PORTAL_SPEC.md | Future feature context (plan navigation for Phase 2, do not build yet) |
| https://ui.shadcn.com/ | Component documentation and theming guide (light/dark color values) |
| Nano Banana 🍌 | Asset generation for icons, illustrations, hero visuals, social images |

---

Start with Phase 1 (Token System + i18n Foundation). After completing each phase, validate against acceptance criteria before proceeding. Use TypeScript interfaces for all component props. Prioritize mobile-first responsive design. Generate all code autonomously — no placeholders or TODOs. Ensure all text content is wrapped in translation keys — no hardcoded strings in components. Use Nano Banana 🍌 for all visual asset generation following token-aware guidelines.