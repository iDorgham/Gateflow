import { Pressable, Text, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import { theme } from '../lib/theme';

const { colors, spacing, borderRadius } = theme;

interface ContactPickerButtonProps {
  onContactSelected: (name: string, phone: string) => void;
  onFallback: () => void;
}

/**
 * Button that opens the native contact picker.
 * On permission denial, calls onFallback so the form stays in manual-entry mode.
 */
export function ContactPickerButton({
  onContactSelected,
  onFallback,
}: ContactPickerButtonProps) {
  const handlePress = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      onFallback();
      return;
    }

    const result = await Contacts.presentContactPickerAsync();
    if (!result) return; // user dismissed the picker

    const contact = result as Contacts.Contact;
    const name =
      contact.name ??
      [contact.firstName, contact.lastName].filter(Boolean).join(' ') ??
      '';
    const phone =
      contact.phoneNumbers?.[0]?.number ?? '';

    if (name) {
      onContactSelected(name, phone);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handlePress}
      accessibilityLabel="Pick from contacts"
    >
      <Text style={styles.icon}>👤</Text>
      <Text style={styles.label}>Pick from contacts</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
});
