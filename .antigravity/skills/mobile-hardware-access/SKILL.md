---
name: mobile-hardware-access
description: Specialized workflows and patterns for mobile-hardware-access.
---

# SKILL: Mobile Hardware Access (Camera, Haptics, GPS)

## Purpose

Optimize the usage of mobile hardware in GateFlow apps to provide a seamless, performant, and reliable scanning and navigation experience.

## Core Principles

1.  **Permission Management**: Request hardware permissions ONLY when needed (Lazy Permissioning).
2.  **Battery Sensitivity**: Only poll GPS or keep the Camera active during active operational windows.
3.  **Tactile Feedback**: Use Haptics to confirm scanning success or failure to the operator without them needing to look at the screen.

## Implementation Rules

- **Camera (Scanner App)**:
  - Use `expo-camera/next`.
  - Disable barcode scanning when the app is in the background.
- **Haptics**:
  - `Success`: `NotificationFeedbackType.Success`.
  - `Failure`: `NotificationFeedbackType.Error`.
- **GPS**: Threshold-based polling (ignore movements < 5 meters to save battery).

## Anti-Patterns

- Keeping the camera stream active while a modal is open.
- Over-using haptics (vibrating for every minor tap).
- Hard-locking the app if a permission is denied (provide alternative manual entry).

## Code Examples

### Optimized Camera Hook

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera/next';

export const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return <Button title="Enable Scanner" onPress={requestPermission} />;
  }

  return (
    <CameraView
      onBarcodeScanned={handleScan}
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      style={{ flex: 1 }}
    />
  );
};
```

### Feedback Utility

```typescript
import * as Haptics from 'expo-haptics';

export const triggerHaptic = (type: 'success' | 'error') => {
  if (type === 'success')
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
```
