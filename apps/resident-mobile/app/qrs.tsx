import { Text, View, StyleSheet } from 'react-native';

const colors = {
  background: '#f4f4f5',
  foreground: '#18181b',
  muted: '#71717a',
};

export default function QRsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My visitor QRs</Text>
      <Text style={styles.subtitle}>
        Your visitor passes will appear here. This screen will list and let you share QRs for your unit.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
});
