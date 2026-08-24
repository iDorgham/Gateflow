# Scanner runtime evidence — 2026-08-21

## Scope

- Branch: `feat/scanner-runtime-proof`
- Commit at start: `bf5ad4010c25e85a8bb0547f579d92f9c5c08123`
- Focus: validate the scanner Expo/EAS runtime slice before collecting owned
  pilot evidence.
- Result: **manual device evidence still required**. No pilot gate was updated.

## Focused-diff ownership

Scanner runtime slice:

- `apps/scanner-app/app.json`
- `apps/scanner-app/ios/scannerapp/AppDelegate.swift`
- `apps/scanner-app/jest.config.js`
- `apps/scanner-app/metro.config.js`
- `apps/scanner-app/package.json`
- `apps/scanner-app/eas.json`
- `eas.json`
- `package.json`
- `pnpm-lock.yaml`

Excluded pre-existing/unrelated files (not edited or claimed):

- `docs/audits/GATEFLOW_AUDIT_2026-08-19.md`
  (`8c1e38620f9ff3ec7b2931c1e48d5ae206e7be74`)
- `docs/audits/GATEFLOW_LAST_CHANGES_AUDIT_2026-08-19.md`
  (`41f02b4fff5ff5b810c788e676f6fe1f08e95032`)
- `scripts/ai-sync/sync-ai-tools.impl.sh`
  (`45dddf9d15206261cb19b61055650eed47724108`)

## Fresh local verification

Run from the repository root on 2026-08-21:

| Check                                        | Result                                                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm --filter scanner-app lint`             | Passed with 0 errors and 30 warnings                                                                 |
| `pnpm --filter scanner-app test`             | Passed: 13 suites, 142 tests                                                                         |
| `pnpm --filter scanner-app build`            | Passed: Android and iOS Expo bundles exported                                                        |
| `xcodebuild -version`                        | Xcode 26.1.1 (17B100)                                                                                |
| `xcrun simctl list devices available`        | iOS 26.1 simulators available; all shutdown                                                          |
| `eas whoami`                                 | Authenticated Expo account confirmed                                                                 |
| `eas device:list --apple-team-id U56S63Y79Q` | One physical iPhone UDID registered                                                                  |
| Latest EAS simulator build inspection        | App Swift compilation reached `AppDelegate.swift`; build failed in the CocoaPods resource-copy phase |

The export is static build evidence only. It is not device or access-decision
proof.

The inspected EAS failure reported that
`Pods-scannerapp-resources.sh` could not write
`resources-to-copy-scannerapp.txt` while user-script sandboxing was enabled,
followed by an unsupported `realpath -m` invocation. The scanner Xcode target's
Debug and Release settings were changed to
`ENABLE_USER_SCRIPT_SANDBOXING = NO`. A replacement physical-device build has
not been queued because EAS requires interactive Apple Developer credentials;
the terminal is currently waiting at the Apple ID prompt.

## P0 evidence status

### Dashboard-backed QR grant

**Manual / blocked.** No physical camera device was available in this session.
There is no fresh scan proving that a newly persisted dashboard `QRCode.id`
equals the signed payload `qrId` and receives server `accepted` with a persisted
`scanId`. ACCESS GRANTED is therefore unproven.

### Offline enqueue and reconnect sync

**Manual / blocked.** Unit coverage is green, but no physical-device run was
available to prove encrypted offline enqueue, pending/no-grant UI, reconnect,
and `scanUuid`-deduplicated server sync.

## Required manual capture

1. Install and run the signed SDK 57 scanner development client on a physical
   iPhone with camera access.
2. Authenticate, select the assigned gate, and start a shift.
3. Create a new QR in the dashboard and record its database ID without exposing
   visitor PII or the signing secret.
4. Scan once and capture the server-backed ACCESS GRANTED result plus persisted
   `scanId`; verify payload `qrId` equals the dashboard database ID.
5. Create another valid QR, disconnect networking, scan once, and capture the
   pending/no-grant state.
6. Reconnect, sync, and capture successful persistence keyed by the same
   `scanUuid`.
7. Only then refresh the owned pilot evidence JSON and consider changing its
   status to `passed`.
