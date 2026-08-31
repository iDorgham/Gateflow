# 14. PLATFORM RISK REGISTER — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Operational, Technical, Security, Compliance, and Market Risks Matrix

---

## Risk Register Matrix

| Risk ID     | Risk Description                                                                                                               | Likelihood |  Impact  |  Severity  | Planned Mitigation Strategy                                                                    | Owner Area      |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------: | :------: | :--------: | :--------------------------------------------------------------------------------------------- | :-------------- |
| **RSK-001** | **Scan Validation Rate-Limit Exhaustion**: Unthrottled validation requests lead to database connection starvation.             |   Medium   |   High   |  **High**  | Wrap `/api/qrcodes/validate` with sliding-window Redis rate limiter (P0-001).                  | Security / API  |
| **RSK-002** | **Relational Join Omission in Reporting**: Developers query `ScanLog` without joining `Gate`, risking cross-tenant data leaks. |    Low     | Critical |  **High**  | Add direct `organizationId` column to `ScanLog` model (P0-002).                                | Database / Arch |
| **RSK-003** | **Offline Mobile Clock Drift**: Guard hardware device clock skew causes valid offline passes to be rejected as expired.        |   Medium   |  Medium  | **Medium** | Calculate server clock delta during scanner login and adjust local timestamps (P1-002).        | Mobile App      |
| **RSK-004** | **Outbound Webhook Event Loss**: Unhandled HTTP failures drop integration events for third-party systems.                      |   Medium   |  Medium  | **Medium** | Implement persistent BullMQ / Redis retry queue with dead-letter logging (P1-001).             | Integrations    |
| **RSK-005** | **Scan Attachment PII Accumulation**: Extended storage of ID capture photos increases regulatory compliance exposure.          |    Low     |  Medium  |  **Low**   | Implement automated S3 / GCS lifecycle rules to purge attachments older than 90 days (P2-003). | Compliance      |
