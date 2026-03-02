# Browser-Use Subagent — GateFlow Prompts

Copy one of these prompts when invoking the **browser-use** subagent.

---

## Project flow

```
Login to client-dashboard at localhost:3001, navigate to Projects, create a project, switch to it, then verify the project cookie and nav state.
```

---

## i18n / RTL check

```
Toggle locale (AR/EN) on client-dashboard login page and verify RTL layout and labels.
```

---

## Regression pass

```
Login as [role], navigate to [pages], verify [behaviors], and capture screenshots for any broken states.
```

---

## Export verification

```
Login at localhost:3001, go to Scans, apply filters, click Export CSV, verify file downloads.
```

---

## Auth redirect

```
Visit protected route without auth, verify redirect to login. Login, verify redirect back.
```
