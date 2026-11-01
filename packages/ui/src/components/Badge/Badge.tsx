import { forwardRef } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { Icon } from '../Icon/Icon';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  /** Semantic feedback variant (default: 'neutral') */
  variant?: BadgeVariant;
  /** Size tier (default: 'md') */
  size?: BadgeSize;
  /** Whether to render a colored status dot before the label (default: false) */
  dot?: boolean;
  /** Optional icon component or icon name rendered before the label */
  icon?: LucideIcon | string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom text style */
  textStyle?: StyleProp<TextStyle>;
  /** Test identifier */
  testID?: string;
  /** Badge text label */
  children: React.ReactNode;
}

/**
 * Badge communicates concise status labels, counts, or categorization tags.
 * Bounded strictly to semantic feedback token pairings with guaranteed WCAG AA contrast.
 */
export const Badge = forwardRef<View, BadgeProps>(function Badge(
  {
    variant = 'neutral',
    size = 'md',
    dot = false,
    icon: IconProp,
    style,
    textStyle,
    testID,
    children,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();

  const badgeTokens = theme.components.badge;
  const variantTokens = badgeTokens[variant];
  const sizeTokens = badgeTokens.size[size];

  const flatStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: flatStyle.alignSelf ?? 'flex-start',
    backgroundColor: variantTokens.bg,
    borderRadius: theme.radius.full,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    paddingVertical: sizeTokens.paddingVertical,
    gap: theme.spacing[1],
    maxWidth: '100%',
    flexWrap: 'wrap',
  };

  const labelStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: sizeTokens.fontSize,
    fontWeight: theme.typography.fontWeight.semibold,
    color: variantTokens.text,
    textAlign: 'center',
    flexShrink: 1,
  };

  const dotSize = size === 'sm' ? 6 : 8;
  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: theme.radius.full,
    backgroundColor: variantTokens.text,
  };

  return (
    <View
      ref={ref}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      style={[containerStyle, style]}
      {...rest}
    >
      {dot ? <View style={dotStyle} testID={testID ? `${testID}-dot` : undefined} /> : null}
      {typeof IconProp === 'string' ? (
        <Icon name={IconProp} size={sizeTokens.iconSize} color={variantTokens.text} strokeWidth={2.5} />
      ) : IconProp ? (
        <IconProp size={sizeTokens.iconSize} color={variantTokens.text} strokeWidth={2.5} />
      ) : null}
      {typeof children === 'string' || typeof children === 'number' || Array.isArray(children) ? (
        <RNText maxFontSizeMultiplier={1.5} allowFontScaling={true} style={[labelStyle, textStyle]}>
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
});
