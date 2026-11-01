import React, { forwardRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type AccessibilityRole,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useSelection, type SelectionMode } from '../../primitives/useSelection';
import { Chip, type ChipSize } from './Chip';

export interface ChipGroupItem<T = string> {
  value: T;
  label: string;
  leftIcon?: React.ReactNode | LucideIcon | string;
  disabled?: boolean;
  testID?: string;
}

export interface ChipGroupProps<T = string> {
  /** Optional group header label */
  label?: string;
  /** Selection mode: 'single' for mutually exclusive, 'multiple' for multi-select (default: 'single') */
  mode?: SelectionMode;
  /** Controlled selection value (single: T | null; multiple: T[]) */
  value?: T | T[] | null;
  /** Uncontrolled initial value (single: T | null; multiple: T[]) */
  defaultValue?: T | T[] | null;
  /** Selection change callback */
  onChange?: (value: T | T[] | null) => void;
  /** Available chip options when using data-driven rendering */
  options?: Array<ChipGroupItem<T>>;
  /** Size tier passed down to chips (default: 'md') */
  size?: ChipSize;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Whether to render chips in a horizontally scrollable container instead of wrapping (default: false) */
  scrollable?: boolean;
  /** Whether deselecting the active item is allowed in single mode (default: false) */
  allowEmpty?: boolean;
  /** Optional custom child chips */
  children?: React.ReactNode;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for the group */
  accessibilityLabel?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * ChipGroup orchestrates a collection of Chips using the `useSelection` headless hook.
 * Wraps items by default and provides single or multiple selection with full ARIA contracts.
 */
function ChipGroupInner<T = string>(
  {
    label,
    mode = 'single',
    value,
    defaultValue,
    onChange,
    options,
    size = 'md',
    disabled = false,
    scrollable = false,
    allowEmpty = false,
    children,
    testID,
    accessibilityLabel,
    style,
  }: ChipGroupProps<T>,
  ref: React.ForwardedRef<View>
) {
  const { theme } = useTheme();

  const selection = useSelection<T>(
    mode === 'multiple'
      ? {
          mode: 'multiple',
          value: Array.isArray(value) ? value : undefined,
          defaultValue: Array.isArray(defaultValue) ? defaultValue : undefined,
          onChange: onChange as ((val: T[]) => void) | undefined,
          disabled,
        }
      : {
          mode: 'single',
          value: value !== undefined ? (value as T | null) : undefined,
          defaultValue: defaultValue !== undefined ? (defaultValue as T | null) : undefined,
          onChange: onChange as ((val: T | null) => void) | undefined,
          disabled,
          allowEmpty,
        }
  );

  const labelStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  };

  const groupContent = (
    <>
      {options
        ? options.map((item) => {
            const itemProps = selection.getItemProps(item.value, {
              disabled: item.disabled,
            });

            return (
              <Chip
                key={String(item.value)}
                label={item.label}
                leftIcon={item.leftIcon}
                size={size}
                disabled={itemProps.disabled}
                selected={itemProps.selected}
                onPress={itemProps.onPress}
                accessibilityRole={itemProps.accessibilityRole}
                testID={
                  item.testID ?? (testID ? `${testID}-item-${item.value}` : undefined)
                }
              />
            );
          })
        : children}
    </>
  );

  const role: AccessibilityRole | undefined = mode === 'single' ? 'radiogroup' : undefined;

  return (
    <View
      ref={ref}
      testID={testID}
      accessible={Boolean(accessibilityLabel || label)}
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel ?? label}
      style={style}
    >
      {label && <Text style={labelStyle}>{label}</Text>}

      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: theme.spacing[2],
          }}
        >
          {groupContent}
        </ScrollView>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: theme.spacing[2],
            columnGap: theme.spacing[2],
          }}
        >
          {groupContent}
        </View>
      )}
    </View>
  );
}

export const ChipGroup = forwardRef(ChipGroupInner) as <T = string>(
  props: ChipGroupProps<T> & { ref?: React.Ref<View> }
) => React.ReactElement;
