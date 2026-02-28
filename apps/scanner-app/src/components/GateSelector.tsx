/**
 * GateSelector
 *
 * A bottom-sheet modal that lets the operator pick which gate they are
 * scanning at. The selected gate (id + name) is:
 *   • Persisted in AsyncStorage so it survives app restarts.
 *   • Fetched fresh from the API on every open; falls back to cache when
 *     offline.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../lib/auth-client';

// ─── Constants ────────────────────────────────────────────────────────────────

const GATE_LIST_KEY = 'cached_gate_list';
const SELECTED_GATE_KEY = 'selected_gate';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface SelectedGate {
  id: string;
  name: string;
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

export async function saveSelectedGate(gate: SelectedGate | null): Promise<void> {
  try {
    if (gate) {
      await AsyncStorage.setItem(SELECTED_GATE_KEY, JSON.stringify(gate));
    } else {
      await AsyncStorage.removeItem(SELECTED_GATE_KEY);
    }
  } catch { /* non-fatal */ }
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
      };

      if (!json.success) throw new Error('API error');

      const activeGates = json.data.filter((g) => g.isActive);
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
    const next = gate ? { id: gate.id, name: gate.name } : null;
    await saveSelectedGate(next);
    onSelect(next);
    onClose();
  };

  const renderGate = ({ item }: { item: Gate }) => {
    const isSelected = item.id === selectedGate?.id;
    return (
      <Pressable
        style={({ pressed }) => [s.gateRow, isSelected && s.gateRowSelected, pressed && s.gateRowPressed]}
        onPress={() => handleSelect(item)}
      >
        <View style={s.gateInfo}>
          <Text style={[s.gateName, isSelected && s.gateNameSelected]}>{item.name}</Text>
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
              <ActivityIndicator size="large" color="#3b82f6" />
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
                    <Text style={[s.gateName, !selectedGate && s.gateNameSelected]}>
                      No gate selected
                    </Text>
                    {!selectedGate && <Text style={s.checkmark}>✓</Text>}
                  </Pressable>
                }
                ListEmptyComponent={
                  <Text style={s.emptyText}>
                    {loadError && (loadError.includes('No gates assigned') || loadError.includes('no gates assigned'))
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    borderTopWidth: 1,
    borderColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  doneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderBottomWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fde68a',
    fontSize: 13,
  },
  list: {
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  gateRowSelected: {
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  gateRowPressed: {
    backgroundColor: '#1e293b',
  },
  gateInfo: {
    flex: 1,
    gap: 2,
  },
  gateName: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  gateNameSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  gateLocation: {
    fontSize: 13,
    color: '#64748b',
  },
  checkmark: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '700',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
  },
  emptyText: {
    padding: 24,
    textAlign: 'center',
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  refreshBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#1e293b',
  },
  refreshBtnText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
});
