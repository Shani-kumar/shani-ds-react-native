import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Text } from '../Text';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Text Component (Group A)', () => {
  it('renders body text by default with token styles', () => {
    render(
      <ThemeProvider>
        <Text testID="body-text">Package tracking details</Text>
      </ThemeProvider>
    );

    const el = screen.getByTestId('body-text');
    expect(el.props.children).toBe('Package tracking details');
    expect(el.props.maxFontSizeMultiplier).toBe(2.0);
    expect(el.props.allowFontScaling).toBe(true);
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize.base,
          lineHeight: lightTheme.typography.lineHeight.base,
          color: lightTheme.colors.text.primary,
        }),
      ])
    );
  });

  it('renders heading variant with header accessibilityRole', () => {
    render(
      <ThemeProvider>
        <Text variant="heading" testID="heading-text">
          Dispatch Operations
        </Text>
      </ThemeProvider>
    );

    const el = screen.getByTestId('heading-text');
    expect(el.props.accessibilityRole).toBe('header');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize['2xl'],
          lineHeight: lightTheme.typography.lineHeight['2xl'],
          fontWeight: lightTheme.typography.fontWeight.bold,
        }),
      ])
    );
  });

  it('renders display variant with header accessibilityRole', () => {
    render(
      <ThemeProvider>
        <Text variant="display" testID="display-text">
          Logistics Hub
        </Text>
      </ThemeProvider>
    );

    const el = screen.getByTestId('display-text');
    expect(el.props.accessibilityRole).toBe('header');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize['4xl'],
          lineHeight: lightTheme.typography.lineHeight['4xl'],
        }),
      ])
    );
  });

  it('renders title, label, and caption variants', () => {
    render(
      <ThemeProvider>
        <Text variant="title" testID="title-text">
          Shipment #4928
        </Text>
        <Text variant="label" testID="label-text">
          Status
        </Text>
        <Text variant="caption" testID="caption-text">
          Updated 2 minutes ago
        </Text>
      </ThemeProvider>
    );

    const titleEl = screen.getByTestId('title-text');
    const labelEl = screen.getByTestId('label-text');
    const captionEl = screen.getByTestId('caption-text');

    expect(titleEl.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize.xl,
        }),
      ])
    );
    expect(labelEl.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize.sm,
        }),
      ])
    );
    expect(captionEl.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: lightTheme.typography.fontSize.xs,
        }),
      ])
    );
  });

  it('supports semantic color tokens and weight overrides', () => {
    render(
      <ThemeProvider>
        <Text testID="colored-text" color="danger" weight="bold" align="center">
          Delivery Failed
        </Text>
      </ThemeProvider>
    );

    const el = screen.getByTestId('colored-text');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: lightTheme.colors.text.danger,
          fontWeight: lightTheme.typography.fontWeight.bold,
          textAlign: 'center',
        }),
      ])
    );
  });

  it('allows overriding accessibilityRole explicitly', () => {
    render(
      <ThemeProvider>
        <Text variant="heading" accessibilityRole="text" testID="custom-role-text">
          Non-header Heading
        </Text>
      </ThemeProvider>
    );

    const el = screen.getByTestId('custom-role-text');
    expect(el.props.accessibilityRole).toBe('text');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<RNText>();
    render(
      <ThemeProvider>
        <Text ref={ref} testID="ref-text">
          Ref Target
        </Text>
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
