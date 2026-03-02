---
name: mobile-design
description: Mobile app design for Expo and React Native. Use when designing scanner app, resident app, or mobile-specific UI/UX.
---

# Mobile Design (Expo / React Native)

## GateFlow mobile

- **Scanner app** — QR scanner, gate selector, offline queue
- **Resident mobile** — Planned; self-service QR
- **SDK:** Expo SDK 54

## Patterns

- **Touch targets** — Min 44×44pt
- **Bottom sheets** — Gate selector, modals
- **Offline-first** — Queue status, sync indicator
- **Secure** — SecureStore for tokens; no localStorage

## Components

- **Expo:** Camera, Haptics, Location, SecureStore
- **React Native:** View, Text, TouchableOpacity, ScrollView
- **Navigation:** Expo Router (`_layout.tsx`, file-based routes)

## Platform

- **iOS/Android** — Test both; platform-specific tweaks via `Platform.select()`
- **Safe areas** — Use `SafeAreaView` or insets for notches/home indicator
