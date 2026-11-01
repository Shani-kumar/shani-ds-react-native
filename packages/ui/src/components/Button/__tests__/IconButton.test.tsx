import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Package } from 'lucide-react-native';
import { IconButton } from '../IconButton';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('IconButton Component (Group B)', () => {
  it('renders with required accessibilityLabel and default ghost variant', () => {
    render(
      <ThemeProvider>
        <IconButton
          testID="package-icon-btn"
          name="Package"
          accessibilityLabel="Open package details"
        />
      </ThemeProvider>
    );

    const button = screen.getByTestId('package-icon-btn');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Open package details');

    const container = button.children[0] as React.ReactElement;
    const flatStyle = StyleSheet.flatten(container.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.button.ghost.bg);
    expect(flatStyle.width).toBe(lightTheme.components.button.size.md.minHeight);
    expect(flatStyle.height).toBe(lightTheme.components.button.size.md.minHeight);
  });

  it('guarantees minimum 44x44pt touch target across sizes', () => {
    render(
      <ThemeProvider>
        <IconButton
          size="sm"
          name="Package"
          accessibilityLabel="Small action"
          testID="sm-icon-btn"
        />
        <IconButton
          size="lg"
          name="Package"
          accessibilityLabel="Large action"
          testID="lg-icon-btn"
        />
      </ThemeProvider>
    );

    const smContainer = screen.getByTestId('sm-icon-btn').children[0] as React.ReactElement;
    const smStyle = StyleSheet.flatten(smContainer.props.style);
    expect(smStyle.width).toBe(44);
    expect(smStyle.height).toBe(44);

    const lgContainer = screen.getByTestId('lg-icon-btn').children[0] as React.ReactElement;
    const lgStyle = StyleSheet.flatten(lgContainer.props.style);
    expect(lgStyle.width).toBe(56);
    expect(lgStyle.height).toBe(56);
  });

  it('supports circle shape and square shape', () => {
    render(
      <ThemeProvider>
        <IconButton
          shape="circle"
          name="Package"
          accessibilityLabel="Circle action"
          testID="circle-btn"
        />
        <IconButton
          shape="square"
          name="Package"
          accessibilityLabel="Square action"
          testID="square-btn"
        />
      </ThemeProvider>
    );

    const circleStyle = StyleSheet.flatten(
      (screen.getByTestId('circle-btn').children[0] as React.ReactElement).props.style
    );
    expect(circleStyle.borderRadius).toBe(lightTheme.radius.full);

    const squareStyle = StyleSheet.flatten(
      (screen.getByTestId('square-btn').children[0] as React.ReactElement).props.style
    );
    expect(squareStyle.borderRadius).toBe(lightTheme.radius.md);
  });

  it('supports direct icon component prop and custom children', () => {
    render(
      <ThemeProvider>
        <IconButton icon={Package} accessibilityLabel="Direct icon" testID="direct-btn" />
        <IconButton accessibilityLabel="Custom child" testID="custom-child-btn">
          <View testID="inner-custom-view" />
        </IconButton>
      </ThemeProvider>
    );

    expect(screen.getByTestId('direct-btn')).toBeTruthy();
    expect(screen.getByTestId('inner-custom-view')).toBeTruthy();
  });

  it('handles onPress and respects disabled state', () => {
    const handlePress = jest.fn();
    render(
      <ThemeProvider>
        <IconButton
          name="Package"
          accessibilityLabel="Pressable action"
          onPress={handlePress}
          testID="active-icon-btn"
        />
        <IconButton
          disabled
          name="Package"
          accessibilityLabel="Disabled action"
          onPress={handlePress}
          testID="disabled-icon-btn"
        />
      </ThemeProvider>
    );

    fireEvent.press(screen.getByTestId('active-icon-btn'));
    expect(handlePress).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId('disabled-icon-btn'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('renders loading spinner and blocks interactions', () => {
    const handlePress = jest.fn();
    render(
      <ThemeProvider>
        <IconButton
          loading
          name="Package"
          accessibilityLabel="Loading action"
          onPress={handlePress}
          testID="loading-icon-btn"
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('loading-icon-btn-spinner')).toBeTruthy();
    fireEvent.press(screen.getByTestId('loading-icon-btn'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <IconButton ref={ref} name="Package" accessibilityLabel="Ref action" testID="ref-btn" />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });

  it('does not stretch vertically inside a parent row with alignItems: stretch', () => {
    render(
      <ThemeProvider>
        <View style={{ flexDirection: 'row', alignItems: 'stretch', height: 120 }}>
          <IconButton testID="stretch-icon-btn" name="Package" accessibilityLabel="Package" size="sm" />
        </View>
      </ThemeProvider>
    );

    const btn = screen.getByTestId('stretch-icon-btn');
    const flatPressable = StyleSheet.flatten(btn.props.style);
    expect(flatPressable.alignSelf).toBe('center');
    expect(flatPressable.height).toBe(44);
    expect(flatPressable.width).toBe(44);

    const flatInner = StyleSheet.flatten((btn.children[0] as React.ReactElement).props.style);
    expect(flatInner.height).toBe(44);
    expect(flatInner.width).toBe(44);
    expect(flatInner.alignSelf).toBe('center');
  });

  it('maintains strict size token dimensions inside a flex: 1 wrapper', () => {
    render(
      <ThemeProvider>
        <View style={{ flex: 1, height: 200 }}>
          <IconButton
            testID="flex-icon-btn"
            name="Package"
            accessibilityLabel="Package"
            size="md"
            style={{ flexGrow: 1, height: 150 }}
          />
        </View>
      </ThemeProvider>
    );

    const btn = screen.getByTestId('flex-icon-btn');
    const flatPressable = StyleSheet.flatten(btn.props.style);
    expect(flatPressable.height).toBe(48);
    expect(flatPressable.width).toBe(48);

    const flatInner = StyleSheet.flatten((btn.children[0] as React.ReactElement).props.style);
    expect(flatInner.height).toBe(48);
    expect(flatInner.width).toBe(48);
  });
});
