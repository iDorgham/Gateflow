# GateFlow Mobile Development Expert

## Purpose
Expert knowledge of React Native, Expo, and mobile-specific patterns for GateFlow scanner and resident apps.

## When to Use
- Working on scanner-app or resident-mobile
- Implementing mobile features
- Debugging mobile issues
- Handling offline functionality

## Mobile Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router
- **Storage**: AsyncStorage (general), SecureStore (tokens)
- **Camera**: expo-camera
- **Location**: expo-location
- **Offline**: Custom queue with encryption

## Scanner App Architecture

### Key Features
1. **Offline-first scanning** with encrypted queue
2. **Local HMAC verification** before network call
3. **Automatic sync** when connection restored
4. **Scan deduplication** using scanUuid
5. **Supervisor override** with PIN protection

### Offline Queue Pattern
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

// Encrypt scan data
function encryptScan(scanData: ScanData, key: string): string {
  const json = JSON.stringify(scanData);
  return CryptoJS.AES.encrypt(json, key).toString();
}

// Decrypt scan data
function decryptScan(encrypted: string, key: string): ScanData {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json);
}

// Add to queue
async function queueScan(scanData: ScanData) {
  const queue = await getQueue();
  const encrypted = encryptScan(scanData, derivedKey);
  queue.push(encrypted);
  await AsyncStorage.setItem('scan_queue', JSON.stringify(queue));
}

// Sync queue
async function syncQueue() {
  const queue = await getQueue();
  
  for (const encrypted of queue) {
    try {
      const scanData = decryptScan(encrypted, derivedKey);
      await uploadScan(scanData);
      // Remove from queue on success
      await removeFromQueue(encrypted);
    } catch (error) {
      console.error('Sync failed:', error);
      // Keep in queue for retry
    }
  }
}
```

### QR Scanning
```typescript
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Verify HMAC locally
    const isValid = verifyQRSignature(data);
    if (!isValid) {
      showError('Invalid QR code');
      return;
    }

    // Process scan
    await processScan(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Camera
      style={StyleSheet.absoluteFillObject}
      onBarCodeScanned={handleBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
      }}
    />
  );
}
```

### Secure Token Storage
```typescript
import * as SecureStore from 'expo-secure-store';

// Store tokens
async function storeTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

// Retrieve tokens
async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

// Clear tokens on logout
async function clearTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}
```

### Location Context
```typescript
import * as Location from 'expo-location';

async function getLocationContext() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null; // Non-blocking
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy
    };
  } catch (error) {
    console.warn('Location unavailable:', error);
    return null; // Non-blocking
  }
}
```

### Supervisor Override
```typescript
function SupervisorOverrideModal({ visible, onSubmit, onCancel }) {
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [attempts, setAttempts] = useState(0);

  async function handleSubmit() {
    if (attempts >= 3) {
      Alert.alert('Too many attempts', 'Please contact administrator');
      return;
    }

    try {
      const response = await fetch('/api/supervisor-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          scanId,
          pin,
          reason
        })
      });

      if (!response.ok) {
        setAttempts(attempts + 1);
        Alert.alert('Invalid PIN', 'Please try again');
        return;
      }

      onSubmit();
    } catch (error) {
      Alert.alert('Error', 'Failed to process override');
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Supervisor Override</Text>
        <TextInput
          placeholder="Enter PIN"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          value={pin}
          onChangeText={setPin}
        />
        <TextInput
          placeholder="Reason for override"
          multiline
          value={reason}
          onChangeText={setReason}
        />
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
}
```

## Development Commands
```bash
# Start Metro bundler
cd apps/scanner-app
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Clear cache
pnpm start --clear

# Build for production
eas build --platform ios
eas build --platform android
```

## Mobile-Specific Considerations
- Always handle offline scenarios
- Use SecureStore for sensitive data
- Request permissions before using features
- Provide haptic feedback for scans
- Show loading states for network operations
- Handle app backgrounding/foregrounding
- Test on both iOS and Android
- Consider battery usage

## References
- Scanner app: `apps/scanner-app/`
- Expo docs: https://docs.expo.dev
