import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import type { ThemeColors } from '@shani/tokens';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = keyof ThemeColors['text'] | (string & {});
export type IconName = string;

export interface IconProps extends Omit<ViewProps, 'children'> {
  /** Lucide icon name (e.g. 'Package', 'Truck', 'Check', 'AlertCircle') */
  name?: IconName;
  /** Direct Lucide icon component */
  icon?: LucideIcon;
  /** Size token from component tokens (xs: 12, sm: 16, md: 20, lg: 24, xl: 32) or numeric */
  size?: IconSize | number;
  /** Semantic text color token or color string */
  color?: IconColor;
  /** Stroke width in pixels (default: 2) */
  strokeWidth?: number;
  /** Accessibility label for non-decorative icons */
  accessibilityLabel?: string;
  /** Optional container style */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
}

/**
 * Icon wraps Lucide icons strictly bounded to Shani DS color and size tokens.
 * Automatically marks itself decorative (`accessible={false}`) unless an `accessibilityLabel` is provided.
 */
export const Icon = forwardRef<View, IconProps>(function Icon(
  {
    name,
    icon: IconComponentProp,
    size = 'md',
    color = 'primary',
    strokeWidth = 2,
    accessibilityLabel,
    style,
    testID,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();

  // Resolve size from token or direct number
  const resolvedSize = typeof size === 'number' ? size : theme.components.icon.size[size];

  // Resolve color from semantic text color tokens or direct color string
  const resolvedColor =
    typeof color === 'string' && color in theme.colors.text
      ? theme.colors.text[color as keyof ThemeColors['text']]
      : typeof color === 'string'
        ? color
        : theme.colors.text.primary;

  // Resolve Icon component
  let Component: LucideIcon | undefined = IconComponentProp;
  if (!Component && name) {
    Component = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[name];
  }

  const isAccessible = Boolean(accessibilityLabel);

  if (!Component) {
    return null;
  }

  return (
    <View
      ref={ref}
      testID={testID}
      accessible={isAccessible}
      accessibilityRole={isAccessible ? 'image' : 'none'}
      accessibilityLabel={accessibilityLabel}
      style={style}
      {...rest}
    >
      <Component size={resolvedSize} color={resolvedColor} strokeWidth={strokeWidth} />
    </View>
  );
});
