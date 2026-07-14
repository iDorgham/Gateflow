import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getValidAccessToken } from '../lib/auth-client';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface IDCaptureModalProps {
  visible: boolean;
  scanLogId: string;
  onSuccess: () => void;
  onSkip?: () => void;
  /** When true, capture is required and skip is hidden */
  required?: boolean;
}

export function IDCaptureModal({
  visible,
  scanLogId,
  onSuccess,
  onSkip,
  required = true,
}: IDCaptureModalProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCapture() {
    setError(null);
    setIsCapturing(true);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Camera permission required to capture ID.');
        setIsCapturing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        setIsCapturing(false);
        return;
      }

      const asset = result.assets[0];
      const base64 = asset.base64;
      if (!base64) {
        setError('Failed to get image data.');
        setIsCapturing(false);
        return;
      }

      const token = await getValidAccessToken();
      if (!token) {
        setError('Not signed in. Please log in and try again.');
        setIsCapturing(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/artifacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scanLogId,
          type: 'id_front',
          contentBase64: base64,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? `Upload failed (${res.status})`);
        setIsCapturing(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError((err as Error).message ?? 'Capture failed');
    } finally {
      setIsCapturing(false);
    }
  }

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Text style={s.title}>Capture ID</Text>
          <Text style={s.subtitle}>
            {required
              ? "This gate requires ID verification. Capture a photo of the visitor's ID."
              : 'Optional: Capture ID for records.'}
          </Text>

          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[s.captureBtn, isCapturing && s.captureBtnDisabled]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator
                size="small"
                color={nativeTokens.colors.textInverse}
              />
            ) : (
              <Text style={s.captureBtnText}>Take Photo</Text>
            )}
          </Pressable>

          {!required && onSkip && (
            <Pressable
              style={s.skipBtn}
              onPress={onSkip}
              disabled={isCapturing}
            >
              <Text style={s.skipBtnText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: nativeTokens.colors.backdropGlass,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: nativeTokens.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 22,
    color: nativeTokens.colors.textHeading,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 15,
    color: nativeTokens.colors.textSubtle,
    marginBottom: 32,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.danger,
    fontSize: 14,
  },
  captureBtn: {
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: nativeTokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  captureBtnDisabled: {
    opacity: 0.5,
  },
  captureBtnText: {
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textInverse,
    fontSize: 17,
  },
  skipBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderRadius: 16,
  },
  skipBtnText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    fontSize: 15,
  },
});
