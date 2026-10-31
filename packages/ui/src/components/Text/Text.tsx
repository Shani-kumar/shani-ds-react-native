import { forwardRef } from 'react';
import {
  Text as NativeText,
  type TextProps as NativeTextProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import type { ThemeColors, TypographyTokens } from '@shani/tokens';

export type TextVariant = 'display' | 'heading' | 'title' | 'body' | 'label' | 'caption';
export type TextColor = keyof ThemeColors['text'];
export type TextWeight = keyof TypographyTokens['fontWeight'];

export interface TextProps extends NativeTextProps {
  /** Typographic hierarchy variant */
  variant?: TextVariant;
  /** Semantic text color token */
  color?: TextColor;
  /** Explicit font weight override */
  weight?: TextWeight;
  /** Text alignment */
  align?: TextStyle['textAlign'];
  /** Maximum scaling multiplier for Dynamic Type / large font accessibility (default: 2.0) */
  maxFontSizeMultiplier?: number;
  /** Whether font automatically scales with device accessibility settings (default: true) */
  allowFontScaling?: boolean;
  /** Optional custom text style overrides */
  style?: StyleProp<TextStyle>;
  /** Test identifier */
  testID?: string;
  /** Children nodes */
  children?: React.ReactNode;
}

/**
 * Text renders typography strictly bound to Shani DS typographic tokens.
 * Honors OS font-scaling preferences with accessibility boundaries.
 */
export const Text = forwardRef<NativeText, TextProps>(function Text(
  {
    variant = 'body',
    color = 'primary',
    weight,
    align,
    maxFontSizeMultiplier = 2.0,
    allowFontScaling = true,
    accessibilityRole,
    style,
    testID,
    children,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();

  const variantStyles: Record<TextVariant, TextStyle> = {
    display: {
      fontSize: theme.typography.fontSize['4xl'],
      lineHeight: theme.typography.lineHeight['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: theme.typography.letterSpacing.tight,
    },
    heading: {
      fontSize: theme.typography.fontSize['2xl'],
      lineHeight: theme.typography.lineHeight['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: theme.typography.letterSpacing.tight,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: theme.typography.letterSpacing.normal,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.base,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: theme.typography.letterSpacing.normal,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      fontWeight: theme.typography.fontWeight.medium,
      letterSpacing: theme.typography.letterSpacing.wide,
    },
    caption: {
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
      fontWeight: theme.typography.fontWeight.regular,
      letterSpacing: theme.typography.letterSpacing.normal,
    },
  };

  const computedStyle: TextStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    color: theme.colors.text[color],
    ...variantStyles[variant],
    ...(weight && { fontWeight: theme.typography.fontWeight[weight] }),
    ...(align && { textAlign: align }),
  };

  // Automatically assign header role for high-level variants unless explicitly provided
  const resolvedRole =
    accessibilityRole ?? (variant === 'display' || variant === 'heading' ? 'header' : undefined);

  return (
    <NativeText
      ref={ref}
      testID={testID}
      style={[computedStyle, style]}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      allowFontScaling={allowFontScaling}
      accessibilityRole={resolvedRole}
      {...rest}
    >
      {children}
    </NativeText>
  );
});
