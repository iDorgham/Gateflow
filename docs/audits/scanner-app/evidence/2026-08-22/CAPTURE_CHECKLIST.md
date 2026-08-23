# Scanner device-proof checklist

- [ ] `scan-access-granted.png` — fresh dashboard QR; no visitor PII.
- [ ] Record the persisted `scanId` and confirm payload `qrId` equals the DB QR id.
- [ ] `offline-pending.png` — valid scan while offline; pending/no-grant state.
- [ ] Record the offline `scanUuid` without visitor PII.
- [ ] `offline-synced.png` — reconnect and persist using the same `scanUuid`.
- [ ] Run `scripts/scanner/device-proof.sh finalize`.

Screenshots are device evidence only after the IDs are checked against the
database/API. Do not mark the pilot gate passed from screenshots alone.
