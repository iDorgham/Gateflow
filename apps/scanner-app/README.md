# GateFlow Scanner App

The `scanner-app` is the foundational security bridge of the GateFlow ecosystem. It is a specialized, hardware-oriented React Native (Expo) application used by front-desk personnel, security guards, and automated kiosks to cryptographically validate entering physical credentials.

## 🎯 Primary Objective
To provide a lightning-fast, highly resilient scanning interface capable of validating visitor, resident, and vendor QR codes in varying connectivity environments.

## ✨ Key Features
- **High-Speed Camera Parsing**: Rapid frame extraction and Barcode/QR logic via Expo Camera.
- **Cryptographic Validation**: JWT token decoding locally to verify expiry timestamps before making network calls.
- **Offline First Pipeline**: Sync authorized pass trees locally inside SQLite. If connectivity drops (common at physical gates), the scanner validates fully in offline mode and queues scan logs.
- **Background Sync Engine**: Resolves queued access sweeps seamlessly when the network restores without interrupting the guard.
- **Supervisor Override Protocol**: Allows a high-clearance manager to type a PIN to bypass software validation failures.

## 🛠 Tech Stack
- **Framework**: React Native + Expo (Managed Workflow)
- **Camera hardware**: `expo-camera` / `expo-barcode-scanner`
- **Offline Sync & Storage**: Prisma/SQLite or local asynchronous stores managing the `SyncQueue`.
- **Styling**: Nativewind / React Native `StyleSheet` (Tapping into `packages/ui/src/tokens.ts -> nativeTokens`)
- **Tokens/Auth**: `expo-secure-store` ensuring gate-level JWTs are locked strictly to the hardware.

## 📁 Folder Structure
```text
scanner-app/
├── app/                  # Expo Router views
│   ├── (auth)/           # Operator login & hardware pairing
│   ├── scanner/          # Main camera viewfinder module
│   ├── queue/            # Offline sync status tables
│   ├── _layout.tsx       # Root bounds
├── logic/                # Core cryptography validation algorithms
├── db/                   # Offline SQLite mappings
├── eas.json              # EAS Build profiles (Kiosk Lock features)
├── app.json              # Expo manifest (Hardware permissions)
└── package.json
```

## 🚀 Getting Started

### Local Development
Since this reliant on hardware camera feeds, **Simulators are not recommended**. Use a physical device.
```bash
pnpm turbo dev --filter scanner-app
```

### Pre-requisites & Permissions
The app mandates strict `NSCameraUsageDescription` parameters inside `app.json`. Without proper hardware authorizations, the app routes directly to a `PermissionsDenied` fatal view.

## 🛡 Security Note
This app utilizes "Kiosk Mode" logic wherever possible to lock single-purpose Android devices into the Viewfinder perspective, disabling physical home buttons. Handled via the MDM infrastructure alongside EAS profiles.

## 🔗 Related Documentation
- [Security Overview](../../docs/SECURITY_OVERVIEW.md)
- [Design Tokens](../../docs/DESIGN_TOKENS.md)
