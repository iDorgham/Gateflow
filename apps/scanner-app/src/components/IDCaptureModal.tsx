/**
 * IDCaptureModal — prompts guard to capture ID photo when required identity level is 1+.
 * Uses expo-image-picker for camera capture. Uploads to /api/artifacts and links to scan.
 */

import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getValidAccessToken } from '../lib/auth-client';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

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
              ? 'This gate requires ID verification. Capture a photo of the visitor\'s ID.'
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
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={s.captureBtnText}>Take Photo</Text>
            )}
          </Pressable>

          {!required && onSkip && (
            <Pressable style={s.skipBtn} onPress={onSkip} disabled={isCapturing}>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  captureBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  captureBtnDisabled: {
    opacity: 0.6,
  },
  captureBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#64748b',
    fontSize: 15,
  },
});
