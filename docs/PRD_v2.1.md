# QR Gate Access Control System – PRD v2.1

## 7.2 Directory Structure

```
/
├── apps/
│   ├── marketing/                    # Next.js App Router – public marketing site
│   ├── client-dashboard/             # Next.js App Router – authenticated tenant dashboard
│   ├── admin-dashboard/              # Next.js App Router – super admin panel
│   └── scanner-app/                 # Expo / React Native mobile scanner app
│
├── packages/
│   ├── ui/                          # Shared React components (shadcn/ui style)
│   ├── api-client/                  # Generated API types + fetch client
│   ├── config/                      # Shared ESLint, TSConfig, Tailwind presets
│   ├── types/                       # Shared TypeScript interfaces & enums
│   └── i18n/                        # i18next translation files & setup
│
├── infra/                           # Dockerfiles, docker-compose, Terraform, etc.
├── .github/workflows/               # GitHub Actions CI/CD
├── docs/                            # Documentation
│
├── turbo.json                       # Turborepo configuration
├── tsconfig.json                    # Root TypeScript config (strict mode)
├── .eslintrc.json                   # Root ESLint config
├── .prettierrc                      # Prettier config
└── package.json                     # Root package.json with workspace config
```

## 1. Overview

**Project Name:** Gate Access
**Type:** SaaS Web Application (QR Code Access Control System)
**Core Functionality:** A multi-tenant QR code-based gate access control system allowing property managers to generate and manage QR codes for visitor access.

## 2. User Personas

- **Super Admin:** Platform owner who manages all tenants, billing, and system settings
- **Tenant Admin:** Property manager who manages their properties, gates, and generates QR codes
- **Visitor:** End user who scans QR codes to gain access

## 3. Core Features

### 3.1 Authentication & Authorization
- Multi-tenant authentication (tenant-specific login)
- Role-based access control (Admin, Tenant, Visitor)
- JWT-based session management

### 3.2 QR Code Management
- Generate single-use, recurring, and permanent QR codes
- Set expiration dates and max usage limits
- Bulk QR code generation
- QR code templates

### 3.3 Gate Management
- Register and configure gates
- Gate status monitoring
- Access logging and audit trails

### 3.4 Scanner App
- Mobile QR code scanning
- Offline capability with sync
- Real-time access validation

## 4. Technical Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Mobile:** Expo / React Native
- **Package Manager:** pnpm
- **Build System:** Turborepo
- **UI Components:** shadcn/ui style shared package

## 5. API Design

RESTful API with the following main endpoints:
- `/api/auth/*` - Authentication
- `/api/tenants/*` - Tenant management
- `/api/gates/*` - Gate management
- `/api/qrcodes/*` - QR code management
- `/api/scans/*` - Scan validation and logging

## 6. Data Models

### User
- id, email, name, role, tenantId, createdAt, updatedAt

### Tenant
- id, name, email, plan, createdAt

### Gate
- id, name, location, tenantId, isActive, lastAccessedAt

### QRCode
- id, code, tenantId, type, maxUses, currentUses, expiresAt, createdAt, isActive

### QRScan
- id, qrId, scannedAt, gateId, status

## 7. Non-Functional Requirements

- **Performance:** Sub-200ms API response times
- **Scalability:** Support 100+ tenants with 1000+ gates each
- **Security:** HTTPS only, input validation, rate limiting
- **Accessibility:** WCAG 2.1 AA compliance

## 8. Future Considerations

- Real-time WebSocket updates for gate status
- Integration with physical access control hardware
- Advanced analytics dashboard
- Mobile push notifications

---

**TODO:** Add detailed feature specifications, wireframes, and API contracts.
