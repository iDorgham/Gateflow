# GateFlow Design System — Machine-Readable AI Context Pack (llms.txt)

**Document:** `AI_CONTEXT_PACK.md`  
**Endpoint Mirror:** `apps/design-system/public/llms.txt` and `apps/design-system/public/ai-context.json`  
**Target:** AI Assistants (Antigravity, Cursor, Claude Code, Gemini CLI, OpenCode)  

---

## 1. System Prompt Injection Block

When prompting an AI assistant for GateFlow tasks, prepend or load this context block:

```text
=== GATEFLOW DESIGN SYSTEM CONTEXT (v7.0) ===
You are building UI for GateFlow (@gateflow/ui).
Core DNA: Satin-Charcoal Dark mode (oklch) + Porcelain Light mode + Kimchi Vermilion (#ED4B00) accent.

SEMANTIC SURFACE TOKENS:
- Canvas/Gutter: bg-[var(--ds-layer-01)] (#0b0d11 Dark / #f8f9fa Light)
- Default Card/Table: bg-[var(--ds-layer-02)] (#12151c Dark / #ffffff Light)
- Raised Surface/Header: bg-[var(--ds-layer-03)] (#191d26 Dark / #ffffff Light)
- Overlay/Modal/Drawer: bg-[var(--ds-layer-04)] (#212633 Dark / #ffffff Light)

SEMANTIC TEXT TOKENS:
- Primary Text: text-[var(--ds-text-primary)] (#f8fafc Dark / #0f172a Light)
- Subtle Text: text-[var(--ds-text-subtle)] (#94a3b8 Dark / #475569 Light)
- Brand Accent: text-[var(--ds-color-primary)] (#ED4B00 Kimchi)
- Success Text: text-[var(--ds-color-success)] (#10B981 Emerald)
- Danger Text: text-[var(--ds-color-danger)] (#EF4444 Ruby)

SEMANTIC BORDERS:
- Subtle Border: border-[var(--ds-border-subtle)] (#232834 Dark / #e2e6eb Light)
- Bold Border: border-[var(--ds-border-bold)] (#363d4e Dark / #cbd2db Light)
- Focus Ring: ring-2 ring-[var(--ds-color-primary)] ring-offset-2

CANONICAL COMPONENTS:
- Button: import { Button } from '@gateflow/ui/button' (variants: 'primary', 'secondary', 'ghost', 'destructive', 'fab')
- FormField: import { FormField } from '@gateflow/ui/form-field' (props: label, helperText, errorMessage, isRequired, isInvalid)
- Input: import { Input } from '@gateflow/ui/input' (density-aware)
- Card: import { Card } from '@gateflow/ui/card' (variants: 'default', 'interactive', 'selectable', 'metric')
- Badge: import { Badge } from '@gateflow/ui/badge' (variants: 'solid', 'soft', 'outline', 'ghost', 'dot')
- DynamicTable: import { DynamicTable } from '@gateflow/ui/table' (auto-converts to cards on viewports < 768px)
- BottomSheet: import { BottomSheet } from '@gateflow/ui/mobile' (snap points: 25%, 50%, 90%)

ANTI-SLOP INVARIANTS (STRICT):
- NEVER use colored border-left/border-right on cards.
- NEVER use gradient text in dashboard/console UI.
- NEVER use glassmorphism as default card background.
- ALWAYS use logical properties for RTL (ms-*, me-*, ps-*, pe-*, start-*, end-*).
- ALWAYS ensure touch targets >= 44px on mobile.
=== END CONTEXT ===
```

---

## 2. API Component Index & Prop Schema

```json
{
  "name": "@gateflow/ui",
  "version": "7.0.0",
  "components": {
    "Button": {
      "props": {
        "variant": ["primary", "secondary", "outline", "ghost", "destructive", "fab"],
        "size": ["sm", "md", "lg"],
        "isLoading": "boolean",
        "isDisabled": "boolean"
      }
    },
    "FormField": {
      "props": {
        "label": "string",
        "helperText": "string",
        "errorMessage": "string",
        "isRequired": "boolean",
        "isInvalid": "boolean"
      }
    },
    "Badge": {
      "props": {
        "variant": ["solid", "soft", "outline", "ghost", "dot"],
        "tone": ["primary", "neutral", "success", "warning", "danger", "ai-lab"],
        "size": ["sm", "md", "lg"],
        "isRemovable": "boolean"
      }
    },
    "DynamicTable": {
      "props": {
        "data": "Array<T>",
        "columns": "Array<ColumnDef<T>>",
        "density": ["compact", "comfortable"],
        "mobileTransform": "boolean"
      }
    },
    "BottomSheet": {
      "props": {
        "isOpen": "boolean",
        "onClose": "() => void",
        "snapPoints": ["number[]"],
        "children": "ReactNode"
      }
    }
  }
}
```
