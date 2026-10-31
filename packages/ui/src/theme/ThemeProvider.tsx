import React, { useState, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type ThemeTokens, type ThemeMode } from '@shani/tokens';
import { ThemeContext } from './ThemeContext';
import { createTheme } from './createTheme';
import type { ThemeProviderProps, ThemeOverrides, DualThemeOverrides } from './types';

function isDualOverrides(
  overrides?: ThemeOverrides | DualThemeOverrides
): overrides is DualThemeOverrides {
  if (!overrides) return false;
  return 'light' in overrides || 'dark' in overrides;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialMode = 'system',
  mode: controlledMode,
  onModeChange,
  overrides,
  children,
}) => {
  const systemScheme = useColorScheme();
  const [internalMode, setInternalMode] = useState<ThemeMode>(initialMode);

  const activeMode = controlledMode !== undefined ? controlledMode : internalMode;

  const handleSetMode = useCallback(
    (newMode: ThemeMode) => {
      if (controlledMode === undefined) {
        setInternalMode(newMode);
      }
      onModeChange?.(newMode);
    },
    [controlledMode, onModeChange]
  );

  const resolvedMode: 'light' | 'dark' = useMemo(() => {
    if (activeMode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return activeMode;
  }, [activeMode, systemScheme]);

  const theme: ThemeTokens = useMemo(() => {
    const baseTheme = resolvedMode === 'dark' ? darkTheme : lightTheme;

    if (!overrides) {
      return baseTheme;
    }

    if (isDualOverrides(overrides)) {
      const modeSpecific = resolvedMode === 'dark' ? overrides.dark : overrides.light;
      return createTheme(baseTheme, modeSpecific);
    }

    return createTheme(baseTheme, overrides);
  }, [resolvedMode, overrides]);

  const value = useMemo(
    () => ({
      theme,
      mode: activeMode,
      resolvedMode,
      setMode: handleSetMode,
    }),
    [theme, activeMode, resolvedMode, handleSetMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
