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

| Feature                          | Description                                         |
| :------------------------------- | :-------------------------------------------------- |
| **High-Speed Camera Parsing**    | Rapid frame extraction and QR logic via Expo Camera |
| **Cryptographic Validation**     | JWT token decoding locally to verify expiry         |
| **Offline First Pipeline**       | Sync authorized passes locally in SQLite            |
| **Background Sync Engine**       | Resolves queued scans when network restores         |
| **Supervisor Override Protocol** | PIN bypass for software validation failures         |

---

## Tech Stack

| Layer            | Technology                              |
| :--------------- | :-------------------------------------- |
| **Framework**    | React Native + Expo (Managed Workflow)  |
| **Camera**       | `expo-camera` / `expo-barcode-scanner`  |
| **Offline Sync** | Prisma/SQLite managing `SyncQueue`      |
| **Styling**      | Nativewind / React Native `StyleSheet`  |
| **Auth**         | `expo-secure-store` for gate-level JWTs |

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

This app utilizes "Kiosk Mode" logic to lock single-purpose Android devices into the Viewfinder perspective.

---

## Related Documentation

| Document                                                      | Description         |
| :------------------------------------------------------------ | :------------------ |
| [Security Overview](../../docs/SECURITY_OVERVIEW.md)          | QR security details |
| [Design Tokens](../../docs/DESIGN_TOKENS.md)                  | UI tokens           |
| [Scanner Operations](../../docs/guides/SCANNER_OPERATIONS.md) | Offline flow        |
