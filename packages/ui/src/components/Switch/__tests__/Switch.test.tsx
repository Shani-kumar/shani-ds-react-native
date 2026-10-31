import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Switch } from '../Switch';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Switch Component (Group C)', () => {
  it('renders unchecked by default with switch accessibility role and minimum 44pt touch target', () => {
    render(
      <ThemeProvider>
        <Switch testID="flight-mode-switch" label="Auto-assign next available route" />
      </ThemeProvider>
    );

    const switchEl = screen.getByTestId('flight-mode-switch');
    expect(switchEl.props.accessibilityRole).toBe('switch');
    expect(switchEl.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(screen.getByText('Auto-assign next available route')).toBeTruthy();

    const flatStyle = StyleSheet.flatten(switchEl.props.style);
    expect(flatStyle.minHeight).toBe(lightTheme.components.switch.minTouchTarget);
    expect(flatStyle.minWidth).toBe(lightTheme.components.switch.minTouchTarget);
  });

  it('toggles checked state when pressed', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <Switch testID="toggle-switch" label="Real-time GPS Tracking" onChange={handleChange} />
      </ThemeProvider>
    );

    const switchEl = screen.getByTestId('toggle-switch');
    fireEvent.press(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled checked state', () => {
    render(
      <ThemeProvider>
        <Switch checked={true} testID="controlled-switch" label="Express Air Transit" />
      </ThemeProvider>
    );

    const switchEl = screen.getByTestId('controlled-switch');
    expect(switchEl.props.accessibilityState.checked).toBe(true);
  });

  it('blocks interaction when disabled', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <Switch
          disabled
          testID="disabled-switch"
          label="Locked compliance requirement"
          onChange={handleChange}
        />
      </ThemeProvider>
    );

    const switchEl = screen.getByTestId('disabled-switch');
    expect(switchEl.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(switchEl);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Switch ref={ref} testID="ref-switch" label="Ref switch" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
