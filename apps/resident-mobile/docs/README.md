# GateFlow Resident Mobile App

<div align="center">

**Native mobile companion for residents**

_Manage visitor passes, view access history, and receive notifications_

[![Status](https://img.shields.io/badge/Status-Development-blue?style=for-the-badge)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-green?style=for-the-badge&logo=expo)](https://expo.dev)
[![Platform](https://img.shields.io/badge/Platform-iOS_%2B_Android-blue?style=for-the-badge)](#)

</div>

---

## Primary Objective

To provide residents with a convenient, mobile-first experience for self-service guest management. Residents can create visitor QR codes, track who accessed the property, and manage account settings.

---

## Key Features

| Feature                     | Description                                 |
| :-------------------------- | :------------------------------------------ |
| **Visitor Pass Management** | Create one-time or recurring visitor passes |
| **QR Code Display**         | Show QR codes for delivery or guests        |
| **Access History**          | View personal scan history                  |
| **Push Notifications**      | Receive alerts when visitors arrive         |
| **Profile Settings**        | Manage account and notification preferences |

---

## Tech Stack

| Layer          | Technology                       |
| :------------- | :------------------------------- |
| **Framework**  | React Native + Expo SDK 54       |
| **Routing**    | Expo Router (file-based routing) |
| **Navigation** | Bottom tabs with Expo Router     |
| **Auth**       | JWT via `expo-secure-store`      |
| **Storage**    | AsyncStorage for local data      |
| **UI**         | `@gate-access/ui` components     |

---

## Folder Structure

```
resident-mobile/
├── app/                     # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── history/       # Access history
│   │   ├── qrs/           # My QR codes
│   │   └── settings/      # App settings
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home/Dashboard
│   ├── login.tsx          # Authentication
│   └── visitors/          # Visitor management
├── lib/                    # Core logic
│   ├── api.ts             # API client
│   ├── auth-client.ts     # Mobile auth
│   ├── history-cache.ts   # Local history
│   ├── qr-cache.ts        # QR storage
│   └── theme.ts           # Theme configuration
├── assets/                 # Images, fonts
├── app.json               # Expo manifest
└── package.json
```

---

## Getting Started

```bash
# Run from root workspace
pnpm turbo dev --filter resident-mobile

# Or run directly
cd apps/resident-mobile && pnpm dev
```

### Run on Device/Simulator

```bash
pnpm dev    # Start Metro bundler
pnpm ios    # Run on iOS
pnpm android # Run on Android
```

### Build for Production

```bash
# iOS (via EAS)
eas build -p ios --profile production

# Android
eas build -p android --profile production
```

---

## Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
# Production: https://api.gateflow.com
```

---

## Key Features Implementation

### Authentication

```typescript
import { auth } from './lib/auth-client';

// Login
await auth.login(email, password);

// Logout
await auth.logout();

// Check auth state
const isAuthenticated = auth.isAuthenticated();
```

### QR Code Management

```typescript
import { qrCache } from './lib/qr-cache';

// Get cached QR codes
const qrs = await qrCache.getAll();

// Add new QR
await qrCache.add(qrData);
```

---

## Dependencies

| Dependency                                  | Description          |
| :------------------------------------------ | :------------------- |
| `expo`                                      | Expo SDK             |
| `expo-router`                               | File-based routing   |
| `expo-secure-store`                         | Secure token storage |
| `@gate-access/ui`                           | Shared UI components |
| `@react-native-async-storage/async-storage` | Local storage        |

---

## Related Documentation

| Document                                                             | Description          |
| :------------------------------------------------------------------- | :------------------- |
| [Resident Portal Spec](../../docs/RESIDENT_PORTAL_SPEC.md)           | Full specification   |
| [Mobile Design Skill](../../.opencode/skills/mobile-design/SKILL.md) | Mobile patterns      |
| [Scanner App](../scanner-app/README.md)                              | Similar architecture |
| [Phase 2 Roadmap](../../docs/PHASE_2_ROADMAP.md)                     | Future features      |

---

## Platform Notes

### iOS

- iOS Keychain for secure token storage
- Apple Developer account for builds
- Push notifications via APNs

### Android

- Android Keystore for secure storage
- Push notifications via FCM
- Google Play Console for production builds
