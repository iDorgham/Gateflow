# SKILL: QR Branding & Scanning Optimization

## Purpose
Standardize the visual branding of QR codes (colors, logos) while ensuring maximum scan reliability across various lighting conditions and hardware in GateFlow v9.0.

## Core Principles
1.  **Contrast is King**: Maintain at least a 3:1 contrast ratio between the QR modules (dots) and the background.
2.  **Error Correction Level**: Always use Level `H` (High, 30%) or `Q` (Quartile, 25%) when embedding logos to ensure the code remains scannable.
3.  **Logo Safe-Zone**: Logos must not exceed 15-20% of the total QR area and should be centered to avoid critical alignment patterns.

## Implementation Rules
- **Branding**:
  - Module Color: Use `color.background.accent-bold` or `black`.
  - Quiet Zone: Minimum 4 modules width (white space around the QR).
- **Hardness**: Round modules (dots) are acceptable but ensure square "finder patterns" (the big squares in corners) remain sharp for faster targeting.

## Anti-Patterns
- Using brand colors that are too light (e.g., yellow modules on white background).
- Placing logos over the three large corner "finders".
- Using transparent backgrounds for QRs (renders them unscannable on many surfaces).

## Code Examples

### Branded QR Generation (React/SVG)
```tsx
import { QRCodeSVG } from 'qrcode.react';

export const BrandedQR = ({ value }) => (
  <div className="p-200 bg-white rounded-medium shadow-raised inline-block">
    <QRCodeSVG
      value={value}
      size={256}
      level="H"
      includeMargin={true}
      imageSettings={{
        src: "/assets/branding/logo-mini.png",
        height: 48,
        width: 48,
        excavate: true,
      }}
      fgColor="var(--ds-background-accent-bold)"
    />
  </div>
);
```

### Scan Buffer Optimization
```typescript
// Optimization for hardware scanners: ensure no glare on modules
const qrContainerStyle = {
  filter: 'contrast(1.2) brightness(1.0)',
  padding: '16px'
};
```
