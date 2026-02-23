# Phase 2 Roadmap

GateFlow Phase 2 introduces complex integrations beyond the MVP visitor management capabilities. The primary focus shifts towards monetization, external software linkages, and autonomous physical gate bridging.

## Milestone 1: Billing & Monetization
- **Stripe Integration**: Add automated subscription billing for organizations. Implement multi-tier SaaS limits.
- **Quota Management Hardening**: Automatically gate features or cut off access when billing cycles fail.
- **Client Billing Dashboard**: Allow corporate clients to download invoices directly via `client-dashboard`.

## Milestone 2: Smart Access Hardware
- **LPR (License Plate Recognition) Integration**: Sync GateFlow resident plate data into 3rd party IP camera clouds.
- **IoT Relay Triggers**: Provide webhook endpoints and MQTT signals to physically actuate gate hardware relays upon a valid QR code scanning event recorded by the `scanner-app`.

## Milestone 3: Advanced Portals and Communication
- **Contractor/Vendor Pass Management**: Bulk QR generation logic and recurring long-term access windows.
- **Resident Mobile Push Notifications**: Re-engineer Expo Push Token synchronization for background visitor arrivals directly alerting the `resident-mobile` application instances.

## Milestone 4: Global Administration
- **Auditing Analytics Engine**: Export detailed daily CSV manifests and data compliance reports out of `admin-dashboard`.
- **System Health Overrides**: Allow superadmins absolute remote control logic to bypass individual broken instances without redeploying the monorepo web portals.
