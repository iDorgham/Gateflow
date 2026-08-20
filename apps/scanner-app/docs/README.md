# GateFlow Scanner App

<div align="center">

**Foundational security bridge for the GateFlow ecosystem**

_Specialized React Native (Expo) application for cryptographically validating physical credentials_

</div>

---

## Primary Objective

To provide a lightning-fast, highly resilient scanning interface capable of validating visitor, resident, and vendor QR codes in varying connectivity environments.

---

## Key Features

| Feature                          | Description                                                         |
| :------------------------------- | :------------------------------------------------------------------ |
| **High-Speed Camera Parsing**    | Rapid frame extraction and QR logic via Expo Camera                 |
| **Cryptographic Validation**     | HMAC-signed QR verification plus server policy validation           |
| **Offline Queue**                | Encrypt pending scans locally; never grant before server validation |
| **Background Sync Engine**       | Resolves queued scans when network restores                         |
| **Supervisor Override Protocol** | PIN bypass for software validation failures                         |

---

## Tech Stack

| Layer            | Technology                                    |
| :--------------- | :-------------------------------------------- |
| **Framework**    | React Native + Expo (Managed Workflow)        |
| **Camera**       | `expo-camera`                                 |
| **Offline Sync** | AES-encrypted AsyncStorage queue              |
| **Styling**      | ADS native tokens + React Native `StyleSheet` |
| **Auth**         | `expo-secure-store` for mobile tokens         |

---

## Folder Structure

```
scanner-app/
├── app/                  # Expo Router views
│   ├── (auth)/           # Operator login & hardware pairing
│   ├── scanner/          # Main camera viewfinder module
│   ├── queue/            # Offline sync status tables
│   └── _layout.tsx       # Root bounds
├── logic/                # Core cryptography validation
├── db/                   # Offline SQLite mappings
├── eas.json              # EAS Build profiles
├── app.json              # Expo manifest
└── package.json
```

---

## Getting Started

### Local Development

> Simulators are not recommended. Use a physical device.

```bash
pnpm turbo dev --filter scanner-app
```

### Permissions

The app mandates strict `NSCameraUsageDescription` parameters inside `app.json`.

---

## Security Note

Local HMAC verification proves payload integrity only; it is not an access
decision. If server validation is unavailable, a scan may be encrypted and
queued as **Validation Pending**. Operators must not grant entry until sync
returns an authoritative accepted result with a persisted `scanId`. A failed
queue write or missing gate identity is rejected fail-closed.

---

## Related Documentation

| Document                                                      | Description         |
| :------------------------------------------------------------ | :------------------ |
| [Security Overview](../../docs/SECURITY_OVERVIEW.md)          | QR security details |
| [Design Tokens](../../docs/DESIGN_TOKENS.md)                  | UI tokens           |
| [Scanner Operations](../../docs/guides/SCANNER_OPERATIONS.md) | Offline flow        |
