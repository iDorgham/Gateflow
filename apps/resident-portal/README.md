<p align="center">
  <img src="../../docs/gateflow_banner.png" alt="GateFlow Banner" width="100%">
</p>

<h1 align="center">GateFlow Resident Portal</h1>

<p align="center">
  <strong>Self-Service Guest Management for Residents</strong><br>
  <em>Web-based portal for unit owners to manage visitor access</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-1.0.0--Production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-blue" alt="Framework">
  <img src="https://img.shields.io/badge/Type-Web%20Portal-blue" alt="Type">
</p>

---

## 📋 Overview

The **GateFlow Resident Portal** provides a professional web interface for residents who prefer desktop management or don't have the mobile app installed. It mirrors the core functionality of the Resident Mobile app in a responsive browser environment.

### Key Capabilities
- **Desktop Management**: Large-scale visitor management for high-capacity units (Penthouse/Villas).
- **Quota Visualization**: Detailed breakdown of monthly visitor allocations.
- **Rule Engine**: Precision control over access windows (Recurring/Date-range).
- **Audit Logs**: Full history of everyone who has used your unit's QR codes.

---

## ✨ Features

### 🎫 Visitor Control
| Feature | Capability |
| :--- | :--- |
| **Pass Generation** | Create high-resolution QR codes for print or digital sharing. |
| **Quota Monitor** | Real-time tracking of remaining guest slots for the month. |
| **Open QR** | Manage permanent, unit-linked passes for primary residents. |
| **Revocation** | Instantly cancel any active pass from the dashboard. |

### 🏠 Unit Support
- **Multi-Unit**: Residents with multiple properties can switch between units seamlessly.
- **Profile Sync**: Shared settings and visitor history across Web and Mobile.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router).
- **QR Generation**: Client-side SVG generation for crisp printing.
- **Security**: jose-powered JWT verification and secure HttpOnly cookies.
- **Styling**: Tailwind CSS with RTL/Arabic support.

---

## 🚀 Getting Started

```bash
# Install root
pnpm install

# Build shared packages
pnpm turbo build --filter=@gate-access/*

# Start Resident Portal
pnpm dev:resident-portal
```

**Local Port**: `http://localhost:3003`

---

<p align="center">
  <strong>Part of the GateFlow 1.0 Production Ecosystem</strong><br>
  <a href="../../README.md">Main Project</a> • <a href="../../docs/README.md">Documentation Index</a>
</p>
