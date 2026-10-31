import { lightTheme, type ThemeTokens } from '@shani/tokens';
import type { DeepPartial } from './types';

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source?: DeepPartial<T>
): T {
  if (!source) return target;
  const output = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      sourceVal !== undefined &&
      typeof sourceVal === 'object' &&
      sourceVal !== null &&
      !Array.isArray(sourceVal) &&
      typeof targetVal === 'object' &&
      targetVal !== null &&
      !Array.isArray(targetVal)
    ) {
      output[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as DeepPartial<Record<string, unknown>>
      ) as unknown as T[keyof T];
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal as unknown as T[keyof T];
    }
  }

  return output;
}

/**
 * Creates a customized Shani DS theme by merging partial overrides into a base theme.
 * Ideal for white-label logistics tenant applications and brand variations.
 */
export function createTheme(
  baseTheme: ThemeTokens = lightTheme,
  overrides?: DeepPartial<ThemeTokens>
): ThemeTokens {
  return deepMerge(
    baseTheme as unknown as Record<string, unknown>,
    overrides
  ) as unknown as ThemeTokens;
}
