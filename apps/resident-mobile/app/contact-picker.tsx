import { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '../lib/theme';

const { colors, spacing, borderRadius } = theme;

interface ContactItem {
  id: string;
  name: string;
  phone: string;
}

/**
 * Full-screen contact picker with search.
 * On selection, navigates back and passes name/phone as URL params.
 * Shows a "Enter manually" fallback if contacts permission is denied.
 */
export default function ContactPickerScreen() {
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [filtered, setFiltered] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
        ],
        sort: Contacts.SortTypes.LastName,
      });

      const items: ContactItem[] = data
        .filter((c) => c.name || c.firstName || c.lastName)
        .map((c) => ({
          id: c.id ?? Math.random().toString(),
          name:
            c.name ??
            [c.firstName, c.lastName].filter(Boolean).join(' ') ??
            'Unknown',
          phone: c.phoneNumbers?.[0]?.number ?? '',
        }))
        .filter((c) => c.name !== 'Unknown');

      setContacts(items);
      setFiltered(items);
      setLoading(false);
    })();
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);
      if (!text.trim()) {
        setFiltered(contacts);
        return;
      }
      const q = text.toLowerCase();
      setFiltered(
        contacts.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q)
        )
      );
    },
    [contacts]
  );

  const handleSelect = (contact: ContactItem) => {
    // Navigate back with selected contact data as params
    const returnTo = params.returnTo ?? '/qrs/new';
    router.replace({
      pathname: returnTo as never,
      params: {
        prefillName: contact.name,
        prefillPhone: contact.phone,
      },
    });
  };

  const handleManualEntry = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading contacts…</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.deniedTitle}>Contacts access denied</Text>
        <Text style={styles.deniedSubtext}>
          You can enter visitor details manually on the previous screen.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.fallbackButton, pressed && { opacity: 0.8 }]}
          onPress={handleManualEntry}
        >
          <Text style={styles.fallbackButtonText}>Enter manually</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={handleSearch}
        placeholder="Search contacts…"
        placeholderTextColor={colors.mutedForeground}
        clearButtonMode="while-editing"
        autoFocus
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {search ? 'No contacts match your search.' : 'No contacts found.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => handleSelect(item)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.contactName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.phone ? (
                <Text style={styles.contactPhone} numberOfLines={1}>
                  {item.phone}
                </Text>
              ) : (
                <Text style={styles.noPhone}>No phone number</Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: 15,
    color: colors.mutedForeground,
  },
  deniedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  deniedSubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  fallbackButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
  },
  fallbackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  searchInput: {
    margin: spacing.lg,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.muted,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.lg,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  rowContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
  contactPhone: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  noPhone: {
    fontSize: 13,
    color: colors.border,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
