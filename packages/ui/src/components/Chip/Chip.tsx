import { forwardRef, useEffect } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type GestureResponderEvent,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type AccessibilityRole,
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

export type ChipSize = 'sm' | 'md';

export interface ChipProps {
  /** Text label displayed inside the chip */
  label: string;
  /** Whether the chip is currently selected */
  selected?: boolean;
  /** Press handler callback */
  onPress?: (event?: GestureResponderEvent) => void;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Size tier enforcing minimum 44pt touch targets (default: 'md') */
  size?: ChipSize;
  /** Optional leading icon name (e.g. 'Tag', 'Check'), Lucide component, or React element */
  leftIcon?: React.ReactNode | LucideIcon | string;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing the interaction */
  accessibilityHint?: string;
  /** Accessibility role override (default: 'button', or 'radio' / 'checkbox' in groups) */
  accessibilityRole?: AccessibilityRole;
  /** Custom container style overrides */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style overrides */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Chip is an interactive pill-shaped selection control built on `usePressable`.
 * Guarantees a minimum 44pt touch target, visible focus indicator, and never stretches vertically in a row.
 */
export const Chip = forwardRef<View, ChipProps>(function Chip(
  {
    label,
    selected = false,
    onPress,
    disabled = false,
    size = 'md',
    leftIcon,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    style,
    textStyle,
  },
  ref
) {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();

  const { state, pressableProps } = usePressable({
    onPress,
    disabled,
    accessibilityRole,
    accessibilityLabel: accessibilityLabel ?? label,
    accessibilityHint,
    testID,
  });

  const scale = useSharedValue(1);

  useEffect(() => {
    if (state.isPressed && !state.isDisabled) {
      if (isReducedMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(0.96, {
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

  const chipTokens = theme.components.chip;
  const sizeTokens = chipTokens.size[size];

  // Resolve color state
  let backgroundColor: string;
  let borderColor: string;
  let textColor: string;

  if (state.isDisabled) {
    backgroundColor = chipTokens.disabled.bg;
    borderColor = chipTokens.disabled.border;
    textColor = chipTokens.disabled.text;
  } else if (selected) {
    backgroundColor = chipTokens.selected.bg;
    borderColor = chipTokens.selected.border;
    textColor = chipTokens.selected.text;
  } else {
    backgroundColor = chipTokens.unselected.bg;
    borderColor = chipTokens.unselected.border;
    textColor = chipTokens.unselected.text;
  }

  const isFocused = state.isFocused && !state.isDisabled;
  if (isFocused) {
    borderColor = theme.colors.border.focus;
  }

  const flatStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const {
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    width,
    minWidth,
    maxWidth,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    ...visualStyle
  } = flatStyle;

  const resolvedAlignSelf: ViewStyle['alignSelf'] = alignSelf ?? 'center';

  const pressableStyle: ViewStyle = {
    height: sizeTokens.minHeight,
    maxHeight: sizeTokens.minHeight,
    minHeight: sizeTokens.minHeight,
    minWidth: minWidth ?? sizeTokens.minHeight,
    alignSelf: resolvedAlignSelf,
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexBasis !== undefined && { flexBasis }),
    ...(flex !== undefined && { flex }),
    ...(width !== undefined && { width }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(margin !== undefined && { margin }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(marginRight !== undefined && { marginRight }),
    ...(marginHorizontal !== undefined && { marginHorizontal }),
    ...(marginVertical !== undefined && { marginVertical }),
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeTokens.minHeight,
    maxHeight: sizeTokens.minHeight,
    minHeight: sizeTokens.minHeight,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    paddingVertical: sizeTokens.paddingVertical,
    columnGap: sizeTokens.gap,
    borderRadius: theme.radius.full,
    backgroundColor,
    borderWidth: isFocused ? theme.borderWidth.medium : theme.borderWidth.thin,
    borderColor,
    alignSelf: resolvedAlignSelf,
  };

  const labelStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: sizeTokens.fontSize,
    fontWeight: selected
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.medium,
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
    <Pressable
      ref={ref}
      {...pressableProps}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        ...pressableProps.accessibilityState,
        selected,
        disabled: state.isDisabled,
      }}
      style={pressableStyle}
    >
      <Animated.View style={[containerStyle, visualStyle, animatedStyle]}>
        {renderIcon(leftIcon)}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={2.0}
          allowFontScaling={true}
          style={[labelStyle, textStyle]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});
