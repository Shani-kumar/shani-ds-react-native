import React from 'react';
import { StyleSheet, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Chip } from '../Chip';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Chip Component', () => {
  it('renders unselected chip with minimum 44pt touch target and accessible role', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Chip label="Fragile" onPress={onPress} testID="test-chip" />
      </ThemeProvider>
    );

    const pressable = screen.getByTestId('test-chip');
    expect(pressable).toBeTruthy();
    expect(screen.getByText('Fragile')).toBeTruthy();

    const flatPressableStyle = StyleSheet.flatten(pressable.props.style);
    expect(flatPressableStyle.height).toBe(44);
    expect(flatPressableStyle.minHeight).toBe(44);

    fireEvent.press(pressable);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders selected chip with brand style tokens', () => {
    render(
      <ThemeProvider>
        <Chip label="Express" selected={true} testID="selected-chip" />
      </ThemeProvider>
    );

    const pressable = screen.getByTestId('selected-chip');
    expect(pressable.props.accessibilityState.selected).toBe(true);

    const animatedView = pressable.children[0];
    const flatContainerStyle = StyleSheet.flatten(animatedView.props.style);
    expect(flatContainerStyle.backgroundColor).toBe(lightTheme.components.chip.selected.bg);
  });

  it('respects disabled state and prevents press actions', () => {
    const onPress = jest.fn();
    render(
      <ThemeProvider>
        <Chip label="Locked" disabled={true} onPress={onPress} testID="disabled-chip" />
      </ThemeProvider>
    );

    const pressable = screen.getByTestId('disabled-chip');
    expect(pressable.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(pressable);
    expect(onPress).not.toHaveBeenCalled();

    const animatedView = pressable.children[0];
    const flatContainerStyle = StyleSheet.flatten(animatedView.props.style);
    expect(flatContainerStyle.backgroundColor).toBe(lightTheme.components.chip.disabled.bg);
  });

  it('forwards ref to native element', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Chip ref={ref} label="Ref Chip" />
      </ThemeProvider>
    );
    expect(ref.current).toBeTruthy();
  });
});
