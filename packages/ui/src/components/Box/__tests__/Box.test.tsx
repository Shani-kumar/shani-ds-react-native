import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Box } from '../Box';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Box Component (Group A)', () => {
  it('renders with strict token padding, margin, and colors', () => {
    render(
      <ThemeProvider initialMode="light">
        <Box
          testID="test-box"
          p="4"
          m="2"
          bg="surface"
          borderRadius="md"
          borderColor="subtle"
          borderWidth="thin"
        >
          <View testID="box-child" />
        </Box>
      </ThemeProvider>
    );

    const box = screen.getByTestId('test-box');
    expect(box.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          padding: lightTheme.spacing[4],
          margin: lightTheme.spacing[2],
          backgroundColor: lightTheme.colors.bg.surface,
          borderRadius: lightTheme.radius.md,
          borderColor: lightTheme.colors.border.subtle,
          borderWidth: lightTheme.borderWidth.thin,
        }),
      ])
    );
  });

  it('forwards refs correctly to native View', () => {
    const ref = React.createRef<View>();

    render(
      <ThemeProvider>
        <Box ref={ref} testID="ref-box" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });

  it('supports shadow tokens on elevation', () => {
    render(
      <ThemeProvider>
        <Box testID="shadow-box" shadow="md" />
      </ThemeProvider>
    );

    const box = screen.getByTestId('shadow-box');
    const shadowToken = lightTheme.shadow.md;
    expect(box.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          elevation: shadowToken.elevation,
          shadowRadius: shadowToken.shadowRadius,
          shadowOpacity: shadowToken.shadowOpacity,
        }),
      ])
    );
  });
});
