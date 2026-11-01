import React from 'react';
import {
  Pressable,
  Text,
  type GestureResponderEvent,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme, Icon } from '@shani/ui';

export interface SegmentedOptionProps {
  label?: string;
  children?: React.ReactNode;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: 'sm' | 'md';
  leftIcon?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * SegmentedOption provides a unified interactive toggle option / filter chip.
 * Unselected: visible subtle border with surface background.
 * Selected: filled brand color with inverse text.
 * Strictly guarantees minimum touch targets and accessibility states.
 */
export function SegmentedOption({
  label,
  children,
  selected,
  onPress,
  size = 'sm',
  leftIcon,
  testID,
  style,
}: SegmentedOptionProps) {
  const { theme } = useTheme();

  const isSm = size === 'sm';
  const minHeight = isSm ? 36 : 44;
  const paddingHorizontal = isSm ? theme.spacing[3] : theme.spacing[4];
  const paddingVertical = isSm ? theme.spacing[1] : theme.spacing[2];
  const fontSize = isSm ? 13 : 14;

  const backgroundColor = selected
    ? theme.colors.action.primary.default
    : theme.colors.bg.surface;

  const borderColor = selected
    ? theme.colors.action.primary.default
    : theme.colors.border.default;

  const textColor = selected
    ? theme.colors.action.primary.text
    : theme.colors.text.primary;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight,
    paddingHorizontal,
    paddingVertical,
    gap: theme.spacing[1],
    borderRadius: theme.radius.md,
    backgroundColor,
    borderWidth: theme.borderWidth.thin,
    borderColor,
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize,
    fontWeight: selected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
    color: textColor,
    textAlign: 'center',
  };

  return (
    <Pressable
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={isSm ? { top: 4, bottom: 4, left: 2, right: 2 } : undefined}
      style={({ pressed }) => [
        containerStyle,
        pressed && {
          opacity: 0.85,
          backgroundColor: selected
            ? theme.colors.action.primary.pressed
            : theme.colors.bg.canvas,
        },
        style,
      ]}
    >
      {leftIcon ? (
        <Icon name={leftIcon} size="xs" color={textColor} />
      ) : null}
      {label ? <Text style={textStyle}>{label}</Text> : null}
      {children && typeof children !== 'string' ? children : null}
      {children && typeof children === 'string' && !label ? (
        <Text style={textStyle}>{children}</Text>
      ) : null}
    </Pressable>
  );
}
