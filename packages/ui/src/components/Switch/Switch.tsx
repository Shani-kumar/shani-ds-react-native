import { forwardRef, useEffect } from 'react';
import { Pressable, View, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import { useToggle } from '../../primitives/useToggle';
import { Text } from '../Text/Text';

export interface SwitchProps {
  /** Whether the switch is checked */
  checked?: boolean;
  /** Uncontrolled initial checked state */
  defaultChecked?: boolean;
  /** Callback invoked on toggle */
  onChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Optional label text placed alongside the switch */
  label?: string;
  /** Custom label element */
  children?: React.ReactNode;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Switch renders an accessible binary toggle control with Reanimated spring physics.
 * Built on `useToggle` headless hook. Enforces minimum 44x44pt touch target and respects reduce-motion.
 */
export const Switch = forwardRef<View, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    label,
    children,
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
    role: 'switch',
    accessibilityLabel: accessibilityLabel ?? label,
    accessibilityHint,
    testID,
  });

  const switchTokens = theme.components.switch;

  // Reanimated thumb translateX spring micro-interaction
  const translateX = useSharedValue(state.isChecked ? switchTokens.thumb.offset : 0);

  useEffect(() => {
    const targetOffset = state.isChecked ? switchTokens.thumb.offset : 0;
    if (isReducedMotion) {
      translateX.value = targetOffset;
    } else {
      translateX.value = withSpring(targetOffset, {
        damping: theme.motion.spring.snappy.damping,
        stiffness: theme.motion.spring.snappy.stiffness,
        mass: theme.motion.spring.snappy.mass,
      });
    }
  }, [state.isChecked, isReducedMotion, switchTokens.thumb.offset, theme, translateX]);

  const animatedThumbStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  // Resolve track background color based on active/disabled states
  let trackBg: string = state.isChecked
    ? switchTokens.track.bgActive
    : switchTokens.track.bgInactive;

  if (state.isDisabled) {
    trackBg = state.isChecked
      ? switchTokens.track.bgDisabledActive
      : switchTokens.track.bgDisabledInactive;
  }

  const trackStyle: ViewStyle = {
    width: switchTokens.track.width,
    height: switchTokens.track.height,
    borderRadius: theme.radius.full,
    backgroundColor: trackBg,
    padding: switchTokens.track.padding,
    justifyContent: 'center',
  };

  const thumbStyle: ViewStyle = {
    width: switchTokens.thumb.size,
    height: switchTokens.thumb.size,
    borderRadius: theme.radius.full,
    backgroundColor: state.isDisabled ? switchTokens.thumb.bgDisabled : switchTokens.thumb.bg,
  };

  return (
    <Pressable
      ref={ref}
      {...toggleProps}
      style={[
        {
          minHeight: switchTokens.minTouchTarget,
          minWidth: switchTokens.minTouchTarget,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2],
        },
        style,
      ]}
    >
      <View style={trackStyle} testID={testID ? `${testID}-track` : undefined}>
        <Animated.View
          style={[thumbStyle, animatedThumbStyle]}
          testID={testID ? `${testID}-thumb` : undefined}
        />
      </View>

      {label ? (
        <Text variant="label" color={state.isDisabled ? 'muted' : 'primary'}>
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
