import { forwardRef } from 'react';
import {
  View,
  type ViewProps,
  type ViewStyle,
  type StyleProp,
  type AccessibilityRole,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import type { ThemeColors, BorderWidthScale, SpacingKey } from '@shani/tokens';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerColor = keyof ThemeColors['border'];
export type DividerThickness = keyof BorderWidthScale;

export interface DividerProps extends ViewProps {
  /** Orientation of the divider line (default: 'horizontal') */
  orientation?: DividerOrientation;
  /** Semantic border color token (default: 'subtle') */
  color?: DividerColor;
  /** Border thickness token (default: 'thin') */
  thickness?: DividerThickness;
  /** Inset padding on start/end using spacing scale */
  inset?: SpacingKey;
  /** Custom accessibility role (default: 'none') */
  accessibilityRole?: AccessibilityRole;
  /** Custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
}

/**
 * Divider renders a decorative or accessible horizontal or vertical separating rule.
 */
export const Divider = forwardRef<View, DividerProps>(function Divider(
  {
    orientation = 'horizontal',
    color = 'subtle',
    thickness = 'thin',
    inset,
    accessibilityRole = 'none',
    style,
    testID,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();

  const isHorizontal = orientation === 'horizontal';
  const size = theme.borderWidth[thickness];
  const dividerColor = theme.colors.border[color];
  const insetValue = inset !== undefined ? theme.spacing[inset] : undefined;

  const dividerStyle: ViewStyle = isHorizontal
    ? {
        width: '100%',
        height: size,
        backgroundColor: dividerColor,
        ...(insetValue !== undefined && {
          marginHorizontal: insetValue,
        }),
      }
    : {
        height: '100%',
        width: size,
        backgroundColor: dividerColor,
        ...(insetValue !== undefined && {
          marginVertical: insetValue,
        }),
      };

  return (
    <View
      ref={ref}
      testID={testID}
      accessible={false}
      accessibilityRole={accessibilityRole}
      style={[dividerStyle, style]}
      {...rest}
    />
  );
});
