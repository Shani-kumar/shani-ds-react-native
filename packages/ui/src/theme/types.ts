import type { ThemeTokens, ThemeMode } from '@shani/tokens';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
      ? readonly DeepPartial<U>[]
      : T[P] extends object
        ? DeepPartial<T[P]>
        : T[P];
};

export type ThemeOverrides = DeepPartial<ThemeTokens>;

export interface DualThemeOverrides {
  light?: ThemeOverrides;
  dark?: ThemeOverrides;
}

export interface ThemeContextValue {
  theme: ThemeTokens;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  initialMode?: ThemeMode;
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  overrides?: ThemeOverrides | DualThemeOverrides;
  children: React.ReactNode;
}
