import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../lib/auth-client';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

// ─── Constants ────────────────────────────────────────────────────────────────

const GATE_LIST_KEY = 'cached_gate_list';
const SELECTED_GATE_KEY = 'selected_gate';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  requiredIdentityLevel?: number | null;
}

export interface SelectedGate {
  id: string;
  name: string;
  /** 0/1/2; when null, use org default (passed separately) */
  requiredIdentityLevel?: number | null;
}

export interface GateSelectorProps {
  visible: boolean;
  selectedGate: SelectedGate | null;
  onSelect: (gate: SelectedGate | null) => void;
  onClose: () => void;
}

// ─── Storage helpers (used externally) ───────────────────────────────────────

export async function loadSelectedGate(): Promise<SelectedGate | null> {
  try {
    const raw = await AsyncStorage.getItem(SELECTED_GATE_KEY);
    return raw ? (JSON.parse(raw) as SelectedGate) : null;
  } catch {
    return null;
  }
}

export async function saveSelectedGate(
  gate: SelectedGate | null
): Promise<void> {
  try {
    if (gate) {
      await AsyncStorage.setItem(SELECTED_GATE_KEY, JSON.stringify(gate));
    } else {
      await AsyncStorage.removeItem(SELECTED_GATE_KEY);
    }
  } catch {
    /* non-fatal */
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GateSelector({
  visible,
  selectedGate,
  onSelect,
  onClose,
}: GateSelectorProps) {
  const [gates, setGates] = useState<Gate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadGates = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const token = await getValidAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Use assigned-gates endpoint: when org uses gate assignments, only assigned gates are returned.
      const res = await fetch(`${API_BASE_URL}/gates/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as {
        success: boolean;
        data: Gate[];
        assignedOnly?: boolean;
        orgDefaultIdentityLevel?: number;
      };

      if (!json.success) throw new Error('API error');

      const activeGates = json.data
        .filter((g) => g.isActive)
        .map((g) => ({
          ...g,
          requiredIdentityLevel:
            g.requiredIdentityLevel ?? json.orgDefaultIdentityLevel ?? 0,
        }));
      setGates(activeGates);
      if (json.assignedOnly && activeGates.length === 0) {
        setLoadError('No gates assigned. Contact your administrator.');
      }

      // Update cache
      await AsyncStorage.setItem(GATE_LIST_KEY, JSON.stringify(activeGates));
    } catch (err) {
      // Fall back to cached list
      try {
        const cached = await AsyncStorage.getItem(GATE_LIST_KEY);
        if (cached) {
          setGates(JSON.parse(cached) as Gate[]);
          setLoadError('Offline — showing cached gates.');
        } else {
          setLoadError(
            `Could not load gates: ${(err as Error).message}. Check your connection.`
          );
        }
      } catch {
        setLoadError('Failed to load gates. Please close and retry.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadGates();
    }
  }, [visible, loadGates]);

  const handleSelect = async (gate: Gate | null) => {
    const next = gate
      ? {
          id: gate.id,
          name: gate.name,
          requiredIdentityLevel: gate.requiredIdentityLevel ?? null,
        }
      : null;
    await saveSelectedGate(next);
    onSelect(next);
    onClose();
  };

  const renderGate = ({ item }: { item: Gate }) => {
    const isSelected = item.id === selectedGate?.id;
    return (
      <Pressable
        style={({ pressed }) => [
          s.gateRow,
          isSelected && s.gateRowSelected,
          pressed && s.gateRowPressed,
        ]}
        onPress={() => handleSelect(item)}
      >
        <View style={s.gateInfo}>
          <Text style={[s.gateName, isSelected && s.gateNameSelected]}>
            {item.name}
          </Text>
          {!!item.location && (
            <Text style={s.gateLocation}>{item.location}</Text>
          )}
        </View>
        {isSelected && <Text style={s.checkmark}>✓</Text>}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Select Gate</Text>
            <Pressable onPress={onClose} style={s.doneBtn}>
              <Text style={s.doneBtnText}>Cancel</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={s.loadingWrap}>
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
              <Text style={s.loadingText}>Loading gates…</Text>
            </View>
          ) : (
            <>
              {!!loadError && (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>{loadError}</Text>
                </View>
              )}

              <FlatList
                data={gates}
                keyExtractor={(g) => g.id}
                renderItem={renderGate}
                ListHeaderComponent={
                  /* "No gate" option */
                  <Pressable
                    style={({ pressed }) => [
                      s.gateRow,
                      !selectedGate && s.gateRowSelected,
                      pressed && s.gateRowPressed,
                    ]}
                    onPress={() => handleSelect(null)}
                  >
                    <Text
                      style={[s.gateName, !selectedGate && s.gateNameSelected]}
                    >
                      No gate selected
                    </Text>
                    {!selectedGate && <Text style={s.checkmark}>✓</Text>}
                  </Pressable>
                }
                ListEmptyComponent={
                  <Text style={s.emptyText}>
                    {loadError &&
                    (loadError.includes('No gates assigned') ||
                      loadError.includes('no gates assigned'))
                      ? loadError
                      : 'No active gates found. Check that your account has gates configured.'}
                  </Text>
                }
                ItemSeparatorComponent={() => <View style={s.separator} />}
                style={s.list}
                contentContainerStyle={s.listContent}
              />

              <Pressable style={s.refreshBtn} onPress={loadGates}>
                <Text style={s.refreshBtnText}>Refresh list</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    maxHeight: '90%',
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 20,
    color: nativeTokens.colors.textHeading,
  },
  doneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderRadius: 8,
  },
  doneBtnText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    fontSize: 15,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
    gap: 16,
  },
  loadingText: {
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtle,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: nativeTokens.colors.warningSubtle,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.warning,
    fontSize: 13,
  },
  list: {
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  gateRowSelected: {
    backgroundColor: nativeTokens.colors.infoSubtle,
  },
  gateRowPressed: {
    backgroundColor: nativeTokens.colors.surfaceRaised,
  },
  gateInfo: {
    flex: 1,
    gap: 2,
  },
  gateName: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 17,
    color: nativeTokens.colors.textPrimary,
  },
  gateNameSelected: {
    color: nativeTokens.colors.primary,
    fontFamily: 'Cairo_700Bold',
  },
  gateLocation: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtlest,
  },
  checkmark: {
    fontSize: 20,
    color: nativeTokens.colors.primary,
    fontWeight: '700',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: nativeTokens.colors.border,
    marginHorizontal: 24,
  },
  emptyText: {
    padding: 32,
    textAlign: 'center',
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtle,
    fontSize: 14,
    lineHeight: 20,
  },
  refreshBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  refreshBtnText: {
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.primary,
    fontSize: 16,
  },
});
