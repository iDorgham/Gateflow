<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Scanner App</h1>

<p align="center">
  <strong>Mobile QR Code Scanner for Gate Operations</strong><br>
  <em>Offline-capable security scanning with encrypted sync queue</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-100%25-green" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Expo%20SDK%2054-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Platform-iOS%20%2B%20Android-blue" alt="Platform">
</p>

---

## 📋 Overview

The **GateFlow Scanner App** is the mobile application for security guards and gate operators to scan visitor QR codes. Built with offline-first architecture, it works seamlessly without internet connectivity and automatically syncs when reconnected.

### Purpose

- 📱 **QR Scanning** — Fast, reliable camera-based code scanning
- 📴 **Offline Mode** — Works without internet connection
- 🔐 **Secure Sync** — AES-256 encrypted queue synchronization
- 👮 **Gate Operations** — Multi-gate support with assignments
- 📋 **Supervisor Override** — PIN-based bypass with audit trail
- 💬 **Communication** — Chat with administrators

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Camera Scanning** | Real-time QR code detection | ✅ Complete |
| **Offline Mode** | Works without internet | ✅ Complete |
| **Encrypted Sync** | AES-256 queue encryption | ✅ Complete |
| **Gate Selector** | Multi-gate support | ✅ Complete |
| **Today's Visits** | Expected visitor list | ✅ Complete |
| **Scan History** | Local scan log | ✅ Complete |
| **Supervisor Override** | PIN-based bypass | ✅ Complete |
| **Chat** | Admin communication | ✅ Complete |
| **Settings** | App configuration | ✅ Complete |
| **Queue Status** | Sync progress display | ✅ Complete |
| **Gate Assignments** | Operator-gate mapping | ✅ Complete |
| **Location Enforcement** | GPS-based validation | ✅ Complete |
| **Shift Tracking** | Operator shift management | ✅ Complete |
| **Incident Reporting** | Report security incidents | ✅ Complete |
| **ID Capture** | Visitor ID photo | ✅ Complete |

### App Interface (5 Tabs)

1. **Scanner** — QR scanning with camera
2. **Today** — Expected visits list
3. **Log** — Scan history
4. **Chat** — Admin communication
5. **Settings** — App configuration

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Expo SDK 54 / React Native |
| **Language** | TypeScript |
| **Camera** | expo-camera |
| **Storage** | AsyncStorage + SecureStore |
| **Encryption** | crypto-js (HMAC-SHA256, AES-256) |
| **Location** | expo-location |
| **Notifications** | expo-device |
| **Haptics** | expo-haptics |
| **Testing** | Jest |

### Key Dependencies

```json
{
  "expo": "~54.0.33",
  "react-native": "0.81.5",
  "expo-camera": "~17.0.10",
  "expo-secure-store": "~15.0.8",
  "expo-location": "~19.0.8",
  "expo-haptics": "~15.0.8",
  "expo-network": "~8.0.8",
  "crypto-js": "^4.2.0"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Expo CLI
- For native builds: Xcode (iOS) / Android Studio (Android)

### Installation

```bash
# From monorepo root
pnpm install

# Generate prisma client
cd packages/db
npx prisma generate

# Start development
pnpm turbo dev --filter=scanner-app
```

### Running the App

```bash
# Navigate to app directory
cd apps/scanner-app

# Start Expo
pnpm dev

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

### Metro Bundler Port

```
http://localhost:8081
```

---

## 📁 Project Structure

```
apps/scanner-app/
├── src/
│   ├── components/            # React components
│   │   ├── GateSelector.tsx  # Gate selection
│   │   ├── HistoryTab.tsx    # Scan history
│   │   ├── QueueStatus.tsx   # Sync status
│   │   ├── SettingsTab.tsx   # App settings
│   │   ├── ScanResultOverlay.tsx  # Scan result
│   │   ├── SupervisorOverride.tsx # Override flow
│   │   └── ...
│   └── lib/
│       ├── scanner.ts        # Core scanning logic
│       ├── qr-verify.ts      # Offline QR verification
│       ├── offline-queue.ts  # Encrypted sync queue
│       ├── auth-client.ts    # Mobile auth
│       ├── scan-history.ts   # Local history
│       └── preferences.ts    # User preferences
├── android/                   # Android native config
├── ios/                      # iOS native config
├── app.json                  # Expo config
├── metro.config.js          # Metro bundler config
└── package.json
```

---

## 🔐 Security

### QR Code Verification

```
1. Scan QR code
2. Extract HMAC-SHA256 signature
3. Verify using shared secret
4. Check expiry, status, gate assignment
5. Queue result locally (offline)
```

### Offline Encryption

- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2
- **Deduplication**: scanUuid ensures no double-counting

### Sync Conflict Resolution

- **Strategy**: Last Write Wins (LWW)
- **Dedup Key**: scanUuid

---

## 📱 App Screens

### Scanner Tab
- Camera viewfinder
- Scan result overlay (success/failure)
- Supervisor override button

### Today Tab
- Expected visitor list
- Filter by time
- Quick scan from list

### Log Tab
- Scan history
- Filter by status/gate/date
- Export capability

### Chat Tab
- Message history
- Real-time admin chat
- Push notifications

### Settings Tab
- Current gate selection
- Operator profile
- App preferences
- Queue sync status

---

## 🔗 Related Apps

| App | Description | Port |
|-----|-------------|------|
| [Client Dashboard](../client-dashboard) | Portal for admins | 3001 |
| [Resident Mobile](../resident-mobile) | Resident app | 8083 |

---

## 📄 License

MIT License — see [../../LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>Part of the GateFlow Ecosystem</strong><br>
  <a href="https://gateflow.io">Website</a> • <a href="https://github.com/iDorgham/Gateflow">GitHub</a>
</p>
