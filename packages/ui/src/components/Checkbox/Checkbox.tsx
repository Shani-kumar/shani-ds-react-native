import { forwardRef, useEffect } from 'react';
import { Pressable, View, Platform, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Check, Minus } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useToggle } from '../../primitives/useToggle';
import { Text } from '../Text/Text';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Uncontrolled initial checked state */
  defaultChecked?: boolean;
  /** Whether the checkbox is in an indeterminate (partially selected) state */
  indeterminate?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Custom label element */
  children?: React.ReactNode;
  /** Size tier (sm, md, lg) (default: 'md') */
  size?: CheckboxSize;
  /** Test identifier */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Checkbox is an accessible selection control in Shani DS.
 * Built on `useToggle` headless hook with Reanimated scale micro-interactions.
 * Enforces minimum 44x44pt touch target and supports indeterminate state.
 */
export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked,
    indeterminate = false,
    onChange,
    disabled = false,
    label,
    children,
    size = 'md',
    testID,
    accessibilityLabel,
    accessibilityHint,
    style,
  },
  ref
) {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();

  const { state, toggleProps } = useToggle({
    checked,
    defaultChecked,
    onChange,
    disabled,
    role: 'checkbox',
    accessibilityLabel: accessibilityLabel ?? label,
    accessibilityHint,
    testID,
  });

  const isCheckedOrIndeterminate = state.isChecked || indeterminate;

  // Reanimated check icon scale micro-animation
  const scale = useSharedValue(isCheckedOrIndeterminate ? 1 : 0);

  useEffect(() => {
    if (isCheckedOrIndeterminate) {
      if (isReducedMotion) {
        scale.value = 1;
      } else {
        scale.value = withSpring(1, {
          damping: theme.motion.spring.snappy.damping,
          stiffness: theme.motion.spring.snappy.stiffness,
          mass: theme.motion.spring.snappy.mass,
        });
      }
    } else {
      if (isReducedMotion) {
        scale.value = 0;
      } else {
        scale.value = withSpring(0, {
          damping: theme.motion.spring.snappy.damping,
          stiffness: theme.motion.spring.snappy.stiffness,
          mass: theme.motion.spring.snappy.mass,
        });
      }
    }
  }, [isCheckedOrIndeterminate, isReducedMotion, theme, scale]);

  const animatedIconStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }),
    [scale]
  );

  const checkboxTokens = theme.components.checkbox;
  const sizeTokens = checkboxTokens.size[size];

  // Resolve box background and border colors
  let boxBg: string = checkboxTokens.bg.default;
  let boxBorder: string = checkboxTokens.border.default;

  if (state.isDisabled) {
    boxBg = isCheckedOrIndeterminate ? checkboxTokens.bg.disabled : checkboxTokens.bg.default;
    boxBorder = checkboxTokens.border.disabled;
  } else if (state.isFocused) {
    boxBg = isCheckedOrIndeterminate ? checkboxTokens.bg.checked : checkboxTokens.bg.default;
    boxBorder = checkboxTokens.border.focus;
  } else if (isCheckedOrIndeterminate) {
    boxBg = checkboxTokens.bg.checked;
    boxBorder = checkboxTokens.border.checked;
  }

  const iconColor = state.isDisabled ? checkboxTokens.icon.disabled : checkboxTokens.icon.checked;

  const boxStyle: ViewStyle = {
    width: sizeTokens.boxSize,
    height: sizeTokens.boxSize,
    borderRadius: theme.radius.sm,
    borderWidth: theme.borderWidth.medium,
    borderColor: boxBorder,
    backgroundColor: boxBg,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const IconComponent = indeterminate ? Minus : Check;

  // Custom accessibilityState to support 'mixed' for indeterminate
  const resolvedA11yState = {
    checked: indeterminate ? ('mixed' as const) : state.isChecked,
    disabled: state.isDisabled,
  };

  const flatStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;

  return (
    <Pressable
      ref={ref}
      {...toggleProps}
      accessibilityState={resolvedA11yState}
      style={[
        {
          minHeight: sizeTokens.minTouchTarget,
          minWidth: sizeTokens.minTouchTarget,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: flatStyle.alignSelf ?? 'flex-start',
          gap: theme.spacing[2],
          maxWidth: '100%',
          ...(Platform.OS === 'web' && {
            outlineStyle: 'none' as never,
            outlineWidth: 0 as never,
          }),
        },
        style,
      ]}
    >
      <View style={boxStyle} testID={testID ? `${testID}-box` : undefined}>
        <Animated.View style={animatedIconStyle}>
          <IconComponent size={sizeTokens.iconSize} color={iconColor} strokeWidth={3} />
        </Animated.View>
      </View>

      {label ? (
        <Text
          variant={size === 'lg' ? 'body' : 'label'}
          color={state.isDisabled ? 'muted' : 'primary'}
          style={{ flexShrink: 1 }}
        >
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
