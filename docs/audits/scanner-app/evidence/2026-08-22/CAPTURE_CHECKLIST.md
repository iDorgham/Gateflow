# Scanner device-proof checklist

- [x] `scan-access-granted.png` — fresh DB-backed QR; no visitor PII.
- [x] Persisted `scanId` recorded and payload `qrId` equals the DB QR id in
      `scan-proof-scan-meta.txt`.
- [x] `offline-pending.png` — physical iPhone offline pending/no-grant
      state.
- [x] Offline `scanUuid` recorded without visitor PII in
      `offline-proof-4-scan-meta.txt`.
- [x] `offline-synced.png` — reconnect and persist using the same
      `scanUuid`; Queue shows 0 scans / 0 failed and Sync completed.
- [x] Run `scripts/scanner/device-proof.sh finalize`.

Screenshots are device evidence only after the IDs are checked against the
database/API. Do not mark the pilot gate passed from screenshots alone.
