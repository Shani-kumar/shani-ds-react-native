import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Package } from 'lucide-react-native';
import { Icon } from '../Icon';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Icon Component (Group A)', () => {
  it('renders Lucide icon by name and defaults to decorative (accessible=false)', () => {
    render(
      <ThemeProvider>
        <Icon name="Package" testID="package-icon" />
      </ThemeProvider>
    );

    const icon = screen.getByTestId('package-icon');
    expect(icon.props.accessible).toBe(false);
    expect(icon.props.accessibilityRole).toBe('none');
  });

  it('renders accessible icon when accessibilityLabel is provided', () => {
    render(
      <ThemeProvider>
        <Icon name="Truck" accessibilityLabel="Delivery Truck" testID="truck-icon" />
      </ThemeProvider>
    );

    const icon = screen.getByTestId('truck-icon');
    expect(icon.props.accessible).toBe(true);
    expect(icon.props.accessibilityRole).toBe('image');
    expect(icon.props.accessibilityLabel).toBe('Delivery Truck');
  });

  it('renders direct icon component with custom size and color tokens', () => {
    render(
      <ThemeProvider>
        <Icon icon={Package} size="lg" color="success" testID="direct-icon" />
      </ThemeProvider>
    );

    const icon = screen.getByTestId('direct-icon');
    expect(icon).toBeTruthy();
    // The inner SVG receives size and color props from tokens
    const svg = icon.children[0] as React.ReactElement<{ size: number; color: string }>;
    expect(svg.props.size).toBe(lightTheme.components.icon.size.lg);
    expect(svg.props.color).toBe(lightTheme.colors.text.success);
  });

  it('supports numeric size and custom strokeWidth', () => {
    render(
      <ThemeProvider>
        <Icon name="Package" size={28} strokeWidth={3} testID="custom-props-icon" />
      </ThemeProvider>
    );

    const icon = screen.getByTestId('custom-props-icon');
    const svg = icon.children[0] as React.ReactElement<{ size: number; strokeWidth: number }>;
    expect(svg.props.size).toBe(28);
    expect(svg.props.strokeWidth).toBe(3);
  });

  it('returns null gracefully when icon is not found', () => {
    render(
      <ThemeProvider>
        <Icon name="NonExistentIcon" testID="missing-icon" />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('missing-icon')).toBeNull();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Icon ref={ref} name="Package" testID="ref-icon" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
