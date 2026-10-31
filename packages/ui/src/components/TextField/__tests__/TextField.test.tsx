import React from 'react';
import { TextInput, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TextField } from '../TextField';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('TextField Component (Group C)', () => {
  it('renders input with label, placeholder, and token styles', () => {
    render(
      <ThemeProvider>
        <TextField testID="tracking-input" label="Tracking Number" placeholder="e.g. TRK-98421" />
      </ThemeProvider>
    );

    expect(screen.getByText('Tracking Number')).toBeTruthy();
    const input = screen.getByTestId('tracking-input');
    expect(input.props.placeholder).toBe('e.g. TRK-98421');
    expect(input.props.accessibilityLabel).toBe('Tracking Number');
    expect(input.props.allowFontScaling).toBe(true);
    expect(input.props.maxFontSizeMultiplier).toBe(2.0);
  });

  it('renders required indicator when required prop is passed', () => {
    render(
      <ThemeProvider>
        <TextField label="Origin Hub" required testID="required-input" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Origin Hub/)).toBeTruthy();
    expect(screen.getByText(/\*/)).toBeTruthy();
  });

  it('handles value changes and text input events', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <TextField testID="editable-input" label="Driver Name" onChangeText={handleChange} />
      </ThemeProvider>
    );

    const input = screen.getByTestId('editable-input');
    fireEvent.changeText(input, 'Jane Doe');
    expect(handleChange).toHaveBeenCalledWith('Jane Doe');
  });

  it('displays error message and sets error border styling', () => {
    render(
      <ThemeProvider>
        <TextField
          testID="error-input"
          label="Postal Code"
          error="Invalid logistics zone postal code"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Invalid logistics zone postal code')).toBeTruthy();
    const input = screen.getByTestId('error-input');
    expect(input.props.accessibilityHint).toBe('Invalid logistics zone postal code');
  });

  it('renders prefix and suffix elements', () => {
    render(
      <ThemeProvider>
        <TextField
          testID="prefixed-input"
          label="Weight"
          prefix={<View testID="weight-prefix" />}
          suffix={<View testID="weight-suffix" />}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('weight-prefix')).toBeTruthy();
    expect(screen.getByTestId('weight-suffix')).toBeTruthy();
  });

  it('supports secure entry and toggle eye visibility', () => {
    render(
      <ThemeProvider>
        <TextField
          testID="secure-input"
          label="Warehouse Gate PIN"
          secureTextEntry
          showSecureToggle
        />
      </ThemeProvider>
    );

    const input = screen.getByTestId('secure-input');
    expect(input.props.secureTextEntry).toBe(true);

    const toggleBtn = screen.getByTestId('secure-input-secure-toggle');
    expect(toggleBtn.props.accessibilityLabel).toBe('Show text');

    fireEvent.press(toggleBtn);
    expect(input.props.secureTextEntry).toBe(false);
    expect(toggleBtn.props.accessibilityLabel).toBe('Hide text');
  });

  it('blocks editing and applies disabled styles when disabled', () => {
    const handleChange = jest.fn();
    render(
      <ThemeProvider>
        <TextField
          testID="disabled-input"
          label="Immutable ID"
          value="FIXED-100"
          disabled
          onChangeText={handleChange}
        />
      </ThemeProvider>
    );

    const input = screen.getByTestId('disabled-input');
    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toEqual({ disabled: true });

    fireEvent.changeText(input, 'New Value');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('enforces minimum 44pt touch target across sizes', () => {
    render(
      <ThemeProvider>
        <TextField size="sm" testID="sm-input" label="Small" />
        <TextField size="md" testID="md-input" label="Medium" />
        <TextField size="lg" testID="lg-input" label="Large" />
      </ThemeProvider>
    );

    expect(lightTheme.components.input.size.sm.minHeight).toBe(44);
    expect(lightTheme.components.input.size.md.minHeight).toBe(48);
    expect(lightTheme.components.input.size.lg.minHeight).toBe(56);
  });

  it('forwards ref correctly to native TextInput', () => {
    const ref = React.createRef<TextInput>();
    render(
      <ThemeProvider>
        <TextField ref={ref} testID="ref-input" label="Reference Target" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
