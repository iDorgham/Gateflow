# GateFlow Resident Mobile

<div align="center">

![Banner](docs/gateflow_banner.png)

**The Ultimate Companion for Resident Autonomy**

_Manage visitor access, create QR passes, and get notified of guest arrivals_

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-4630EB?style=for-the-badge&logo=expo)](https://expo.dev)
[![Platform](https://img.shields.io/badge/Platform-iOS_%2B_Android-blue?style=for-the-badge)](#)
[![Sharing](https://img.shields.io/badge/Sharing-WhatsApp_Genesis-green?style=for-the-badge)](#)

</div>

---

## Overview

The **GateFlow Resident Mobile App** empowers residents to manage their property access independently. No more calls to security — everything handled via secure, intuitive mobile interface.

### Resident Benefits

| Benefit                  | Description                                                 |
| :----------------------- | :---------------------------------------------------------- |
| **One-Tap Access**       | Create QR codes for guests and share via WhatsApp or Email  |
| **Real-Time Visibility** | Push notifications when guest scans at gate                 |
| **Smart Quotas**         | Track monthly visitor allowance by unit type                |
| **Recurring Access**     | Permanent passes for family or weekly passes for house help |

---

## Features

### Pass Creation

| Type           | Use Case                                      |
| :------------- | :-------------------------------------------- |
| **One-Time**   | Single entry for friend or delivery           |
| **Date-Range** | Weekend guests or maintenance workers         |
| **Recurring**  | Weekly cleaning service or recurring delivery |
| **Permanent**  | Immediate family or secondary vehicle owners  |

### Smart Notifications

| Notification         | Description                            |
| :------------------- | :------------------------------------- |
| **Arrival Alerts**   | Know when guest enters property        |
| **Quota Warnings**   | Alert when nearing monthly limit       |
| **Security Updates** | Safety alerts from property management |

---

## Tech Stack

| Layer          | Technology                        |
| :------------- | :-------------------------------- |
| **Platform**   | React Native (Expo SDK 54)        |
| **Navigation** | Expo Router (File-based routing)  |
| **Sharing**    | Native OS Share Sheet integration |
| **Contacts**   | OS-level contact picker           |
| **Storage**    | SecureStore for encrypted tokens  |

---

## Getting Started

```bash
# Navigate to resident-mobile directory
cd apps/resident-mobile

# Install dependencies
pnpm install

# Start development
pnpm dev

# Open in simulator
# Press 'i' for iOS or 'a' for Android
```

---

## Architecture

```
apps/resident-mobile/
├── app/                   # Main screens (Home, Create, History, Profile)
├── components/            # UI layout and shared widgets
├── lib/                   # API client and secure storage
├── hooks/                 # Custom React hooks
└── assets/                # Brand icons and images
```

---

## Related Documentation

| Document                                                        | Description               |
| :-------------------------------------------------------------- | :------------------------ |
| [Mobile Guide](../guides/MOBILE_GUIDE.md)                       | Expo setup and deployment |
| [Security Overview](../guides/SECURITY_OVERVIEW.md)             | Token storage             |
| [i18n Guide](../guides/UI_DESIGN_GUIDE.md#internationalization) | AR/EN support             |

---

<div align="center">

**Part of the GateFlow Production Ecosystem**

[Main README](../README.md) · [Documentation Index](../README.md) · [gateflow.site](https://gateflow.site)

</div>
