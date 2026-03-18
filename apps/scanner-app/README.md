<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Scanner App</h1>

<p align="center">
  <strong>Mobile QR Code Scanner for Gate Operations</strong><br>
  <em>Offline-capable security scanning with encrypted sync queue</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Expo%20SDK%2054-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Platform-iOS%20%2B%20Android-blue" alt="Platform">
</p>

---

## 📋 Overview

The **GateFlow Scanner App** is the frontline tool for gate operators. It provides a robust, zero-latency scanning experience that works even in areas with poor cellular connectivity, ensuring the gate never stops moving.

### Core Mission
- **Speed**: Sub-500ms QR detection and validation.
- **Resilience**: Full offline validation using local cryptographic signatures.
- **Security**: AES-256 encrypted local storage for queued scan results.
- **Accountability**: Supervisor PIN overrides and shift tracking.

---

## ✨ Features

### 🛡️ Security Operations
| Feature | Capability |
| :--- | :--- |
| **Rapid Scan** | Instant camera-based QR code detection. |
| **Offline Verification** | Validates cryptographically signed codes without an API call. |
| **Supervisor Override** | PIN-protected bypass with dedicated audit trails. |
| **Identity Capture** | Level 1/2 identity photo capture directly at the gate. |
| **Shift Management** | Tracking scans and activity per operator shift. |

### 📱 User Interface (5-Tab System)
1. **Scanner**: The primary viewfinder for rapid entry.
2. **Today**: Feed of expected visitors for the current shift.
3. **Log**: Local and synced history of all gate activity.
4. **Chat**: Real-time communication with property management.
5. **Settings**: Gate selection, offline queue status, and logout.

---

## 💻 Tech Stack

- **Framework**: React Native (Expo SDK 54).
- **Security**: HMAC-SHA256 for code signing, AES-256 for local storage.
- **Hardware**: iOS/Android Camera, Haptics, and Local Geofencing.
- **Sync**: Intelligent queue manager with exponential backoff.

---

## 🚀 Getting Started

```bash
# Navigate to scanner directory
cd apps/scanner-app

# Install native dependencies
pnpm install

# Start Metro Bundler
pnpm dev

# Run on device (Expo Go or Development Build)
npx expo start --dev-client
```

---

## 🔐 Offline Flow

1. **Scan**: QR is captured and signature extracted.
2. **Verify**: Locally check HMAC-SHA256 against the shared org secret.
3. **Queue**: Result is saved to an encrypted local queue with a unique `scanUuid`.
4. **Sync**: A background worker attempts to push the queue to the API periodically.
5. **Conflict**: `scanUuid` ensures no duplicate scans are ever recorded in the main DB.

---

<p align="center">
  <strong>Part of the GateFlow 1.0 Production Ecosystem</strong><br>
  <a href="../../README.md">Main Project</a> • <a href="../../docs/README.md">Documentation Index</a>
</p>
