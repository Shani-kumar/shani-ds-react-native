import { forwardRef, useEffect } from 'react';
import {
  Pressable,
  ActivityIndicator,
  type GestureResponderEvent,
  type ViewStyle,
  type StyleProp,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { usePressable } from '../../primitives/usePressable';
import { Icon } from '../Icon/Icon';
import type { ButtonVariant, ButtonSize } from './Button';

export type IconButtonShape = 'square' | 'circle';

export interface IconButtonProps {
  /** Screen reader accessibility label - STRICTLY MANDATORY for icon buttons */
  accessibilityLabel: string;
  /** Lucide icon name (e.g. 'Package', 'ChevronRight', 'Search') */
  name?: string;
  /** Direct Lucide icon component */
  icon?: LucideIcon;
  /** Custom child icon or element */
  children?: React.ReactNode;
  /** Visual variant (default: 'ghost') */
  variant?: ButtonVariant;
  /** Size tier enforcing minimum 44x44pt touch targets (default: 'md') */
  size?: ButtonSize;
  /** Button shape ('square' with radius.md or 'circle' with radius.full) (default: 'square') */
  shape?: IconButtonShape;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Press handler callback */
  onPress?: (event: GestureResponderEvent) => void;
  /** Long press handler callback */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** Test identifier */
  testID?: string;
  /** Accessibility hint describing the action outcome */
  accessibilityHint?: string;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
}

/**
 * IconButton renders an accessible icon-only action button.
 * Enforces a mandatory `accessibilityLabel` in TypeScript to guarantee accessibility.
 * Guarantees minimum 44x44pt touch targets across all sizes.
 */
export const IconButton = forwardRef<View, IconButtonProps>(function IconButton(
  {
    accessibilityLabel,
    name,
    icon,
    children,
    variant = 'ghost',
    size = 'md',
    shape = 'square',
    loading = false,
    disabled = false,
    onPress,
    onLongPress,
    testID,
    accessibilityHint,
    style,
  },
  ref
) {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();

  const { state, pressableProps } = usePressable({
    onPress,
    onLongPress,
    disabled,
    loading,
    accessibilityRole: 'button',
    accessibilityLabel,
    accessibilityHint,
    testID,
  });

  // Reanimated press scale micro-interaction
  const scale = useSharedValue(1);

  useEffect(() => {
    if (state.isPressed && !state.isDisabled) {
      if (isReducedMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(0.97, {
          damping: theme.motion.spring.snappy.damping,
          stiffness: theme.motion.spring.snappy.stiffness,
          mass: theme.motion.spring.snappy.mass,
        });
      }
    } else {
      if (isReducedMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(1, {
          damping: theme.motion.spring.snappy.damping,
          stiffness: theme.motion.spring.snappy.stiffness,
          mass: theme.motion.spring.snappy.mass,
        });
      }
    }
  }, [state.isPressed, state.isDisabled, isReducedMotion, theme, scale]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale]
  );

  // Resolve component tokens
  const buttonTokens = theme.components.button;
  const sizeTokens = buttonTokens.size[size];
  const variantTokens = buttonTokens[variant];
  const dimension = sizeTokens.minHeight;

  // Resolve background color
  let backgroundColor: string = variantTokens.bg;
  if (state.isDisabled) {
    backgroundColor = variantTokens.bgDisabled;
  } else if (state.isPressed) {
    backgroundColor = variantTokens.bgPressed;
  }

  // Resolve text / icon color
  const iconColor: string = state.isDisabled ? variantTokens.textDisabled : variantTokens.text;

  // Resolve border
  let borderColor: string | undefined = undefined;
  let borderWidth = 0;
  if (variant === 'secondary') {
    borderWidth = theme.borderWidth.thin;
    borderColor = state.isDisabled
      ? theme.colors.border.subtle
      : state.isPressed
        ? buttonTokens.secondary.borderPressed
        : buttonTokens.secondary.border;
  }

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: shape === 'circle' ? theme.radius.full : theme.radius.md,
    backgroundColor,
    borderWidth,
    ...(borderColor && { borderColor }),
  };

  return (
    <Pressable ref={ref} {...pressableProps}>
      <Animated.View style={[containerStyle, animatedStyle, style]}>
        {loading ? (
          <ActivityIndicator
            testID={testID ? `${testID}-spinner` : 'icon-button-spinner'}
            size="small"
            color={iconColor}
          />
        ) : children ? (
          children
        ) : (
          <Icon name={name} icon={icon} size={sizeTokens.iconSize} color={iconColor} />
        )}
      </Animated.View>
    </Pressable>
  );
});
