import { forwardRef, useEffect } from 'react';
import { type DimensionValue, type ViewStyle, type StyleProp, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import type { RadiusScale } from '@shani/tokens';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps {
  /** Shape variant (default: 'rectangular') */
  variant?: SkeletonVariant;
  /** Width dimension (default: '100%') */
  width?: DimensionValue;
  /** Height dimension (default: 16 for text, 48 for rectangular/circular) */
  height?: DimensionValue;
  /** Explicit border radius token override */
  borderRadius?: keyof RadiusScale;
  /** Test identifier */
  testID?: string;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

/**
 * Skeleton renders an accessible animated loading placeholder.
 * Uses Reanimated pulse micro-interactions on the native UI thread.
 * Automatically disables motion and renders a static placeholder when reduce-motion is enabled.
 */
export const Skeleton = forwardRef<View, SkeletonProps>(function Skeleton(
  { variant = 'rectangular', width = '100%', height, borderRadius: radiusProp, testID, style },
  ref
) {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();

  // Pulse animation opacity shared value
  const opacity = useSharedValue(isReducedMotion ? 0.6 : 1);

  useEffect(() => {
    if (isReducedMotion) {
      opacity.value = 0.6;
    } else {
      opacity.value = withRepeat(
        withTiming(0.4, { duration: theme.motion.duration.crawl }),
        -1,
        true
      );
    }
  }, [isReducedMotion, theme, opacity]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity]
  );

  // Resolve dimensions and border radius based on variant
  let resolvedHeight: DimensionValue = height ?? 48;
  let resolvedRadius: number = theme.radius.md;

  if (variant === 'text') {
    resolvedHeight = height ?? 16;
    resolvedRadius = radiusProp ? theme.radius[radiusProp] : theme.radius.sm;
  } else if (variant === 'circular') {
    resolvedHeight = height ?? (typeof width === 'number' ? width : 48);
    resolvedRadius = theme.radius.full;
  } else if (radiusProp) {
    resolvedRadius = theme.radius[radiusProp];
  }

  const baseStyle: ViewStyle = {
    width,
    height: resolvedHeight,
    borderRadius: resolvedRadius,
    backgroundColor: theme.colors.bg.subtle,
  };

  return (
    <Animated.View
      ref={ref as unknown as React.Ref<View>}
      testID={testID}
      accessible={false}
      accessibilityRole="none"
      style={[baseStyle, animatedStyle, style]}
    />
  );
});
