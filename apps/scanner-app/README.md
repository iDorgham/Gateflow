# GateFlow Scanner App

<div align="center">

![Banner](docs/gateflow_banner.png)

**Mobile QR Code Scanner for Gate Operations**

_Offline-capable security scanning with encrypted sync queue_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-4630EB?style=for-the-badge&logo=expo)](https://expo.dev)
[![Platform](https://img.shields.io/badge/Platform-iOS_%2B_Android-blue?style=for-the-badge)](#)
[![Security](https://img.shields.io/badge/Security-HMAC--SHA256-red?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Scanner App** is the frontline tool for gate operators. It provides a robust, zero-latency scanning experience that works even in areas with poor cellular connectivity.

### Core Mission

| Goal               | Description                                                  |
| :----------------- | :----------------------------------------------------------- |
| **Speed**          | Sub-500ms QR detection and validation                        |
| **Resilience**     | Full offline validation using local cryptographic signatures |
| **Security**       | AES-256 encrypted local storage for queued scan results      |
| **Accountability** | Supervisor PIN overrides and shift tracking                  |

---

## Features

### Security Operations

| Feature                  | Capability                                           |
| :----------------------- | :--------------------------------------------------- |
| **Rapid Scan**           | Instant camera-based QR code detection               |
| **Offline Verification** | Validates cryptographically signed codes without API |
| **Supervisor Override**  | PIN-protected bypass with audit trails               |
| **Identity Capture**     | Level 1/2 identity photo at the gate                 |
| **Shift Management**     | Tracking scans per operator shift                    |

### User Interface (5-Tab System)

| Tab          | Description                                      |
| :----------- | :----------------------------------------------- |
| **Scanner**  | Primary viewfinder for rapid entry               |
| **Today**    | Feed of expected visitors for current shift      |
| **Log**      | Local and synced history of gate activity        |
| **Chat**     | Real-time communication with property management |
| **Settings** | Gate selection, offline queue, logout            |

---

## Tech Stack

| Layer         | Technology                                   |
| :------------ | :------------------------------------------- |
| **Framework** | React Native (Expo SDK 54)                   |
| **Security**  | HMAC-SHA256 for signing, AES-256 for storage |
| **Hardware**  | iOS/Android Camera, Haptics, Geofencing      |
| **Sync**      | Intelligent queue with exponential backoff   |

---

## Getting Started

```bash
# Navigate to scanner directory (from root)
cd apps/scanner-app

# Install native dependencies
pnpm install

# Start Metro Bundler
pnpm dev

# Run on device
npx expo start --dev-client
```

---

## Offline Flow

```
1. Scan    → QR captured, signature extracted
2. Verify  → Locally check HMAC-SHA256
3. Queue   → Result saved with unique scanUuid
4. Sync    → Background worker pushes to API
5. Conflict → scanUuid prevents duplicates
```

---

## Related Documentation

| Document                                              | Description               |
| :---------------------------------------------------- | :------------------------ |
| [Scanner Operations](../guides/SCANNER_OPERATIONS.md) | Offline flow and sync     |
| [Security Overview](../guides/SECURITY_OVERVIEW.md)   | QR signing details        |
| [Mobile Guide](../guides/MOBILE_GUIDE.md)             | Expo setup and deployment |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
