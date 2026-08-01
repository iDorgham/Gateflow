import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

interface Props {
  children: React.ReactNode;
  /** Shown in the fallback, e.g. "shift status" or "stats". */
  label: string;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates a single duty-home widget so a render error there doesn't take
 * down the rest of the screen (or the app). Class component because React
 * error boundaries require `getDerivedStateFromError`/`componentDidCatch` —
 * no hook equivalent exists.
 */
export class DutyErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (__DEV__) {
      console.error(`[DutyErrorBoundary] ${this.props.label}:`, error);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Could not load {this.props.label}</Text>
          <Pressable
            style={styles.retry}
            onPress={this.handleRetry}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    backgroundColor: nativeTokens.colors.dangerSubtle,
    padding: nativeTokens.spacing['space-200'],
    gap: nativeTokens.spacing['space-100'],
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 13,
    color: nativeTokens.colors.danger,
    textAlign: 'center',
  },
  retry: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  retryText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 12,
    color: nativeTokens.colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
