# Browser-Use Subagent — Prompt Library

Copy-paste prompts for UI verification. Use with **browser-use** subagent or cursor-ide-browser MCP.

---

## Auth & login

**Login flow**
```
Login to client-dashboard at localhost:3001 with valid credentials. Verify redirect to dashboard and nav renders.
```

**Auth redirect**
```
Visit /dashboard without auth. Verify redirect to /login. Then login and verify redirect back to dashboard.
```

**Role-specific access**
```
Login as [TENANT_ADMIN | TENANT_USER]. Navigate to [pages]. Verify access and that restricted areas are hidden or shown correctly.
```

---

## Projects & gates

**Project flow**
```
Login at localhost:3001, go to Projects, create a new project named "Test Project", switch to it. Verify project cookie and that sidebar reflects active project.
```

**Gate flow**
```
Login, select a project, go to Gates, create a gate. Verify it appears in the list and gate count updates.
```

---

## QR & scans

**QR creation**
```
Login, go to QR Codes, create a single QR. Verify QR displays, can be downloaded, and appears in the list.
```

**Scans list**
```
Login, go to Scans. Apply date filter. Verify scans list updates. Check pagination if > 10.
```

**Export CSV**
```
Login, go to Scans, apply filters if needed, click Export CSV. Verify file downloads and contains expected columns.
```

---

## i18n & RTL

**Locale toggle**
```
On client-dashboard login page, toggle locale AR/EN. Verify RTL layout for Arabic, LTR for English. Check labels switch correctly.
```

**Dashboard i18n**
```
Login, toggle locale to Arabic. Navigate through Projects, Gates, Scans. Verify all labels and nav items are translated.
```

---

## Regression

**Smoke pass**
```
Login as TENANT_ADMIN. Navigate: Dashboard → Projects → Gates → QR Codes → Scans → Analytics → Settings. Verify each page loads. Capture screenshot of any broken state.
```

**Critical path**
```
[Custom flow]: Login → [step 1] → [step 2] → [step 3]. Verify [expected outcome]. Report any error or broken UI.
```
