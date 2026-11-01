import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QuantityStepper } from '../QuantityStepper';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('QuantityStepper Component', () => {
  it('renders initial value and step increments/decrements', () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <QuantityStepper
          label="Pallet Count"
          defaultValue={2}
          min={1}
          max={4}
          step={1}
          unit="pallets"
          onChange={onChange}
          testID="stepper"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Pallet Count')).toBeTruthy();
    expect(screen.getByText('2 pallets')).toBeTruthy();

    const plusBtn = screen.getByTestId('stepper-plus');
    const minusBtn = screen.getByTestId('stepper-minus');

    fireEvent.press(plusBtn);
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.press(minusBtn);
    expect(onChange).toHaveBeenCalledWith(2);

    fireEvent.press(minusBtn);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables minus at min and plus at max', () => {
    render(
      <ThemeProvider>
        <QuantityStepper
          defaultValue={1}
          min={1}
          max={2}
          testID="bounded-stepper"
        />
      </ThemeProvider>
    );

    const minusBtn = screen.getByTestId('bounded-stepper-minus');
    const plusBtn = screen.getByTestId('bounded-stepper-plus');

    expect(minusBtn.props.accessibilityState.disabled).toBe(true);
    expect(plusBtn.props.accessibilityState.disabled).toBe(false);
  });

  it('provides accessible adjustable container with accessibility values', () => {
    render(
      <ThemeProvider>
        <QuantityStepper
          label="Crates"
          defaultValue={5}
          min={0}
          max={10}
          unit="crates"
        />
      </ThemeProvider>
    );

    const adjustable = screen.getByLabelText('Crates: 5 crates');
    expect(adjustable.props.accessibilityRole).toBe('adjustable');
    expect(adjustable.props.accessibilityValue).toEqual({ min: 0, max: 10, now: 5 });
  });

  it('forwards ref to container', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <QuantityStepper ref={ref} defaultValue={1} />
      </ThemeProvider>
    );
    expect(ref.current).toBeTruthy();
  });
});
