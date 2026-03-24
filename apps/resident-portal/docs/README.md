# GateFlow Resident Portal

<div align="center">

**Self-service web application for residents**

_Put visitor management directly into the hands of residents_

</div>

---

## Primary Objective

To drastically reduce front-desk administrative overhead by putting visitor management directly into the hands of the residents via a fast, responsive, and secure web interface.

---

## Key Features

| Feature               | Description                             |
| :-------------------- | :-------------------------------------- |
| **Visitor Passes**    | Create one-time or time-boxed QR passes |
| **Open House Passes** | Unlimited-use passes with date limits   |
| **Access Rules**      | Blocklists and permanent allowlists     |
| **Scan History**      | Personal history of pass usage          |
| **Quota Tracking**    | Monthly visitor invitation allowances   |

---

## Tech Stack

| Layer          | Technology                       |
| :------------- | :------------------------------- |
| **Framework**  | Next.js 14 (App Router)          |
| **Styling**    | Tailwind CSS + `@gate-access/ui` |
| **Components** | Radix UI / Shadcn UI             |
| **PWA Ready**  | Installable on home screens      |

---

## Folder Structure

```
resident-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/         # Resident login/verification
│   │   ├── dashboard/      # Main authenticated layout
│   │   │   ├── passes/     # Pass generation & tracking
│   │   │   ├── history/    # Personal scan logs
│   │   │   └── settings/   # Quota usage and profile
│   │   └── components/     # Resident-focused UI
│   ├── tailwind.config.ts
│   └── next.config.mjs
```

---

## Getting Started

```bash
pnpm turbo dev --filter resident-portal
```

---

## Design Philosophy

Unlike `client-dashboard` and `admin-dashboard` (desktop-first), the `resident-portal` is strictly **Mobile-First**. Most residents access this while on-the-go.

---

## Related Documentation

| Document                                                             | Description        |
| :------------------------------------------------------------------- | :----------------- |
| [Resident Portal Spec](../../docs/RESIDENT_PORTAL_SPEC.md)           | Full specification |
| [Project Structure](../../docs/PROJECT_STRUCTURE.md)                 | Monorepo layout    |
| [Mobile Design Skill](../../.opencode/skills/mobile-design/SKILL.md) | Mobile patterns    |
