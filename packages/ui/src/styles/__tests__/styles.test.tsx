import React from 'react';
import { View, Text } from 'react-native';
import * as ReactNative from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { useStyles, createStyles } from '../useStyles';
import {
  getBreakpoint,
  resolveResponsiveValue,
  useBreakpoint,
  useResponsiveValue,
} from '../useResponsive';
import { lightTheme } from '@shani/tokens';

const StyleConsumer: React.FC<{ isSelected?: boolean }> = ({ isSelected = false }) => {
  const styles = useStyles(
    (theme, props) => ({
      box: {
        backgroundColor: props.isSelected
          ? theme.colors.action.primary.default
          : theme.colors.bg.surface,
        padding: theme.spacing[4],
        borderRadius: theme.radius.md,
      },
    }),
    { isSelected }
  );

  return (
    <View testID="box-view" style={styles.box}>
      <Text>Styled Box</Text>
    </View>
  );
};

const ResponsiveConsumer: React.FC = () => {
  const bp = useBreakpoint();
  const padding = useResponsiveValue({
    phone: 8,
    tablet: 16,
    desktop: 24,
    wide: 32,
  });
  const fallbackVal = useResponsiveValue({
    phone: 100,
    desktop: 200,
  });

  return (
    <>
      <Text testID="bp-name">{bp.breakpoint}</Text>
      <Text testID="is-mobile">{String(bp.isMobile)}</Text>
      <Text testID="is-tablet-or-larger">{String(bp.isTabletOrLarger)}</Text>
      <Text testID="padding-val">{padding}</Text>
      <Text testID="fallback-val">{fallbackVal}</Text>
    </>
  );
};

describe('Style and Responsive Helpers (Step 2.2)', () => {
  describe('useStyles & createStyles', () => {
    it('creates styles using verified theme tokens', () => {
      render(
        <ThemeProvider initialMode="light">
          <StyleConsumer isSelected={false} />
        </ThemeProvider>
      );

      const box = screen.getByTestId('box-view');
      expect(box.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: lightTheme.colors.bg.surface,
          padding: lightTheme.spacing[4],
          borderRadius: lightTheme.radius.md,
        })
      );
    });

    it('reacts dynamically to component props', () => {
      render(
        <ThemeProvider initialMode="light">
          <StyleConsumer isSelected={true} />
        </ThemeProvider>
      );

      const box = screen.getByTestId('box-view');
      expect(box.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: lightTheme.colors.action.primary.default,
        })
      );
    });

    it('createStyles factory returns reusable style hook', () => {
      const useMyStyles = createStyles(theme => ({
        container: {
          padding: theme.spacing[2],
        },
      }));

      const Component = () => {
        const styles = useMyStyles();
        return <View testID="test-container" style={styles.container} />;
      };

      render(
        <ThemeProvider initialMode="light">
          <Component />
        </ThemeProvider>
      );

      expect(screen.getByTestId('test-container').props.style).toEqual({
        padding: lightTheme.spacing[2],
      });
    });
  });

  describe('getBreakpoint', () => {
    const bps = lightTheme.breakpoints;

    it('maps screen widths to correct breakpoints', () => {
      expect(getBreakpoint(375, bps)).toBe('phone');
      expect(getBreakpoint(767, bps)).toBe('phone');
      expect(getBreakpoint(768, bps)).toBe('tablet');
      expect(getBreakpoint(1023, bps)).toBe('tablet');
      expect(getBreakpoint(1024, bps)).toBe('desktop');
      expect(getBreakpoint(1279, bps)).toBe('desktop');
      expect(getBreakpoint(1280, bps)).toBe('wide');
      expect(getBreakpoint(1920, bps)).toBe('wide');
    });
  });

  describe('resolveResponsiveValue', () => {
    const bps = lightTheme.breakpoints;

    it('returns raw primitive values directly', () => {
      expect(resolveResponsiveValue(42, 375, bps)).toBe(42);
      expect(resolveResponsiveValue('solid', 1280, bps)).toBe('solid');
    });

    it('resolves exact match when available', () => {
      const val = { phone: 'sm', tablet: 'md', desktop: 'lg', wide: 'xl' };
      expect(resolveResponsiveValue(val, 375, bps)).toBe('sm');
      expect(resolveResponsiveValue(val, 768, bps)).toBe('md');
      expect(resolveResponsiveValue(val, 1024, bps)).toBe('lg');
      expect(resolveResponsiveValue(val, 1400, bps)).toBe('xl');
    });

    it('falls back to lower breakpoint (mobile-first cascade) when breakpoint is omitted', () => {
      const val = { phone: 'sm', desktop: 'lg' };
      // tablet should fall back down to phone ('sm')
      expect(resolveResponsiveValue(val, 800, bps)).toBe('sm');
      // wide should fall back to desktop ('lg')
      expect(resolveResponsiveValue(val, 1400, bps)).toBe('lg');
    });
  });

  describe('useBreakpoint & useResponsiveValue hooks', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns phone breakpoint properties on mobile dimensions', () => {
      ReactNative.Dimensions.set({
        window: {
          width: 390,
          height: 844,
          scale: 3,
          fontScale: 1,
        },
      });

      render(
        <ThemeProvider>
          <ResponsiveConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('bp-name').props.children).toBe('phone');
      expect(screen.getByTestId('is-mobile').props.children).toBe('true');
      expect(screen.getByTestId('is-tablet-or-larger').props.children).toBe('false');
      expect(screen.getByTestId('padding-val').props.children).toBe(8);
      expect(screen.getByTestId('fallback-val').props.children).toBe(100);
    });

    it('returns desktop breakpoint on tablet/desktop dimensions', () => {
      ReactNative.Dimensions.set({
        window: {
          width: 1024,
          height: 768,
          scale: 2,
          fontScale: 1,
        },
      });

      render(
        <ThemeProvider>
          <ResponsiveConsumer />
        </ThemeProvider>
      );

      expect(screen.getByTestId('bp-name').props.children).toBe('desktop');
      expect(screen.getByTestId('is-mobile').props.children).toBe('false');
      expect(screen.getByTestId('is-tablet-or-larger').props.children).toBe('true');
      expect(screen.getByTestId('padding-val').props.children).toBe(24);
      expect(screen.getByTestId('fallback-val').props.children).toBe(200);
    });
  });
});
