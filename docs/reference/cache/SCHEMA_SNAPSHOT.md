# Schema Snapshot Cache

**Generated:** 2026-03-24
**Source:** `packages/db/prisma/schema.prisma`
**Update when:** model added/removed, field added to key model, enum value added.

---

## Models (40 total)

### Core Access Control

| Model              | Key Fields                                                                                                                                                                        | Soft Delete |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Organization**   | id(cuid), name, email(unique), plan(FREE\|PRO\|ENTERPRISE), domain, logoUrl                                                                                                       | ✓ deletedAt |
| **Project**        | id, name, organizationId, galleryJson, externalUrl, gateMode(SINGLE\|MULTI)                                                                                                       | ✓ deletedAt |
| **Gate**           | id, name, location?, organizationId, projectId, isActive, latitude, longitude, locationRadiusMeters, requiredIdentityLevel                                                        | ✓ deletedAt |
| **QRCode**         | id, code(unique), type(QRCodeType), organizationId, gateId, projectId, contactId, maxUses, currentUses, expiresAt, isActive, utmCampaign/Source/Content/Medium/Term, delegateToAi | ✓ deletedAt |
| **ScanLog**        | id, status(ScanStatus), scannedAt, gateId, qrCodeId, userId, scanUuid(unique), deviceId, auditTrail(Json[]), arrivalNotifiedAt, utmParams                                         | ✗           |
| **GateAssignment** | id, userId, gateId, organizationId, shiftStart/End(HH:mm), startTime, endTime, scheduleJson                                                                                       | ✓ deletedAt |

### Users & Auth

| Model            | Key Fields                                                              | Soft Delete |
| ---------------- | ----------------------------------------------------------------------- | ----------- |
| **User**         | id, email(unique), name, passwordHash, organizationId, roleId           | ✓ deletedAt |
| **Role**         | id, name, description, permissions(Json), isBuiltIn, organizationId     | ✗           |
| **RefreshToken** | id, token(unique), userId, expiresAt, revokedAt                         | ✗           |
| **Invitation**   | id, email, organizationId, roleId, token(unique), acceptedAt, expiresAt | ✗           |

### Residents & CRM

| Model             | Key Fields                                                                                                                                  | Soft Delete |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Unit**          | id, name, type(UnitType), organizationId, projectId, userId?(resident), qrQuota                                                             | ✓ deletedAt |
| **Contact**       | id, firstName, lastName, email, phone, organizationId, birthday, company, jobTitle, source(ContactSource), companyWebsite, notes, avatarUrl | ✓ deletedAt |
| **ContactUnit**   | contactId(pk), unitId(pk) — junction table                                                                                                  | ✗           |
| **VisitorQR**     | id, qrCodeId(unique), unitId, visitorName/Phone/Email, isOpenQR, accessRuleId(unique)                                                       | ✗           |
| **AccessRule**    | id, type(AccessRuleType), startDate, endDate, recurringDays, startTime, endTime                                                             | ✗           |
| **ResidentLimit** | id, organizationId, unitType(UnitType), monthlyQuota, canCreateOpenQR                                                                       | ✗           |

### AI

| Model            | Key Fields                                                                                                                                                       | Soft Delete |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **AiTask**       | id, organizationId, type, title, params(Json), cron, status(AiTaskStatus), lastRun, nextRun, error                                                               | ✗           |
| **AiActionLog**  | id, organizationId, userId, actionType, prompt, intentJson, status(AiActionStatus), result, promptTokens, completionTokens, totalTokens, estimatedCost, feedback | ✗           |
| **AiAutomation** | id, organizationId, userId, name, description, type(REPORT\|EXPORT), trigger, schedule, action(Json), status(AiAutomationStatus)                                 | ✓ deletedAt |
| **AiContentTag** | id, tagId, aiTaskId, aiActionLogId                                                                                                                               | ✗           |

### Other

| Model                     | Key Fields                                                                                                 | Soft Delete |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------- |
| **Tag**                   | id, name, color, organizationId                                                                            | ✓ deletedAt |
| **WatchlistEntry**        | id, organizationId, name, idNumber, phone, notes, createdBy                                                | ✓ deletedAt |
| **Incident**              | id, organizationId, gateId, userId, scanLogId, reason, status(IncidentStatus), notes                       | ✗           |
| **ScanAttachment**        | id, organizationId, scanLogId, incidentId, type, contentBase64                                             | ✗           |
| **Task**                  | id, title, description, status(TaskStatus), dueDate, organizationId, createdBy, assignedTo                 | ✓ deletedAt |
| **ChatMessage**           | id, content, organizationId, userId                                                                        | ✗           |
| **AuditLog**              | id, action, entityType, entityId, metadata(Json), organizationId, userId                                   | ✗           |
| **EventLog**              | id, organizationId, type(EventType), payload(Json), createdAt                                              | ✗           |
| **Webhook**               | id, url, events(Json), secret, isActive, organizationId                                                    | ✓ deletedAt |
| **WebhookDelivery**       | id, webhookId, event(WebhookEvent), payload(Json), status, statusCode, attemptCount, lastAttemptAt         | ✗           |
| **ApiKey**                | id, name, keyHash(unique), keyPrefix, scopes(ApiScope[]), lastUsedAt, expiresAt, organizationId, createdBy | ✗           |
| **AdminAuthorizationKey** | id, name, keyHash(unique), keyPrefix, type(AdminAuthKeyType), organizationId, lastUsedAt, expiresAt        | ✗           |
| **QrShortLink**           | id, shortId(unique,8-hex), fullPayload, organizationId, projectId, qrId, expiresAt                         | ✗           |
| **ShortLinkClick**        | id, shortLinkId, organizationId, projectId, utmParams, clickedAt, deviceInfo(Json)                         | ✗           |

---

## Enums

| Enum                      | Values                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Plan**                  | FREE, PRO, ENTERPRISE                                                                                                      |
| **QRCodeType**            | SINGLE, RECURRING, PERMANENT, VISITOR, OPEN                                                                                |
| **ScanStatus**            | SUCCESS, FAILED, EXPIRED, MAX_USES_REACHED, INACTIVE, DENIED                                                               |
| **UnitType**              | STUDIO, ONE_BR, TWO_BR, THREE_BR, FOUR_BR, VILLA, PENTHOUSE, COMMERCIAL                                                    |
| **GateMode**              | SINGLE, MULTI                                                                                                              |
| **AccessRuleType**        | ONETIME, DATERANGE, RECURRING, PERMANENT                                                                                   |
| **ContactSource**         | MANUAL, IMPORT, QR_SCAN, REFERRAL, OTHER                                                                                   |
| **IncidentStatus**        | UNDER_REVIEW, RESOLVED, ESCALATED                                                                                          |
| **TaskStatus**            | TODO, IN_PROGRESS, DONE                                                                                                    |
| **AiTaskStatus**          | PENDING, RUNNING, COMPLETED, FAILED                                                                                        |
| **AiActionStatus**        | PENDING, CONFIRMED, CANCELLED, EXECUTED, FAILED                                                                            |
| **AiAutomationType**      | REPORT, EXPORT                                                                                                             |
| **AiAutomationStatus**    | ACTIVE, PAUSED, COMPLETED                                                                                                  |
| **EventType**             | QR_CREATED, QR_UPDATED, QR_DELETED, SCAN_RECORDED, CONTACT_CREATED, CONTACT_UPDATED, VISITOR_QR_DELETED, TEAM_CHAT_MESSAGE |
| **WebhookEvent**          | QR_CREATED, QR_SCANNED, QR_REVOKED, QR_EXPIRED, SCAN_SUCCESS, SCAN_FAILED                                                  |
| **ApiScope**              | QR_CREATE, QR_READ, QR_VALIDATE, SCANS_READ, ANALYTICS_READ, WEBHOOK_WRITE                                                 |
| **AdminAuthKeyType**      | ADMIN, SERVICE                                                                                                             |
| **WebhookDeliveryStatus** | PENDING, RETRYING, SUCCESS, FAILED                                                                                         |

---

## Gotchas

- `QRCode` model → Prisma accessor is `prisma.qRCode` (camelCase)
- `ScanLog.auditTrail` is `Json[]` — spread and cast:
  `[...trail, entry] as unknown as Prisma.JsonArray`
- `Organization` tenant context: call `setOrganizationContext()` then
  `clearOrganizationContext()` in `finally`
- Import enums from `@gate-access/db`, not `@prisma/client` directly
- Use `prisma db push` (not `migrate dev`) in dev for schema changes
- Enum `ADD VALUE` migrations must run outside a transaction in PostgreSQL
