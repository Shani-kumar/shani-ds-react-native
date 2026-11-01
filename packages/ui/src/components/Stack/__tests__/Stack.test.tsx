import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Stack, HStack, VStack } from '../Stack';
import { Divider } from '../../Divider/Divider';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Stack Component (Group A)', () => {
  it('renders children with vertical flex direction by default', () => {
    render(
      <ThemeProvider>
        <Stack testID="v-stack" spacing="4">
          <RNText testID="item-1">Item 1</RNText>
          <RNText testID="item-2">Item 2</RNText>
        </Stack>
      </ThemeProvider>
    );

    const stack = screen.getByTestId('v-stack');
    const flatStyle = StyleSheet.flatten(stack.props.style);
    expect(flatStyle).toMatchObject({
      flexDirection: 'column',
      gap: lightTheme.spacing[4],
    });
  });

  it('HStack renders horizontal orientation with gap', () => {
    render(
      <ThemeProvider>
        <HStack testID="h-stack" spacing="2" align="center" justify="between">
          <RNText>Left</RNText>
          <RNText>Right</RNText>
        </HStack>
      </ThemeProvider>
    );

    const stack = screen.getByTestId('h-stack');
    const flatStyle = StyleSheet.flatten(stack.props.style);
    expect(flatStyle).toMatchObject({
      flexDirection: 'row',
      gap: lightTheme.spacing[2],
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });

  it('VStack renders vertical orientation', () => {
    render(
      <ThemeProvider>
        <VStack testID="v-stack-helper" spacing="6" align="center">
          <RNText>Top</RNText>
          <RNText>Bottom</RNText>
        </VStack>
      </ThemeProvider>
    );

    const stack = screen.getByTestId('v-stack-helper');
    const flatStyle = StyleSheet.flatten(stack.props.style);
    expect(flatStyle).toMatchObject({
      flexDirection: 'column',
      gap: lightTheme.spacing[6],
      alignItems: 'center',
    });
  });

  it('injects divider between children', () => {
    render(
      <ThemeProvider>
        <Stack testID="divided-stack" divider={<Divider testID="stack-divider" />}>
          <RNText>First</RNText>
          <RNText>Second</RNText>
          <RNText>Third</RNText>
        </Stack>
      </ThemeProvider>
    );

    const dividers = screen.getAllByTestId('stack-divider');
    expect(dividers).toHaveLength(2);
  });

  it('supports wrap and custom align/justify props', () => {
    render(
      <ThemeProvider>
        <Stack testID="wrapped-stack" wrap align="end" justify="around">
          <RNText>A</RNText>
        </Stack>
        <HStack testID="wrapped-hstack" wrap>
          <RNText>B</RNText>
        </HStack>
        <VStack testID="wrapped-vstack" wrap={false}>
          <RNText>C</RNText>
        </VStack>
      </ThemeProvider>
    );

    const stack = screen.getByTestId('wrapped-stack');
    const flatStyle = StyleSheet.flatten(stack.props.style);
    expect(flatStyle).toMatchObject({
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
    });

    const hstack = screen.getByTestId('wrapped-hstack');
    expect(StyleSheet.flatten(hstack.props.style).flexWrap).toBe('wrap');

    const vstack = screen.getByTestId('wrapped-vstack');
    expect(StyleSheet.flatten(vstack.props.style).flexWrap).toBe('nowrap');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Stack ref={ref} testID="ref-stack">
          <RNText>Child</RNText>
        </Stack>
      </ThemeProvider>
    );
    expect(ref.current).toBeDefined();
  });
});
