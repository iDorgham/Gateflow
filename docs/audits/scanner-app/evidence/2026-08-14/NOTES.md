# Scanner device evidence — 2026-08-14

## Shift lock (pre-scan)

- Artifact: `scan-shift-locked.png`
- Overlay: "Start your shift to unlock scanning"
- Gate 1 selected; shift not started yet

## Signed QR scan — nonce replay deny

- Artifact: `scan-nonce-replay-denied.png`
- Shift: Gate 1 · On duty (END SHIFT visible)
- Result: ACCESS DENIED
- Reason: `Nonce c8df7d04-5107-43cf-8f6e-3158ee99059b already seen`
- Meaning: local HMAC verify already succeeded once; scanner recorded the nonce; a second scan of the same PNG was rejected (replay protection)
- QR: `signed-qr-gateway-academy.png` (`qrId=test-1786730010823-94fe3fc2`) — HMAC-only PNG, not a DB `QRCode` row

## Next

- Keep Gate 1 shift open
- Do not rescan the old PNG
- Generate a **new** dashboard QR (DB row id = payload `qrId`) and scan **once** for ACCESS GRANTED
