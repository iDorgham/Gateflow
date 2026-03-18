<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Resident Mobile</h1>

<p align="center">
  <strong>The Ultimate Companion for Resident Autonomy</strong><br>
  <em>Manage visitor access, create QR passes, and get notified of guest arrivals</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Expo%20SDK%2054-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Platform-iOS%20%2B%20Android-blue" alt="Platform">
</p>

---

## 📋 Overview

The **GateFlow Resident Mobile App** empowers residents to manage their property access independently. No more calls to security or pre-announced guest lists — everything is handled via a secure, intuitive mobile interface.

### Resident Benefits
- **One-Tap Access**: Create QR codes for guests and share them instantly via WhatsApp or Email.
- **Real-Time Visibility**: Receive push notifications the moment your guest scans at the gate.
- **Smart Quotas**: Track your monthly visitor allowance based on your unit type.
- **Recurring Access**: Set up permanent passes for family or weekly passes for house help.

---

## ✨ Features

### 🎫 Pass Creation
| Type | Use Case |
| :--- | :--- |
| **One-Time** | Single entry for a friend or delivery. |
| **Date-Range** | Weekend guests or maintenance workers. |
| **Recurring** | Weekly cleaning service or recurring delivery. |
| **Permanent** | Immediate family members or secondary vehicle owners. |

### 🔔 Smart Notifications
- **Arrival Alerts**: Know exactly when your guest enters the property.
- **Quota Warnings**: Get alerted when you are nearing your monthly guest limit.
- **Security Updates**: Receive safety alerts directly from property management.

---

## 💻 Tech Stack

- **Platform**: React Native (Expo SDK 54).
- **Navigation**: Expo Router (File-based routing).
- **Sharing**: Native OS Share Sheet integration.
- **Contacts**: OS-level contact picker for quick guest selection.
- **Storage**: SecureStore for encrypted auth tokens and offline QR cache.

---

## 🚀 Getting Started

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

## 📁 Key Directories

- `/app`: Main application screens (Home, Create, History, Profile).
- `/components`: UI layout and shared widgets.
- `/lib`: API client and secure storage helpers.
- `/assets`: Brand-compliant icons and images.

---

<p align="center">
  <strong>Part of the GateFlow 1.0 Production Ecosystem</strong><br>
  <a href="../../README.md">Main Project</a> • <a href="../../docs/README.md">Documentation Index</a>
</p>
