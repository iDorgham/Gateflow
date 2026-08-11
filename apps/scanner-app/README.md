# GateFlow Scanner App

<div align="center">

![Banner](docs/gateflow_banner.png)

**Mobile QR Code Scanner for Gate Operations**

_Offline-capable security scanning with encrypted sync queue_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-4630EB?style=for-the-badge&logo=expo)](https://expo.dev)
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

### User Interface (6-Tab System)

| Tab          | Description                                                    |
| :----------- | :------------------------------------------------------------- |
| **Home**     | Default post-unlock tab — shift widget, Master Scan FAB, stats |
| **Scanner**  | Primary viewfinder for rapid entry                             |
| **Today**    | Feed of expected visitors for current shift                    |
| **Log**      | Local and synced history of gate activity                      |
| **Chat**     | Real-time communication with property management               |
| **Settings** | Gate selection, offline queue, logout                          |

Outside the tab shell: a device unlock gate (PIN/biometric, re-locks after 5
minutes idle), a first-run onboarding wizard, and a shift-active gate that
blocks scanning until the operator clocks in.

---

## Tech Stack

| Layer           | Technology                                                                                                                   |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Framework**   | React Native (Expo SDK 57) — hand-rolled `AppPhase` state machine in `App.tsx`, not Expo Router                              |
| **Auth**        | Tokens in `expo-secure-store`; device unlock via `expo-local-authentication` (PIN/biometric), auto re-lock after 5 min idle  |
| **QR Security** | HMAC-SHA256, verified **server-side** — captured via `expo-camera`, no local JWT decoding                                    |
| **Offline**     | AES-encrypted (PBKDF2-derived key in SecureStore) `AsyncStorage` queue, deduplicated by `scanUuid`                           |
| **Styling**     | `nativeTokens`/`StyleSheet` (Atlassian Design System tokens) — no Nativewind/Tailwind                                        |
| **Motion**      | React Native's built-in `Animated` API (`useNativeDriver: true`) — `react-native-reanimated` is not a dependency of this app |
| **Hardware**    | `expo-camera`, `expo-local-authentication`, `expo-haptics`, `expo-location`                                                  |

---

## Getting Started

```bash
# From the repo root
pnpm install

# From apps/scanner-app — build & launch the native iOS app (installs pods)
pnpm ios

# Or Android
pnpm android

# Metro only (LAN, for an already-installed dev client / physical device)
pnpm dev

# Metro only, bound to localhost (for the iOS Simulator)
pnpm dev:sim
```

This app ships a checked-in native `ios/`/`android/` project (via `expo
prebuild`), not a managed Expo Go workflow — `expo run:ios` / `expo
run:android` are what `pnpm ios` / `pnpm android` call under the hood.

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
