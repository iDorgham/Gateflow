import { Text, View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// GateFlow design tokens (zinc palette)
const colors = {
  background: '#f4f4f5',       // zinc-100
  surface: '#ffffff',
  foreground: '#18181b',       // zinc-900
  muted: '#71717a',           // zinc-500
  primary: '#18181b',
  primaryFg: '#fafafa',
  border: '#e4e4e7',          // zinc-200
  accent: '#3b82f6',          // info blue for primary CTA
  accentFg: '#ffffff',
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>GateFlow Resident</Text>
        <Text style={styles.subtitle}>
          Quickly open and share visitor passes for your unit.
        </Text>

        <Pressable
          onPress={() => router.push('/qrs')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>View my visitor QRs</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/login')}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
        >
          <Text style={styles.secondaryButtonText}>Sign in with a different account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 28,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accentFg,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: colors.background,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
});


