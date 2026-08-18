import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, CircleHelp, X } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import type { ScanResult } from '../../lib/scanner';
import { feedbackStyles } from './feedback-styles';

export function DecisionDialog({
  result,
  onPass,
  onDeny,
}: {
  result: ScanResult;
  onPass: () => void;
  onDeny: () => void;
}) {
  return (
    <View style={[feedbackStyles.feedbackLayer, styles.backdrop]}>
      <View style={styles.iconWrap}>
        <CircleHelp
          size={40}
          strokeWidth={1.5}
          color={nativeTokens.colors.primary}
        />
      </View>

      <Text style={feedbackStyles.feedbackTitle}>Approve Entry?</Text>

      {!!result.message && (
        <Text
          style={[
            feedbackStyles.feedbackSub,
            { color: nativeTokens.colors.textPrimary },
          ]}
        >
          {result.message}
        </Text>
      )}

      <Text style={styles.hint}>
        QR code verified — operator decision required
      </Text>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.btn, styles.passBtn]}
          onPress={onPass}
          android_ripple={{ color: nativeTokens.colors.primarySubtle }}
          accessibilityRole="button"
          accessibilityLabel="Pass — approve entry"
        >
          <Check
            size={22}
            strokeWidth={1.5}
            color={nativeTokens.colors.success}
          />
          <Text style={styles.btnLabel}>Pass</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.denyBtn]}
          onPress={onDeny}
          android_ripple={{ color: nativeTokens.colors.surfaceGlass }}
          accessibilityRole="button"
          accessibilityLabel="Deny — reject entry"
        >
          <X size={22} strokeWidth={1.5} color={nativeTokens.colors.danger} />
          <Text style={styles.btnLabel}>Deny</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: nativeTokens.colors.backdropGlass,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderWidth: 3,
    borderColor: nativeTokens.colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...nativeTokens.shadows.satinRaised,
  },
  icon: {
    fontSize: 40,
    color: nativeTokens.colors.primary,
    fontFamily: 'Cairo_700Bold',
    lineHeight: 48,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 6,
    borderWidth: 2,
  },
  passBtn: {
    backgroundColor: nativeTokens.colors.successSubtle,
    borderColor: nativeTokens.colors.success,
  },
  denyBtn: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderColor: nativeTokens.colors.danger,
  },
  passIcon: {
    fontSize: 32,
    color: nativeTokens.colors.success,
    lineHeight: 36,
  },
  denyIcon: {
    fontSize: 32,
    color: nativeTokens.colors.danger,
    lineHeight: 36,
  },
  btnLabel: {
    fontSize: 15,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
