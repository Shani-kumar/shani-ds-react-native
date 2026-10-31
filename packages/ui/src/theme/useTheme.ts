import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextValue } from './types';

/**
 * Access the active Shani DS theme tokens and mode controls.
 * Throws a helpful error when invoked outside a `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider from @shani/ui. ' +
        'Wrap your component tree in <ThemeProvider> to provide design tokens.'
    );
  }
  return context;
}
