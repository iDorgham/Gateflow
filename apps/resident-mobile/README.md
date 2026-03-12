# GateFlow Resident Mobile App

<p align="center">
  <img src="https://img.shields.io/badge/Status-Development-blue" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Expo%20SDK%2054-green" alt="Expo">
  <img src="https://img.shields.io/badge/React%20Native-0.81-blue" alt="React Native">
</p>

The `resident-mobile` app is the native mobile companion for residents in GateFlow-managed properties. It allows residents to manage their visitor passes, view access history, and receive notifications — all from their iOS or Android device.

## 🎯 Primary Objective

To provide residents with a convenient, mobile-first experience for self-service guest management. Residents can create visitor QR codes, track who accessed the property under their passes, and manage their account settings.

## ✨ Key Features

- **Visitor Pass Management**: Create one-time or recurring visitor passes
- **QR Code Display**: Show QR codes for delivery personnel or guests
- **Access History**: View personal scan history
- **Push Notifications**: Receive alerts when visitors arrive
- **Profile Settings**: Manage account and notification preferences

## 🛠 Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Routing**: Expo Router (file-based routing)
- **Navigation**: Bottom tabs with Expo Router
- **Auth**: JWT via `expo-secure-store`
- **Storage**: AsyncStorage for local data
- **UI**: `@gate-access/ui` components
- **Icons**: `@expo/vector-icons`

## 📁 Folder Structure

```
resident-mobile/
├── app/                     # Expo Router pages
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tab layout
│   │   ├── history/        # Access history
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
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Expo CLI

### Local Development

```bash
# Run from root workspace
pnpm turbo dev --filter resident-mobile

# Or run directly
cd apps/resident-mobile
pnpm dev
```

### Running on Device/Simulator

```bash
# Start Metro bundler
pnpm dev

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

### Build for Production

```bash
# Build iOS (via EAS)
eas build -p ios --profile production

# Build Android
eas build -p android --profile production
```

## Environment Variables

Create `.env` file in `apps/resident-mobile/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
# Production URL when deploying
# EXPO_PUBLIC_API_URL=https://api.gateflow.com
```

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

### API Calls

```typescript
import { api } from './lib/api';

// Fetch visitor passes
const visitors = await api.getVisitors();

// Create visitor pass
const newPass = await api.createVisitor({
  name: 'John Doe',
  type: 'SINGLE',
  validUntil: '2026-03-15T18:00:00Z',
});
```

## Dependencies

### Production

- `expo` — Expo SDK
- `expo-router` — File-based routing
- `expo-secure-store` — Secure token storage
- `expo-font` — Custom fonts
- `@gate-access/ui` — Shared UI components
- `@react-native-async-storage/async-storage` — Local storage
- `react-native-safe-area-context` — Safe area handling

### Development

- `typescript` — TypeScript compiler
- `@types/react` — React types

## Related Documentation

- [Resident Portal Spec](../../docs/RESIDENT_PORTAL_SPEC.md)
- [Mobile Design Skill](../../.opencode/skills/mobile-design/SKILL.md)
- [Scanner App README](../scanner-app/README.md) — Similar architecture
- [Phase 2 Roadmap](../../docs/PHASE_2_ROADMAP.md)

## Platform Notes

### iOS

- Uses iOS Keychain for secure token storage
- Requires Apple Developer account for builds
- Push notifications via APNs

### Android

- Uses Android Keystore for secure storage
- Push notifications via FCM
- Requires Google Play Console for production builds
