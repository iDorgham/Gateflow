import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Clock3, CloudOff, Flag, X } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import type { ScanResult } from '../../lib/scanner';
import { feedbackStyles } from './feedback-styles';

export function ResultOverlay({
  result,
  onScanAgain,
  onRequestOverride,
  onReportIssue,
}: {
  result: ScanResult;
  onScanAgain: () => void;
  /** Defined only for non-offline rejections */
  onRequestOverride?: () => void;
  onReportIssue?: () => void;
}) {
  const ok = result.status === 'accepted';
  const pending = result.status === 'pending';
  return (
    <View
      style={[
        feedbackStyles.feedbackLayer,
        {
          backgroundColor: ok
            ? nativeTokens.colors.success
            : pending
              ? nativeTokens.colors.warningSubtle
              : nativeTokens.colors.danger,
        },
      ]}
    >
      {ok ? (
        <Check
          size={72}
          strokeWidth={1.5}
          color={nativeTokens.colors.textHeading}
        />
      ) : pending ? (
        <Clock3
          size={72}
          strokeWidth={1.5}
          color={nativeTokens.colors.warning}
        />
      ) : (
        <X
          size={72}
          strokeWidth={1.5}
          color={nativeTokens.colors.textHeading}
        />
      )}
      <Text style={feedbackStyles.feedbackTitle}>
        {ok
          ? 'Access Granted'
          : pending
            ? 'Validation Pending'
            : 'Access Denied'}
      </Text>
      {!!result.message && (
        <Text style={feedbackStyles.feedbackSub}>{result.message}</Text>
      )}
      {result.offline && (
        <View style={styles.offlineRow}>
          <CloudOff
            size={16}
            strokeWidth={1.5}
            color={nativeTokens.colors.warning}
          />
          <Text style={styles.offlineBadge}>Offline — queued for sync</Text>
        </View>
      )}

      {/* Override button — only for non-offline rejections */}
      {!!onRequestOverride && (
        <Pressable
          style={styles.overrideButton}
          onPress={onRequestOverride}
          accessibilityRole="button"
          accessibilityLabel="Request supervisor override"
        >
          <Text style={styles.overrideButtonText}>Request Override</Text>
        </Pressable>
      )}

      {/* Report Issue button */}
      <Pressable
        style={styles.maintenanceButton}
        onPress={onReportIssue}
        accessibilityRole="button"
        accessibilityLabel="Report an issue with this gate"
      >
        <View style={styles.maintenanceButtonInner}>
          <Flag
            size={16}
            strokeWidth={1.5}
            color={nativeTokens.colors.warning}
          />
          <Text style={styles.maintenanceButtonText}>Report Issue</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.scanAgainButton}
        onPress={onScanAgain}
        accessibilityRole="button"
        accessibilityLabel="Scan again"
      >
        <Text style={styles.scanAgainText}>Scan Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  offlineBadge: {
    fontSize: 13,
    color: nativeTokens.colors.warning,
    fontFamily: 'Cairo_600SemiBold',
    textTransform: 'uppercase',
  },
  overrideButton: {
    marginTop: 12,
    backgroundColor: nativeTokens.colors.warningSubtle,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: nativeTokens.colors.warning,
  },
  overrideButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scanAgainButton: {
    marginTop: 12,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: nativeTokens.colors.borderBold,
  },
  scanAgainText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  maintenanceButton: {
    marginTop: 8,
    backgroundColor: nativeTokens.colors.warningSubtle,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: nativeTokens.colors.warning,
  },
  maintenanceButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  maintenanceButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.warning,
    textTransform: 'uppercase',
  },
});
