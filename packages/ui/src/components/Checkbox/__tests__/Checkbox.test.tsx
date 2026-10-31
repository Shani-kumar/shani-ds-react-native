import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../Checkbox';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('Checkbox Component (Group C)', () => {
  it('renders unchecked by default with checkbox accessibility role', () => {
    render(
      <ThemeProvider>
        <Checkbox
          testID="terms-checkbox"
          label="Acknowledge cargo hazardous materials inspection"
        />
      </ThemeProvider>
    );

    const checkbox = screen.getByTestId('terms-checkbox');
    expect(checkbox.props.accessibilityRole).toBe('checkbox');
    expect(checkbox.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(screen.getByText('Acknowledge cargo hazardous materials inspection')).toBeTruthy();
  });

  it('toggles checked state when pressed', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <Checkbox testID="toggle-checkbox" label="Priority Delivery" onChange={handleChange} />
      </ThemeProvider>
    );

    const checkbox = screen.getByTestId('toggle-checkbox');
    fireEvent.press(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports controlled checked state', () => {
    render(
      <ThemeProvider>
        <Checkbox checked={true} testID="controlled-checkbox" label="Pre-checked shipment" />
      </ThemeProvider>
    );

    const checkbox = screen.getByTestId('controlled-checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('supports indeterminate state with mixed accessibilityState', () => {
    render(
      <ThemeProvider>
        <Checkbox
          indeterminate
          testID="indeterminate-checkbox"
          label="Select All (3 of 10 selected)"
        />
      </ThemeProvider>
    );

    const checkbox = screen.getByTestId('indeterminate-checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe('mixed');
  });

  it('blocks interaction when disabled', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <Checkbox
          disabled
          testID="disabled-checkbox"
          label="Locked requirement"
          onChange={handleChange}
        />
      </ThemeProvider>
    );

    const checkbox = screen.getByTestId('disabled-checkbox');
    expect(checkbox.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('enforces minimum 44x44pt touch target', () => {
    render(
      <ThemeProvider>
        <Checkbox size="sm" testID="sm-cb" label="Small" />
        <Checkbox size="md" testID="md-cb" label="Medium" />
      </ThemeProvider>
    );

    const smStyle = StyleSheet.flatten(screen.getByTestId('sm-cb').props.style);
    expect(smStyle.minHeight).toBe(44);
    expect(smStyle.minWidth).toBe(44);

    const mdStyle = StyleSheet.flatten(screen.getByTestId('md-cb').props.style);
    expect(mdStyle.minHeight).toBe(44);
    expect(mdStyle.minWidth).toBe(44);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Checkbox ref={ref} testID="ref-cb" label="Ref target" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
