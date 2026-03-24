# GateFlow Resident Mobile

<div align="center">

**Native iOS and Android application for residents**

_Deep OS integration, push notifications, and biometric security_

</div>

---

## Primary Objective

To offer a premium, frictionless experience for high-frequency residents. The native app allows for instant push notifications regarding gate arrivals and secure offline storage of personal entry credentials.

---

## Key Features

| Feature                       | Description                                          |
| :---------------------------- | :--------------------------------------------------- |
| **Push Notifications**        | Immediate alerts when visitors scan generated passes |
| **Native Wallet Integration** | Apple Wallet / Google Pay for offline scanning       |
| **Offline Reliability**       | SQLite caching for zero-cellular reception           |
| **Biometric Locking**         | FaceID / TouchID before launching app                |

---

## Tech Stack

| Layer          | Technology                                       |
| :------------- | :----------------------------------------------- |
| **Framework**  | React Native + Expo (Managed Workflow)           |
| **Styling**    | Nativewind / React Native `StyleSheet`           |
| **Navigation** | React Navigation or Expo Router                  |
| **Icons**      | Lucide React Native                              |
| **Storage**    | `expo-secure-store` for JWTs, SQLite for caching |

---

## Folder Structure

```
resident-mobile/
├── app/                  # Expo Router views
│   ├── (tabs)/           # Bottom navigation (Passes, History, Settings)
│   ├── _layout.tsx       # Root authenticated boundaries
├── components/           # Mobile-specific UI
├── hooks/               # Push notification and auth hooks
├── assets/              # Local fonts, splash screens
├── eas.json             # EAS Build profiles
├── app.json             # Expo manifest
└── package.json
```

---

## Getting Started

### Local Development

1. Download **Expo Go** on your physical device
2. Run from root workspace:

```bash
pnpm turbo dev --filter resident-mobile
```

3. Scan the QR code in terminal with device camera

### Deployment

Handled exclusively via Expo Application Services (EAS). Ensure `eas.json` is configured before App Store / Play Store.

---

## Related Documentation

| Document                                                             | Description     |
| :------------------------------------------------------------------- | :-------------- |
| [Deployment Guide](../../docs/DEPLOYMENT_GUIDE.md)                   | EAS deployment  |
| [Design Tokens](../../docs/DESIGN_TOKENS.md)                         | UI tokens       |
| [Mobile Design Skill](../../.opencode/skills/mobile-design/SKILL.md) | Mobile patterns |
