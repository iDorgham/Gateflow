# Browser-use Subagent

**Purpose:** UI verification, login flows, navigation testing, and i18n checks.

## When to Use

- Verify UI after changes
- Login flow testing
- Navigation verification
- i18n/RTL correctness checks
- Export functionality testing

## Prompt Templates

### Login verification
```
Login to client-dashboard at localhost:3001, navigate to Projects, create a project, switch to it, then verify the project cookie and nav state.
```

### i18n check
```
Toggle locale (AR/EN) on client-dashboard login page and verify RTL layout and labels.
```

### UI verification
```
Login as [role], navigate to [pages], verify [behaviors], and capture screenshots for any broken states.
```

### Multi-step flow
```
Navigate to the gates page, create a new gate, assign QR codes, and verify the gate appears in the list.
```

## Examples

- "Login as TENANT_ADMIN, navigate to QRCodes, create a single-use QR code"
- "Toggle between Arabic and English, verify all text is properly translated"
- "Navigate through the onboarding wizard and verify all steps complete"
- "Export scan logs to CSV and verify the download works"
