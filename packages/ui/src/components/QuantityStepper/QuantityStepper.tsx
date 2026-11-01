import { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useCounter } from '../../primitives/useCounter';
import { IconButton } from '../Button/IconButton';

export interface QuantityStepperProps {
  /** Optional label displayed above the stepper control */
  label?: string;
  /** Controlled numeric counter value */
  value?: number;
  /** Uncontrolled initial value (default: 0) */
  defaultValue?: number;
  /** Minimum selectable value (default: 0) */
  min?: number;
  /** Maximum selectable value (default: Infinity) */
  max?: number;
  /** Step increment/decrement delta (default: 1) */
  step?: number;
  /** Optional unit text displayed beside the number (e.g. 'kg', 'items', 'pallets') */
  unit?: string;
  /** Change callback with updated numeric count */
  onChange?: (value: number) => void;
  /** Whether the stepper is disabled */
  disabled?: boolean;
  /** Test identifier */
  testID?: string;
  /** Screen reader accessibility label */
  accessibilityLabel?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * QuantityStepper is an accessible stepped numeric input control built on `useCounter`.
 * Features 44pt minimum touch targets, limit boundaries, and VoiceOver adjustable accessibility.
 */
export const QuantityStepper = forwardRef<View, QuantityStepperProps>(function QuantityStepper(
  {
    label,
    value,
    defaultValue,
    min = 0,
    max = Infinity,
    step = 1,
    unit,
    onChange,
    disabled = false,
    testID,
    accessibilityLabel,
    style,
  },
  ref
) {
  const { theme } = useTheme();

  const {
    value: count,
    increment,
    decrement,
    canIncrement,
    canDecrement,
    adjustableProps,
  } = useCounter({
    value,
    defaultValue,
    min,
    max,
    step,
    onChange,
    disabled,
  });

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

  const labelStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  };

  const outerContainerStyle: ViewStyle = {
    alignSelf: resolvedAlignSelf,
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexBasis !== undefined && { flexBasis }),
    ...(flex !== undefined && { flex }),
    ...(width !== undefined && { width }),
    ...(minWidth !== undefined && { minWidth }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(margin !== undefined && { margin }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(marginRight !== undefined && { marginRight }),
    ...(marginHorizontal !== undefined && { marginHorizontal }),
    ...(marginVertical !== undefined && { marginVertical }),
  };

  const controlsRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    alignSelf: resolvedAlignSelf,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.bg.surface,
    padding: theme.spacing[1],
    columnGap: theme.spacing[1],
  };

  const valueBoxStyle: ViewStyle = {
    minWidth: 48,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[2],
  };

  const valueTextStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: disabled ? theme.colors.text.muted : theme.colors.text.primary,
    textAlign: 'center',
  };

  const resolvedLabel = accessibilityLabel ?? label ?? 'Quantity';

  return (
    <View ref={ref} testID={testID} style={[outerContainerStyle, visualStyle]}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View
        {...adjustableProps}
        accessibilityLabel={`${resolvedLabel}: ${count}${unit ? ` ${unit}` : ''}`}
        style={controlsRowStyle}
      >
        <IconButton
          name="Minus"
          size="sm"
          variant="ghost"
          shape="square"
          accessibilityLabel="Decrease quantity"
          disabled={!canDecrement || disabled}
          onPress={decrement}
          testID={testID ? `${testID}-minus` : undefined}
        />

        <View style={valueBoxStyle}>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={2.0}
            allowFontScaling={true}
            style={valueTextStyle}
          >
            {count}
            {unit ? ` ${unit}` : ''}
          </Text>
        </View>

        <IconButton
          name="Plus"
          size="sm"
          variant="ghost"
          shape="square"
          accessibilityLabel="Increase quantity"
          disabled={!canIncrement || disabled}
          onPress={increment}
          testID={testID ? `${testID}-plus` : undefined}
        />
      </View>
    </View>
  );
});

QuantityStepper.displayName = 'QuantityStepper';
