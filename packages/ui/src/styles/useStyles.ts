import { useMemo } from 'react';
import { StyleSheet, type ViewStyle, type TextStyle, type ImageStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import type { ThemeTokens } from '@shani/tokens';

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export type StyleFactory<
  T extends NamedStyles<T>,
  P extends Record<string, unknown> = Record<string, never>,
> = (theme: ThemeTokens, props: P) => T;

/**
 * Zero-runtime style helper that binds theme tokens to native `StyleSheet.create`.
 *
 * Guarantees that components only consume verified tokens (colors, spacing, radius,
 * typography, shadows) while avoiding the frame drops of heavy runtime CSS-in-JS libraries.
 *
 * @example
 * ```tsx
 * const styles = useStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.bg.surface,
 *     padding: theme.spacing[4],
 *     borderRadius: theme.radius.md,
 *   },
 * }));
 * ```
 */
export function useStyles<
  T extends NamedStyles<T>,
  P extends Record<string, unknown> = Record<string, never>,
>(styleFactory: StyleFactory<T, P>, props: P = {} as P): T {
  const { theme } = useTheme();
  const propValues = Object.values(props);

  return useMemo(() => {
    const rawStyles = styleFactory(theme, props);
    return StyleSheet.create(rawStyles);
  }, [theme, ...propValues]);
}

/**
 * Creates a reusable style hook from a style factory.
 */
export function createStyles<
  T extends NamedStyles<T>,
  P extends Record<string, unknown> = Record<string, never>,
>(styleFactory: StyleFactory<T, P>): (props?: P) => T {
  return function useCreatedStyles(props: P = {} as P): T {
    return useStyles(styleFactory, props);
  };
}
