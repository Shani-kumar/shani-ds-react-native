import { forwardRef, useEffect } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type GestureResponderEvent,
  type ViewStyle,
  type TextStyle,
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

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Visual variant of the button (default: 'primary') */
  variant?: ButtonVariant;
  /** Size tier enforcing minimum 44pt touch targets (default: 'md') */
  size?: ButtonSize;
  /** Whether the button is currently in a loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional icon name (e.g. 'ChevronRight', 'Sun'), LucideIcon component, or React element rendered before label */
  leftIcon?: React.ReactNode | LucideIcon | string;
  /** Optional icon name (e.g. 'ChevronRight', 'Sun'), LucideIcon component, or React element rendered after label */
  rightIcon?: React.ReactNode | LucideIcon | string;
  /** Whether the button expands to fill parent container width */
  fullWidth?: boolean;
  /** Press handler callback */
  onPress?: (event: GestureResponderEvent) => void;
  /** Long press handler callback */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing the action */
  accessibilityHint?: string;
  /** Button label content */
  children?: React.ReactNode;
  /** Custom style overrides for button container */
  style?: StyleProp<ViewStyle>;
  /** Custom style overrides for text label */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button is the primary call-to-action primitive in Shani DS.
 * Built on `usePressable` headless hook and Reanimated micro-interactions.
 * Guarantees minimum 44x44pt touch targets and Dynamic Type accessibility.
 */
export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityHint,
    children,
    style,
    textStyle,
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

  // Resolve background color
  let backgroundColor: string = variantTokens.bg;
  if (state.isDisabled) {
    backgroundColor = variantTokens.bgDisabled;
  } else if (state.isPressed) {
    backgroundColor = variantTokens.bgPressed;
  }

  // Resolve text color
  const textColor: string = state.isDisabled ? variantTokens.textDisabled : variantTokens.text;

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: sizeTokens.minHeight,
    minWidth: sizeTokens.minHeight,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    paddingVertical: sizeTokens.paddingVertical,
    gap: sizeTokens.gap,
    borderRadius: theme.radius.md,
    backgroundColor,
    borderWidth,
    ...(borderColor && { borderColor }),
    ...(fullWidth && { width: '100%', alignSelf: 'stretch' }),
  };

  const labelStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: sizeTokens.fontSize,
    fontWeight: theme.typography.fontWeight.semibold,
    color: textColor,
    textAlign: 'center',
  };

  const renderIcon = (iconNode: React.ReactNode | LucideIcon | string | undefined) => {
    if (!iconNode) return null;
    if (typeof iconNode === 'string') {
      return <Icon name={iconNode} size={sizeTokens.iconSize} color={textColor} />;
    }
    if (typeof iconNode === 'function') {
      const IconComponent = iconNode as LucideIcon;
      return <IconComponent size={sizeTokens.iconSize} color={textColor} />;
    }
    return iconNode as React.ReactNode;
  };

  return (
    <Pressable ref={ref} {...pressableProps} style={fullWidth ? { width: '100%' } : undefined}>
      <Animated.View style={[containerStyle, animatedStyle, style]}>
        {loading ? (
          <ActivityIndicator
            testID={testID ? `${testID}-spinner` : 'button-spinner'}
            size="small"
            color={textColor}
          />
        ) : (
          <>
            {renderIcon(leftIcon)}
            {typeof children === 'string' || typeof children === 'number' || Array.isArray(children) ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                maxFontSizeMultiplier={2.0}
                allowFontScaling={true}
                style={[labelStyle, textStyle]}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {renderIcon(rightIcon)}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
});
