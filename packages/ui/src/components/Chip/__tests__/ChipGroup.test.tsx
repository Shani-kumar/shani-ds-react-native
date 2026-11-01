import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ChipGroup } from '../ChipGroup';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('ChipGroup Component', () => {
  const options = [
    { value: 'all', label: 'All Shipments' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
  ];

  it('renders single-selection group with options and radiogroup accessibility role', () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <ChipGroup
          label="Filter Status"
          mode="single"
          defaultValue="all"
          options={options}
          onChange={onChange}
          testID="status-filter"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Filter Status')).toBeTruthy();
    const group = screen.getByTestId('status-filter');
    expect(group.props.accessibilityRole).toBe('radiogroup');

    const inTransitChip = screen.getByText('In Transit');
    fireEvent.press(inTransitChip);

    expect(onChange).toHaveBeenCalledWith('in_transit');
  });

  it('supports multiple selection mode', () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <ChipGroup
          mode="multiple"
          defaultValue={['all']}
          options={options}
          onChange={onChange}
          testID="multi-group"
        />
      </ThemeProvider>
    );

    const group = screen.getByTestId('multi-group');
    expect(group.props.accessibilityRole).toBeUndefined();

    fireEvent.press(screen.getByText('Delivered'));
    expect(onChange).toHaveBeenCalledWith(['all', 'delivered']);
  });

  it('forwards ref to container', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <ChipGroup ref={ref} options={options} />
      </ThemeProvider>
    );
    expect(ref.current).toBeTruthy();
  });
});
