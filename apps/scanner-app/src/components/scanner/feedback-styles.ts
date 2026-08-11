import { StyleSheet } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

/** Shared full-screen feedback layer styles (processing / decision / result overlays). */
export const feedbackStyles = StyleSheet.create({
  feedbackLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  feedbackIcon: {
    fontSize: 80,
    color: nativeTokens.colors.textHeading,
    lineHeight: 88,
  },
  feedbackTitle: {
    fontSize: 28,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: nativeTokens.typography.headerTracking,
  },
  feedbackSub: {
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});
