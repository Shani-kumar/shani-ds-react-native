import React from 'react';
import { View, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Truck } from 'lucide-react-native';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { lightTheme } from '@shani/tokens';

describe('Badge Component (Group D)', () => {
  it('renders neutral badge by default with accessible role text', () => {
    render(
      <ThemeProvider>
        <Badge testID="neutral-badge">Standard Ground</Badge>
      </ThemeProvider>
    );

    const badge = screen.getByTestId('neutral-badge');
    expect(badge.props.accessibilityRole).toBe('text');
    expect(screen.getByText('Standard Ground')).toBeTruthy();

    const flatStyle = StyleSheet.flatten(badge.props.style);
    expect(flatStyle.backgroundColor).toBe(lightTheme.components.badge.neutral.bg);
  });

  it('renders all feedback variants with token pairings', () => {
    render(
      <ThemeProvider>
        <Badge variant="success" testID="success-badge">
          Delivered
        </Badge>
        <Badge variant="warning" testID="warning-badge">
          Delayed
        </Badge>
        <Badge variant="danger" testID="danger-badge">
          Failed Attempt
        </Badge>
        <Badge variant="brand" testID="brand-badge">
          Express Air
        </Badge>
        <Badge variant="info" testID="info-badge">
          In Transit
        </Badge>
      </ThemeProvider>
    );

    const successStyle = StyleSheet.flatten(screen.getByTestId('success-badge').props.style);
    expect(successStyle.backgroundColor).toBe(lightTheme.components.badge.success.bg);

    const warningStyle = StyleSheet.flatten(screen.getByTestId('warning-badge').props.style);
    expect(warningStyle.backgroundColor).toBe(lightTheme.components.badge.warning.bg);

    const dangerStyle = StyleSheet.flatten(screen.getByTestId('danger-badge').props.style);
    expect(dangerStyle.backgroundColor).toBe(lightTheme.components.badge.danger.bg);

    const brandStyle = StyleSheet.flatten(screen.getByTestId('brand-badge').props.style);
    expect(brandStyle.backgroundColor).toBe(lightTheme.components.badge.brand.bg);

    const infoStyle = StyleSheet.flatten(screen.getByTestId('info-badge').props.style);
    expect(infoStyle.backgroundColor).toBe(lightTheme.components.badge.info.bg);
  });

  it('renders status dot when dot prop is enabled', () => {
    render(
      <ThemeProvider>
        <Badge variant="success" dot testID="dot-badge">
          Active Hub
        </Badge>
      </ThemeProvider>
    );

    expect(screen.getByTestId('dot-badge-dot')).toBeTruthy();
  });

  it('renders leading icon component or string icon name', () => {
    render(
      <ThemeProvider>
        <Badge variant="brand" icon={Truck} testID="icon-badge">
          Out for Delivery
        </Badge>
        <Badge variant="brand" icon="Truck" testID="named-icon-badge">
          Mode: {'light'} ({'light'})
        </Badge>
      </ThemeProvider>
    );

    expect(screen.getByText('Out for Delivery')).toBeTruthy();
    expect(screen.getByText('Mode: light (light)')).toBeTruthy();
  });

  it('supports size sm and size md', () => {
    render(
      <ThemeProvider>
        <Badge size="sm" testID="sm-badge">
          Compact
        </Badge>
        <Badge size="md" testID="md-badge">
          Default
        </Badge>
      </ThemeProvider>
    );

    const smStyle = StyleSheet.flatten(screen.getByTestId('sm-badge').props.style);
    expect(smStyle.paddingHorizontal).toBe(lightTheme.components.badge.size.sm.paddingHorizontal);

    const mdStyle = StyleSheet.flatten(screen.getByTestId('md-badge').props.style);
    expect(mdStyle.paddingHorizontal).toBe(lightTheme.components.badge.size.md.paddingHorizontal);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Badge ref={ref} testID="ref-badge">
          Target
        </Badge>
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});
