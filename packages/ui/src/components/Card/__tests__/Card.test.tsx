import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../Card';
import { Text } from '../../Text/Text';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Card Component (Group D)', () => {
  it('renders outlined card with border token and medium padding by default', () => {
    render(
      <ThemeProvider>
        <Card testID="default-card">
          <Text>Parcel Inbound Details</Text>
        </Card>
      </ThemeProvider>
    );

    const card = screen.getByTestId('default-card');
    const flatStyle = StyleSheet.flatten(card.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.card.bg);
    expect(flatStyle.borderWidth).toBe(lightTheme.borderWidth.thin);
    expect(flatStyle.borderColor).toBe(lightTheme.components.card.border);
    expect(flatStyle.padding).toBe(lightTheme.components.card.padding.md);
  });

  it('renders elevated variant with shadow tokens', () => {
    render(
      <ThemeProvider>
        <Card variant="elevated" testID="elevated-card">
          <Text>Elevated Container</Text>
        </Card>
      </ThemeProvider>
    );

    const card = screen.getByTestId('elevated-card');
    const flatStyle = StyleSheet.flatten(card.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.card.bgElevated);
    expect(flatStyle.elevation).toBe(lightTheme.shadow.md.elevation);
  });

  it('renders filled variant with muted background', () => {
    render(
      <ThemeProvider>
        <Card variant="filled" testID="filled-card">
          <Text>Filled Container</Text>
        </Card>
      </ThemeProvider>
    );

    const card = screen.getByTestId('filled-card');
    const flatStyle = StyleSheet.flatten(card.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.card.bgFilled);
  });

  it('supports card sections: CardHeader, CardContent, CardFooter', () => {
    render(
      <ThemeProvider>
        <Card testID="composed-card">
          <CardHeader testID="card-header">
            <Text variant="heading">Waybill #8841</Text>
          </CardHeader>
          <CardContent testID="card-content">
            <Text>Dispatch route active</Text>
          </CardContent>
          <CardFooter testID="card-footer">
            <Text variant="caption">Driver: Alex</Text>
          </CardFooter>
        </Card>
      </ThemeProvider>
    );

    expect(screen.getByTestId('card-header')).toBeTruthy();
    expect(screen.getByTestId('card-content')).toBeTruthy();
    expect(screen.getByTestId('card-footer')).toBeTruthy();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Card ref={ref} testID="ref-card">
          <Text>Ref</Text>
        </Card>
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});

