import { useMemo } from 'react';
import * as ReactNative from 'react-native';
import { useTheme } from '../theme/useTheme';
import type { BreakpointScale } from '@shani/tokens';

export type BreakpointKey = keyof BreakpointScale;

export type ResponsiveRecord<T> = Partial<Record<BreakpointKey, T>>;

export type ResponsiveValue<T> = T | ResponsiveRecord<T>;

const BREAKPOINT_ORDER: BreakpointKey[] = ['wide', 'desktop', 'tablet', 'phone'];

/**
 * Determines the active breakpoint given a viewport width and breakpoint scale.
 */
export function getBreakpoint(width: number, breakpoints: BreakpointScale): BreakpointKey {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'phone';
}

function isResponsiveRecord<T>(val: ResponsiveValue<T>): val is ResponsiveRecord<T> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    return false;
  }
  return BREAKPOINT_ORDER.some(key => key in (val as Record<string, unknown>));
}

/**
 * Resolves a responsive value with mobile-first fallback based on current width.
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  width: number,
  breakpoints: BreakpointScale
): T {
  if (!isResponsiveRecord(value)) {
    return value as T;
  }

  const currentBreakpoint = getBreakpoint(width, breakpoints);
  const activeIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);

  // Search downwards starting from current breakpoint down to phone
  for (let i = activeIndex; i < BREAKPOINT_ORDER.length; i++) {
    const key = BREAKPOINT_ORDER[i]!;
    if (key in value && value[key] !== undefined) {
      return value[key] as T;
    }
  }

  // If nothing found in lower keys, check upper keys as fallback
  for (let i = activeIndex - 1; i >= 0; i--) {
    const key = BREAKPOINT_ORDER[i]!;
    if (key in value && value[key] !== undefined) {
      return value[key] as T;
    }
  }

  return undefined as unknown as T;
}

export interface BreakpointInfo {
  breakpoint: BreakpointKey;
  width: number;
  height: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isMobile: boolean;
  isTabletOrLarger: boolean;
}

/**
 * Hook providing current screen dimensions, active breakpoint, and convenience flags.
 */
export function useBreakpoint(): BreakpointInfo {
  const { width, height } = ReactNative.useWindowDimensions();
  const { theme } = useTheme();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width, theme.breakpoints);
    return {
      breakpoint,
      width,
      height,
      isPhone: breakpoint === 'phone',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
      isWide: breakpoint === 'wide',
      isMobile: breakpoint === 'phone',
      isTabletOrLarger: breakpoint !== 'phone',
    };
  }, [width, height, theme.breakpoints]);
}

/**
 * Hook to select a value based on the current responsive breakpoint.
 *
 * @example
 * ```tsx
 * const columns = useResponsiveValue({ phone: 1, tablet: 2, desktop: 4 });
 * const padding = useResponsiveValue(theme.spacing[4]);
 * ```
 */
export function useResponsiveValue<T>(value: ResponsiveValue<T>): T {
  const { width } = ReactNative.useWindowDimensions();
  const { theme } = useTheme();

  return useMemo(() => {
    return resolveResponsiveValue(value, width, theme.breakpoints);
  }, [value, width, theme.breakpoints]);
}
