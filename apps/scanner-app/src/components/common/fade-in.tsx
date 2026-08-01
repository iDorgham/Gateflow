import React, { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

export interface FadeInProps {
  children: React.ReactNode;
  /** Stagger successive sections instead of animating everything at once. */
  delayMs?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Lightweight mount-in animation (fade + rise) built on React Native's
 * built-in `Animated` API. `react-native-reanimated` is not a `scanner-app`
 * dependency (only `resident-mobile` has it) — adding a new native module
 * for entrance polish was judged not worth the babel-config/build risk for
 * this phase; `Animated` with `useNativeDriver` covers this case just as
 * smoothly since only opacity/transform are animated.
 */
export function FadeIn({ children, delayMs = 0, style }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay: delayMs,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay: delayMs,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
