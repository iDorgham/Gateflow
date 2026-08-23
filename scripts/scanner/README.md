# Scanner physical-device proof runner

This helper automates the repeatable parts of the scanner pilot proof while
preserving the two observations that must happen on a physical camera device.

```bash
# Preflight only; creates the dated evidence folder.
bash scripts/scanner/device-proof.sh prepare

# Opens Expo Orbit and owns the LAN Metro process/log until Ctrl-C.
bash scripts/scanner/device-proof.sh run

# If the Dashboard UI is blocked, create a fresh DB-backed signed proof QR
# using the same canonical signer and QRCode persistence invariant.
pnpm exec tsx --env-file=apps/client-dashboard/.env.local \
  scripts/scanner/create-proof-qr.ts

# Verify the device decision against persisted QRCode + ScanLog IDs.
node --env-file=apps/client-dashboard/.env.local --import tsx \
  scripts/scanner/verify-proof-scan.ts

# After exporting the three named iPhone screenshots into the evidence folder.
bash scripts/scanner/device-proof.sh finalize
```

`run` intentionally does not print or copy Expo environment values into the
evidence packet. Metro still embeds `EXPO_PUBLIC_*` values in the client bundle,
so run it only on a trusted LAN and stop it after capture.

The operator still performs the camera scan and toggles connectivity. Those
steps are not replaced with an in-app fixture because a fixture would not prove
camera capture or real offline/reconnect behavior. `finalize` hashes evidence
but does not update `PILOT_GATE_OWNED`; promotion requires checking `qrId`,
`scanId`, and `scanUuid` against the database/API first.

`create-proof-qr.ts` is a bounded fallback for a broken local Dashboard UI. It
creates a new single-use `QRCode`, signs a payload whose `qrId` equals that DB
record ID, verifies the signature locally, and writes only a PNG plus redacted
metadata. It never writes the signed payload, nonce, or signing secret to the
evidence packet.
