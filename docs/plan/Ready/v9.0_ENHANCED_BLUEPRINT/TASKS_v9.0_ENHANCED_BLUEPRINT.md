# GateFlow v9.0 Task Breakdown & Execution Checklist

---

## 🚀 Phase 0: Foundation Hardening & Deployment Connectivity (Weeks 1–2)

- [ ] Task 0.1: Run cross-app deployment connectivity audit and verify all 18 secrets.
- [ ] Task 0.2: Implement `check:integrations` CLI script to validate required environment variables before builds.
- [ ] Task 0.3: Add `IntegrationCredential` model to `packages/db/prisma/schema.prisma` with AES-256-GCM encryption.
- [ ] Task 0.4: Build Central Event Bus interface (`packages/api-client` / Upstash Redis Streams wrapper).
- [ ] Task 0.5: Verify cross-subdomain NextAuth cookie sharing (`Domain=.gateflow.site`).

---

## 📱 Phase 1: Wallet Pass Issuance & ANPR Vehicle Access (Weeks 3–8)

- [ ] Task 1.1: Add `VehiclePlate` model to `packages/db` and create `POST /api/anpr/stream-event` endpoint.
- [ ] Task 1.2: Build ANPR camera webhook receiver & automatic barrier trip trigger.
- [ ] Task 1.3: Integrate `passkit-generator` for Apple Wallet `.pkpass` generation.
- [ ] Task 1.4: Integrate Google Pay pass generator for Android Wallet passes.
- [ ] Task 1.5: Build Resident Portal Wallet Export UI & Push notification pass updater.

---

## 🤖 Phase 2: GateAI 2.0 & WebRTC Intercom (Weeks 9–16)

- [ ] Task 2.1: Upgrade `@gateflow/ai` with natural language ticket triage & automated `WorkOrder` dispatch.
- [ ] Task 2.2: Implement WebRTC guard-to-resident video/audio calling bridge (Twilio / STUN/TURN).
- [ ] Task 2.3: Build Client Dashboard org-scoped Live Barrier Map with real-time MQTT feeds.
- [ ] Task 2.4: Build Resident Portal WebRTC Intercom incoming call overlay with single-tap entry grant.

---

## 📡 Phase 3: Hardware Telemetry, BLE Proximity & On-Device LPR (Weeks 17–24)

- [ ] Task 3.1: Build Admin Dashboard global MQTT barrier fleet map & heart-beat alert triggers.
- [ ] Task 3.2: Implement BLE proximity beacon challenge/response protocol in `scanner-app` and `resident-mobile`.
- [ ] Task 3.3: Implement TensorFlow Lite / CoreML on-device license plate OCR running at 60 FPS offline.
- [ ] Task 3.4: Implement guard shift biometric unlock & session lock timer.

---

## 📊 Phase 4: Marketing Growth Calculator & Self-Service Sandbox (Weeks 25–28)

- [ ] Task 4.1: Build Marketing Interactive MENA Real Estate Security ROI & Headcount Savings Calculator.
- [ ] Task 4.2: Build Admin Dashboard Sandbox Tenant Provisioner (14-day auto-expiry demo org).
- [ ] Task 4.3: Build Marketing Attribution Pixel Test Harness for GTM/GA4/Meta tag auditing.

---

## 🎨 Phase 5: Design System Upgrade & Observability (Weeks 29–32)

- [ ] Task 5.1: Upgrade `@gateflow/ui` & `apps/design-system` to Tailwind CSS v4.
- [ ] Task 5.2: Build WCAG 2.2 AA Contrast & Theme Audit Playground in Design System portal.
- [ ] Task 5.3: Build Micro-Interaction Motion Physics Inspector with `prefers-reduced-motion` toggles.
- [ ] Task 5.4: Build Admin Dashboard Global Integration Health & AI Cost Analytics.

---

## 🔐 Phase 6: Compliance & Hardening (Weeks 33–36)

- [ ] Task 6.1: Implement Egyptian Law 151 and Saudi PDPL compliance PDF/CSV export engine.
- [ ] Task 6.2: Build Nightly PII Purge & Anonymization Scheduler.
- [ ] Task 6.3: Implement Upstash Redis API rate-limiting per tenant/IP allow-list enforcer.
- [ ] Task 6.4: Perform end-to-end security penetration testing & certification.
