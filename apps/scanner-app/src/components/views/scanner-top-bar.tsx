import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ArrowUpDown, MapPin, Play, Square } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { getScannerTranslations, type SupportedLocale } from '../../lib/i18n';
import type { SelectedGate } from '../GateSelector';

const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 52;

export interface ScannerTopBarProps {
  selectedGate: SelectedGate | null;
  onOpenGateSelector: () => void;
  shiftLoading: boolean;
  shiftBusy: boolean;
  isShiftActive: boolean;
  onToggleShift: () => void;
  onOpenQueue: () => void;
  shiftError?: string | null;
  onLogout: () => void;
  isLoggingOut: boolean;
  locale?: SupportedLocale;
}

export function ScannerTopBar({
  selectedGate,
  onOpenGateSelector,
  shiftLoading,
  shiftBusy,
  isShiftActive,
  onToggleShift,
  onOpenQueue,
  shiftError,
  onLogout,
  isLoggingOut,
  locale = 'en',
}: ScannerTopBarProps) {
  const t = getScannerTranslations(locale).topBar;

  return (
    <View style={styles.topContainer} pointerEvents="box-none">
      {/* Top-left controls: Gate, Shift, Queue */}
      <View style={styles.topBarLeft} pointerEvents="box-none">
        {/* Gate selector button */}
        <Pressable
          style={styles.topBarBtn}
          onPress={onOpenGateSelector}
          accessibilityRole="button"
          accessibilityLabel={
            selectedGate ? `${selectedGate.name}` : t.selectGate
          }
        >
          <View style={styles.topBarBtnInner}>
            <MapPin
              size={14}
              strokeWidth={1.5}
              color={nativeTokens.colors.textHeading}
            />
            <Text style={styles.topBarBtnText} numberOfLines={1}>
              {selectedGate ? selectedGate.name : t.selectGate}
            </Text>
          </View>
        </Pressable>

        {/* Shift start / end */}
        <Pressable
          style={styles.topBarBtn}
          disabled={shiftLoading || shiftBusy}
          onPress={onToggleShift}
          accessibilityRole="button"
          accessibilityLabel={isShiftActive ? t.endShift : t.startShift}
          accessibilityState={{ disabled: shiftLoading || shiftBusy }}
        >
          <View style={styles.topBarBtnInner}>
            {shiftLoading || shiftBusy ? (
              <ActivityIndicator
                size="small"
                color={nativeTokens.colors.textHeading}
              />
            ) : isShiftActive ? (
              <Square
                size={14}
                strokeWidth={1.5}
                color={nativeTokens.colors.textHeading}
              />
            ) : (
              <Play
                size={14}
                strokeWidth={1.5}
                color={nativeTokens.colors.textHeading}
              />
            )}
            <Text style={styles.topBarBtnText} numberOfLines={1}>
              {shiftLoading || shiftBusy
                ? t.pleaseWait
                : isShiftActive
                  ? t.endShift
                  : t.startShift}
            </Text>
          </View>
        </Pressable>

        {/* Queue status button */}
        <Pressable
          style={styles.topBarBtn}
          onPress={onOpenQueue}
          accessibilityRole="button"
          accessibilityLabel={t.queue}
        >
          <View style={styles.topBarBtnInner}>
            <ArrowUpDown
              size={14}
              strokeWidth={1.5}
              color={nativeTokens.colors.textHeading}
            />
            <Text style={styles.topBarBtnText}>{t.queue}</Text>
          </View>
        </Pressable>

        {shiftError ? (
          <View style={styles.shiftErrorBanner} pointerEvents="none">
            <Text style={styles.shiftErrorText}>{shiftError}</Text>
          </View>
        ) : null}
      </View>

      {/* Top-right: Sign-out */}
      <View style={styles.topBarRight} pointerEvents="box-none">
        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
          disabled={isLoggingOut || shiftBusy}
          accessibilityRole="button"
          accessibilityLabel={t.signOut}
          accessibilityState={{
            disabled: isLoggingOut || shiftBusy,
            busy: isLoggingOut,
          }}
        >
          {isLoggingOut ? (
            <ActivityIndicator
              size="small"
              color={nativeTokens.colors.textSubtle}
            />
          ) : (
            <Text style={styles.logoutText}>{t.signOut}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: TOP_OFFSET,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 25,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    maxWidth: '78%',
  },
  topBarRight: {
    alignItems: 'flex-end',
  },
  topBarBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  topBarBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBarBtnText: {
    color: nativeTokens.colors.textHeading,
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 110,
  },
  shiftErrorBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  shiftErrorText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  logoutText: {
    color: nativeTokens.colors.textSubtle,
    fontSize: 12,
    fontWeight: '600',
  },
});
