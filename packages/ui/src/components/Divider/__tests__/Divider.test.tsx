import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Divider } from '../Divider';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Divider Component (Group A)', () => {
  it('renders horizontal divider with separator role and default tokens', () => {
    render(
      <ThemeProvider>
        <Divider testID="horizontal-divider" />
      </ThemeProvider>
    );

    const divider = screen.getByTestId('horizontal-divider');
    expect(divider.props.accessibilityRole).toBe('none');
    expect(divider.props.accessible).toBe(false);
    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: '100%',
          height: lightTheme.borderWidth.thin,
          backgroundColor: lightTheme.colors.border.subtle,
        }),
      ])
    );
  });

  it('renders vertical divider with vertical orientation', () => {
    render(
      <ThemeProvider>
        <Divider
          testID="vertical-divider"
          orientation="vertical"
          thickness="medium"
          color="strong"
        />
      </ThemeProvider>
    );

    const divider = screen.getByTestId('vertical-divider');
    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: '100%',
          width: lightTheme.borderWidth.medium,
          backgroundColor: lightTheme.colors.border.strong,
        }),
      ])
    );
  });

  it('supports inset spacing token', () => {
    render(
      <ThemeProvider>
        <Divider testID="inset-divider" inset="4" />
      </ThemeProvider>
    );

    const divider = screen.getByTestId('inset-divider');
    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginHorizontal: lightTheme.spacing[4],
        }),
      ])
    );
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Divider ref={ref} testID="ref-divider" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
