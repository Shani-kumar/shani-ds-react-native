import React from 'react';
import { Text } from 'react-native';
import * as ReactNative from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../useTheme';
import { createTheme } from '../createTheme';
import { lightTheme, darkTheme } from '@shani/tokens';

const ConsumerComponent = () => {
  const { theme, mode, resolvedMode, setMode } = useTheme();
  return (
    <>
      <Text testID="mode-text">{mode}</Text>
      <Text testID="resolved-mode-text">{resolvedMode}</Text>
      <Text testID="bg-canvas">{theme.colors.bg.canvas}</Text>
      <Text testID="brand-action">{theme.colors.action.primary.default}</Text>
      <Text testID="button-set-dark" onPress={() => setMode('dark')}>
        Set Dark
      </Text>
      <Text testID="button-set-light" onPress={() => setMode('light')}>
        Set Light
      </Text>
      <Text testID="button-set-system" onPress={() => setMode('system')}>
        Set System
      </Text>
    </>
  );
};

describe('Theme System (Step 2.1)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws a descriptive error when useTheme is invoked outside ThemeProvider', () => {
    // Suppress console.error from expected throw in test runner
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ConsumerComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider from @shani/ui'
    );

    spy.mockRestore();
  });

  it('renders default system mode and tracks device color scheme (light)', () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');

    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode-text').props.children).toBe('system');
    expect(screen.getByTestId('resolved-mode-text').props.children).toBe('light');
    expect(screen.getByTestId('bg-canvas').props.children).toBe(lightTheme.colors.bg.canvas);
  });

  it('renders default system mode and tracks device color scheme (dark)', () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');

    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode-text').props.children).toBe('system');
    expect(screen.getByTestId('resolved-mode-text').props.children).toBe('dark');
    expect(screen.getByTestId('bg-canvas').props.children).toBe(darkTheme.colors.bg.canvas);
  });

  it('switches modes interactively from inside the app using setMode', () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');

    render(
      <ThemeProvider initialMode="light">
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode-text').props.children).toBe('light');
    expect(screen.getByTestId('bg-canvas').props.children).toBe(lightTheme.colors.bg.canvas);

    // Switch to dark
    act(() => {
      screen.getByTestId('button-set-dark').props.onPress();
    });

    expect(screen.getByTestId('mode-text').props.children).toBe('dark');
    expect(screen.getByTestId('resolved-mode-text').props.children).toBe('dark');
    expect(screen.getByTestId('bg-canvas').props.children).toBe(darkTheme.colors.bg.canvas);

    // Switch back to light
    act(() => {
      screen.getByTestId('button-set-light').props.onPress();
    });

    expect(screen.getByTestId('mode-text').props.children).toBe('light');
    expect(screen.getByTestId('resolved-mode-text').props.children).toBe('light');
    expect(screen.getByTestId('bg-canvas').props.children).toBe(lightTheme.colors.bg.canvas);
  });

  it('supports controlled mode and triggers onModeChange callback', () => {
    const onModeChange = jest.fn();

    render(
      <ThemeProvider mode="dark" onModeChange={onModeChange}>
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode-text').props.children).toBe('dark');
    expect(screen.getByTestId('resolved-mode-text').props.children).toBe('dark');

    act(() => {
      screen.getByTestId('button-set-light').props.onPress();
    });

    expect(onModeChange).toHaveBeenCalledWith('light');
  });

  it('merges brand overrides correctly via createTheme helper', () => {
    const customBrand = '#FF5500';
    const overriddenTheme = createTheme(lightTheme, {
      colors: {
        action: {
          primary: {
            default: customBrand,
          },
        },
      },
    });

    expect(overriddenTheme.colors.action.primary.default).toBe(customBrand);
    // Other tokens remain intact
    expect(overriddenTheme.colors.bg.canvas).toBe(lightTheme.colors.bg.canvas);
    expect(overriddenTheme.spacing[4]).toBe(lightTheme.spacing[4]);
  });

  it('applies brand overrides passed to ThemeProvider', () => {
    const customBrandAction = '#10B981';

    render(
      <ThemeProvider
        initialMode="light"
        overrides={{
          colors: {
            action: {
              primary: {
                default: customBrandAction,
              },
            },
          },
        }}
      >
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('brand-action').props.children).toBe(customBrandAction);
  });

  it('applies dual-mode overrides selectively for light and dark', () => {
    const customLightBrand = '#E11D48';
    const customDarkBrand = '#FB7185';

    render(
      <ThemeProvider
        initialMode="light"
        overrides={{
          light: {
            colors: {
              action: {
                primary: {
                  default: customLightBrand,
                },
              },
            },
          },
          dark: {
            colors: {
              action: {
                primary: {
                  default: customDarkBrand,
                },
              },
            },
          },
        }}
      >
        <ConsumerComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('brand-action').props.children).toBe(customLightBrand);

    act(() => {
      screen.getByTestId('button-set-dark').props.onPress();
    });

    expect(screen.getByTestId('brand-action').props.children).toBe(customDarkBrand);
  });
});
