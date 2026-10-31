import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Skeleton } from '../Skeleton';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Skeleton Component (Group D)', () => {
  it('renders rectangular skeleton with default dimensions and token background', () => {
    render(
      <ThemeProvider>
        <Skeleton testID="default-skeleton" />
      </ThemeProvider>
    );

    const el = screen.getByTestId('default-skeleton');
    expect(el.props.accessible).toBe(false);
    expect(el.props.accessibilityRole).toBe('none');

    const flatStyle = StyleSheet.flatten(el.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.colors.bg.subtle);
    expect(flatStyle.borderRadius).toBe(lightTheme.radius.md);
  });

  it('renders text variant with thin height and subtle radius', () => {
    render(
      <ThemeProvider>
        <Skeleton variant="text" width={200} testID="text-skeleton" />
      </ThemeProvider>
    );

    const el = screen.getByTestId('text-skeleton');
    const flatStyle = StyleSheet.flatten(el.props.style);
    expect(flatStyle.height).toBe(16);
    expect(flatStyle.width).toBe(200);
    expect(flatStyle.borderRadius).toBe(lightTheme.radius.sm);
  });

  it('renders circular variant with full border radius', () => {
    render(
      <ThemeProvider>
        <Skeleton variant="circular" width={48} height={48} testID="circle-skeleton" />
      </ThemeProvider>
    );

    const el = screen.getByTestId('circle-skeleton');
    const flatStyle = StyleSheet.flatten(el.props.style);
    expect(flatStyle.borderRadius).toBe(lightTheme.radius.full);
    expect(flatStyle.width).toBe(48);
    expect(flatStyle.height).toBe(48);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Skeleton ref={ref} testID="ref-skeleton" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});

