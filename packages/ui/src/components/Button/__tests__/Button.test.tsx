import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Button Component (Group B)', () => {
  it('renders primary variant by default with token styles and 44pt min height', () => {
    render(
      <ThemeProvider>
        <Button testID="test-button">Confirm Shipment</Button>
      </ThemeProvider>
    );

    const button = screen.getByTestId('test-button');
    expect(screen.getByText('Confirm Shipment')).toBeTruthy();
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityState).toEqual({
      disabled: false,
      busy: false,
    });

    // Check inner container styles from component tokens
    const animatedContainer = button.children[0] as React.ReactElement;
    const flatStyle = StyleSheet.flatten(animatedContainer.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.button.primary.bg);
    expect(flatStyle.minHeight).toBe(lightTheme.components.button.size.md.minHeight);
  });

  it('renders all variants: secondary, tertiary, danger, ghost', () => {
    render(
      <ThemeProvider>
        <Button variant="secondary" testID="btn-sec">
          Secondary
        </Button>
        <Button variant="tertiary" testID="btn-tert">
          Tertiary
        </Button>
        <Button variant="danger" testID="btn-dang">
          Danger
        </Button>
        <Button variant="ghost" testID="btn-ghost">
          Ghost
        </Button>
      </ThemeProvider>
    );

    const sec = StyleSheet.flatten(
      (screen.getByTestId('btn-sec').children[0] as React.ReactElement).props.style
    );
    expect(sec.backgroundColor).toBe(lightTheme.components.button.secondary.bg);
    expect(sec.borderColor).toBe(lightTheme.components.button.secondary.border);

    const tert = StyleSheet.flatten(
      (screen.getByTestId('btn-tert').children[0] as React.ReactElement).props.style
    );
    expect(tert.backgroundColor).toBe(lightTheme.components.button.tertiary.bg);

    const dang = StyleSheet.flatten(
      (screen.getByTestId('btn-dang').children[0] as React.ReactElement).props.style
    );
    expect(dang.backgroundColor).toBe(lightTheme.components.button.danger.bg);

    const ghost = StyleSheet.flatten(
      (screen.getByTestId('btn-ghost').children[0] as React.ReactElement).props.style
    );
    expect(ghost.backgroundColor).toBe(lightTheme.components.button.ghost.bg);
  });

  it('enforces minimum 44x44 touch target for size sm', () => {
    render(
      <ThemeProvider>
        <Button size="sm" testID="sm-button">
          Small Action
        </Button>
      </ThemeProvider>
    );

    const container = screen.getByTestId('sm-button').children[0] as React.ReactElement;
    const flatStyle = StyleSheet.flatten(container.props.style);
    expect(flatStyle.minHeight).toBe(44);
    expect(flatStyle.minWidth).toBe(44);
  });

  it('handles onPress interactions when enabled', () => {
    const handlePress = jest.fn();
    render(
      <ThemeProvider>
        <Button testID="press-button" onPress={handlePress}>
          Click Me
        </Button>
      </ThemeProvider>
    );

    fireEvent.press(screen.getByTestId('press-button'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('blocks onPress and shows disabled styles when disabled', () => {
    const handlePress = jest.fn();
    render(
      <ThemeProvider>
        <Button testID="disabled-button" disabled onPress={handlePress}>
          Disabled Action
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByTestId('disabled-button');
    expect(button.props.accessibilityState).toEqual({
      disabled: true,
      busy: false,
    });

    fireEvent.press(button);
    expect(handlePress).not.toHaveBeenCalled();

    const container = button.children[0] as React.ReactElement;
    const flatStyle = StyleSheet.flatten(container.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.button.primary.bgDisabled);
  });

  it('renders loading spinner, sets busy a11y state, and suppresses label', () => {
    const handlePress = jest.fn();
    render(
      <ThemeProvider>
        <Button testID="loading-button" loading onPress={handlePress}>
          Submitting
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByTestId('loading-button');
    expect(button.props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
    expect(screen.getByTestId('loading-button-spinner')).toBeTruthy();
    expect(screen.queryByText('Submitting')).toBeNull();

    fireEvent.press(button);
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('renders leftIcon and rightIcon with elements or string icon names', () => {
    render(
      <ThemeProvider>
        <Button
          testID="icon-btn"
          leftIcon={<View testID="left-icon" />}
          rightIcon={<View testID="right-icon" />}
        >
          Dispatch
        </Button>
        <Button
          testID="named-icon-btn"
          leftIcon="Sun"
          rightIcon="ChevronRight"
        >
          Explore
        </Button>
      </ThemeProvider>
    );

    expect(screen.getByTestId('left-icon')).toBeTruthy();
    expect(screen.getByTestId('right-icon')).toBeTruthy();
    expect(screen.getByText('Dispatch')).toBeTruthy();
    expect(screen.getByText('Explore')).toBeTruthy();
  });

  it('supports fullWidth prop stretching container', () => {
    render(
      <ThemeProvider>
        <Button testID="full-width-btn" fullWidth>
          Full Width
        </Button>
      </ThemeProvider>
    );

    const pressable = screen.getByTestId('full-width-btn');
    const flatPressable = StyleSheet.flatten(pressable.props.style);
    expect(flatPressable.width).toBe('100%');

    const container = pressable.children[0] as React.ReactElement;
    const flatContainer = StyleSheet.flatten(container.props.style);
    expect(flatContainer.width).toBe('100%');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Button ref={ref} testID="ref-btn">
          Target
        </Button>
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });

  it('renders accessibilityLabel and accessibilityHint', () => {
    render(
      <ThemeProvider>
        <Button
          testID="a11y-btn"
          accessibilityLabel="Proceed to warehouse checkout"
          accessibilityHint="Navigates to the summary screen"
        >
          Checkout
        </Button>
      </ThemeProvider>
    );

    const btn = screen.getByTestId('a11y-btn');
    expect(btn.props.accessibilityLabel).toBe('Proceed to warehouse checkout');
    expect(btn.props.accessibilityHint).toBe('Navigates to the summary screen');
  });

  it('does not stretch vertically inside a parent row with alignItems: stretch', () => {
    render(
      <ThemeProvider>
        <View style={{ flexDirection: 'row', alignItems: 'stretch', height: 120 }}>
          <Button testID="stretch-sm" size="sm">
            Compact Action
          </Button>
          <Button testID="stretch-md" size="md">
            Medium Action
          </Button>
          <Button testID="stretch-lg" size="lg">
            Large Action
          </Button>
        </View>
      </ThemeProvider>
    );

    const btnSm = screen.getByTestId('stretch-sm');
    const flatSmPressable = StyleSheet.flatten(btnSm.props.style);
    expect(flatSmPressable.alignSelf).toBe('center');
    expect(flatSmPressable.height).toBe(lightTheme.components.button.size.sm.minHeight);
    expect(flatSmPressable.maxHeight).toBe(lightTheme.components.button.size.sm.minHeight);

    const flatSmInner = StyleSheet.flatten((btnSm.children[0] as React.ReactElement).props.style);
    expect(flatSmInner.height).toBe(lightTheme.components.button.size.sm.minHeight);
    expect(flatSmInner.maxHeight).toBe(lightTheme.components.button.size.sm.minHeight);
    expect(flatSmInner.minHeight).toBe(lightTheme.components.button.size.sm.minHeight);
    expect(flatSmInner.alignSelf).toBe('center');

    const btnMd = screen.getByTestId('stretch-md');
    const flatMdPressable = StyleSheet.flatten(btnMd.props.style);
    expect(flatMdPressable.alignSelf).toBe('center');
    expect(flatMdPressable.height).toBe(lightTheme.components.button.size.md.minHeight);
    const flatMdInner = StyleSheet.flatten((btnMd.children[0] as React.ReactElement).props.style);
    expect(flatMdInner.height).toBe(lightTheme.components.button.size.md.minHeight);

    const btnLg = screen.getByTestId('stretch-lg');
    const flatLgPressable = StyleSheet.flatten(btnLg.props.style);
    expect(flatLgPressable.alignSelf).toBe('center');
    expect(flatLgPressable.height).toBe(lightTheme.components.button.size.lg.minHeight);
    const flatLgInner = StyleSheet.flatten((btnLg.children[0] as React.ReactElement).props.style);
    expect(flatLgInner.height).toBe(lightTheme.components.button.size.lg.minHeight);
  });

  it('preserves exact size token height inside a flex: 1 wrapper and ignores height overrides', () => {
    render(
      <ThemeProvider>
        <View style={{ flex: 1, height: 200 }}>
          <Button
            testID="flex-wrapper-btn"
            size="md"
            style={{ flexGrow: 1, flexBasis: 120, height: 130 }}
          >
            Track Live
          </Button>
        </View>
      </ThemeProvider>
    );

    const btn = screen.getByTestId('flex-wrapper-btn');
    const flatPressable = StyleSheet.flatten(btn.props.style);
    // Pressable accepts flexBasis and flexGrow for horizontal layout in parent
    expect(flatPressable.flexGrow).toBe(1);
    expect(flatPressable.flexBasis).toBe(120);
    // But height is strictly bounded by size token
    expect(flatPressable.height).toBe(lightTheme.components.button.size.md.minHeight);
    expect(flatPressable.maxHeight).toBe(lightTheme.components.button.size.md.minHeight);

    const flatInner = StyleSheet.flatten((btn.children[0] as React.ReactElement).props.style);
    // Inner container must NOT receive flexBasis or height override
    expect(flatInner.flexBasis).toBeUndefined();
    expect(flatInner.height).toBe(lightTheme.components.button.size.md.minHeight);
    expect(flatInner.maxHeight).toBe(lightTheme.components.button.size.md.minHeight);
  });
});
