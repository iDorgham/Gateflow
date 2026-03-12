# E2E Flow Template

Specify user flows for verification. Use with **browser-use** subagent or **cursor-ide-browser** MCP.

**Output:** Use as spec for manual/MCP verification, or convert to Playwright when E2E suite is added.

---

## Flow: [Name]

**App:** client-dashboard (localhost:3001) | admin-dashboard (3002) | marketing (3000)

**Prerequisites:** [e.g. User logged in, project exists]

### Steps

| Step | Action | Expected |
|------|--------|----------|
| 1 | [Navigate to /path] | Page loads, no error |
| 2 | [Click "Create" / fill form] | Modal or form visible |
| 3 | [Submit with valid data] | Success toast, list updates |
| 4 | [Verify item in list] | Item appears with correct data |
| 5 | [Optional: toggle locale] | i18n works, RTL if AR |

### Assertions

- [ ] No console errors
- [ ] No 4xx/5xx in network tab
- [ ] Data persists after refresh

### Roles to test

- [ ] TENANT_ADMIN
- [ ] TENANT_USER (if applicable)
- [ ] RESIDENT (if applicable)

---

## Example: Project creation

**App:** client-dashboard @ localhost:3001

**Prerequisites:** Logged in as TENANT_ADMIN

### Steps

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to /dashboard/projects | Projects list loads |
| 2 | Click "New Project" | Form/modal opens |
| 3 | Enter name "E2E Test Project", submit | Success toast |
| 4 | Verify "E2E Test Project" in list | Item visible |
| 5 | Switch to the new project | Project cookie set, nav updates |

### Assertions

- [ ] No 401/403/500
- [ ] Project appears in sidebar
- [ ] Refresh preserves selection
