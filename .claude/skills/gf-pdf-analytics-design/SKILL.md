# SKILL: Professional PDF Analytics Design

## Purpose
Enforce branded, high-fidelity PDF report design standards for GateFlow v9.0, ensuring that exported analytics reflect the premium ADS aesthetic.

## Core Principles
1.  **ADS Branding Consistency**: Map screen tokens (colors, typography) to print-ready equivalents.
2.  **Layout for Legibility**: Optimize for A4/Letter formats with generous margins and clear headers.
3.  **Data Integrity**: Ensure charts and tables remain high-resolution and mathematically accurate in vector format.

## Implementation Rules
- **Typography mapping**:
  - Headings: `Inter` or `Cairo` (Arabic) Bold.
  - Body: `Inter` or `Cairo` (Arabic) Medium.
- **Color usage**: Use high-contrast versions of ADS tokens to ensure readability on various printers.
- **Page structure**: Every report must have:
  - Header: Branded logo + Report Date + Mission ID.
  - Footer: Page numbers + System Integrity Hash.
  - Section Breaks: Clear H1/H2 hierarchy.

## Anti-Patterns
- Using low-resolution raster images for logos or charts (use SVG).
- Overflowing tables that cut off data on the right margin.
- Forgetting to embed Arabic fonts (leads to broken characters).

## Code Examples

### PDF Header Layout (React-PDF/Puppeteer)
```tsx
const PDFHeader = ({ title, missionId }) => (
  <View style={styles.header}>
    <Image src="/assets/branding/logo-print.png" style={styles.logo} />
    <View style={styles.meta}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.subtitle}>ID: {missionId}</Text>
    </View>
  </View>
);
```

### CSS Print Media (Tailwind/Standard)
```css
@media print {
  body {
    background: white;
    color: black;
  }
  .no-print {
    display: none;
  }
  .page-break {
    page-break-before: always;
  }
}
```
