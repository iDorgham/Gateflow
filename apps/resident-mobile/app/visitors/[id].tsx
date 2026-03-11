import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Share,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { residentFetch } from '../../lib/api';
import { getCachedVisitor, setCachedVisitor, type CachedVisitor } from '../../lib/qr-cache';

const colors = {
  background: '#f4f4f5',
  surface: '#ffffff',
  foreground: '#18181b',
  muted: '#71717a',
  border: '#e4e4e7',
  accent: '#3b82f6',
  accentFg: '#ffffff',
};

export default function VisitorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [visitor, setVisitor] = useState<CachedVisitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid visitor');
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await residentFetch(`/resident/visitors/${id}`);
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const data = (await res.json()) as { success?: boolean; data?: CachedVisitor };
        if (!res.ok || !data.success) {
          const cached = await getCachedVisitor(id);
          if (cached && !cancelled) {
            setVisitor(cached);
            setFromCache(true);
          } else if (!cancelled) {
            setError('Visitor pass not found');
          }
          return;
        }
        const v = data.data!;
        if (!cancelled) {
          setVisitor(v);
          setFromCache(false);
          await setCachedVisitor(v);
        }
      } catch (e) {
        const err = e as Error & { status?: number };
        if (err.status === 401) {
          router.replace('/login');
          return;
        }
        const cached = await getCachedVisitor(id);
        if (cached && !cancelled) {
          setVisitor(cached);
          setFromCache(true);
        } else if (!cancelled) {
          setError(err?.message ?? 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = async () => {
    if (!visitor?.qrCode?.code) return;
    const message = visitor.visitorName
      ? `Visitor pass for ${visitor.visitorName}. Use this code at the gate.`
      : 'Visitor pass – use this code at the gate.';
    try {
      await Share.share({
        message: `${message}\n\n${visitor.qrCode.code}`,
        title: 'Visitor pass',
      });
    } catch {
      Alert.alert('Share', 'Sharing is not available on this device.');
    }
  };

  if (loading && !visitor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error != null && !visitor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!visitor) return null;

  const qrCode = visitor.qrCode?.code ?? '';
  const displayCode = qrCode.length > 80 ? `${qrCode.slice(0, 80)}…` : qrCode;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {fromCache ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Showing cached pass (offline)</Text>
        </View>
      ) : null}
      <View style={styles.card}>
        <Text style={styles.title}>
          {visitor.visitorName ?? (visitor.isOpenQR ? 'Open QR' : 'Visitor pass')}
        </Text>
        {visitor.unit?.name ? (
          <Text style={styles.subtext}>{visitor.unit.name}</Text>
        ) : null}
        <View style={styles.codeBlock}>
          <Text style={styles.codeLabel}>Pass code</Text>
          <Text style={styles.codeText} selectable>
            {displayCode}
          </Text>
        </View>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]}
        >
          <Text style={styles.shareButtonText}>Share pass</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 14,
    color: '#92400e',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 20,
  },
  codeBlock: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  codeText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.foreground,
  },
  shareButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonPressed: {
    opacity: 0.9,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accentFg,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.accent,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentFg,
  },
});
