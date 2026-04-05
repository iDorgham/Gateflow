# Phase Prompt: 01_foundation_tokens

## 🚨 MISSION

Audit `admin-dashboard` foundation and theme tokens to ensure 100% parity with Client Dashboard (V10) and correct light/dark mode behavior.

---

## 🛠️ CONTEXT

- Application: `apps/admin-dashboard`
- Reference: `apps/client-dashboard`
- UI Package: `@gate-access/ui`
- Styles: `src/app/globals.css`, `tailwind.config.ts`

---

## 📋 STEPS

1.  **Token Audit**: Compare `apps/admin-dashboard/tailwind.config.ts` and `apps/client-dashboard/tailwind.config.ts`. Ensure all Atlassian (`--ds-...`) and custom theme tokens matched.
2.  **Global CSS Check**: Review `apps/admin-dashboard/src/app/globals.css`. Remove any hardcoded overrides that clash with the V10 reference style.
3.  **Local Contrast Verification**: Run a quick audit across `(dashboard)/page.tsx` and `AdminShell` to identify hardcoded `bg-white` or `text-slate-XXX` classes that aren't using CSS tokens like `var(--ds-background-default)`.
4.  **Translation Audit**: Ensure `en.json` and `ar.json` in `packages/i18n` have the `admin` namespace populated for base navigation and titles.

---

## ✅ ACCEPTANCE CRITERIA

- [ ] `tailwind.config.ts` matches V10 reference.
- [ ] No hardcoded color classes (`bg-white`, `text-black`, etc.) in `AdminShell`.
- [ ] Dark mode baseline is consistent with Client Dashboard.
