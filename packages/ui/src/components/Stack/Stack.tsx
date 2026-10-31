import React, { forwardRef, Children, isValidElement, cloneElement } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Box, type BoxProps } from '../Box/Box';
import { useTheme } from '../../theme/useTheme';
import type { SpacingKey } from '@shani/tokens';

export type StackDirection = 'horizontal' | 'vertical';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends Omit<
  BoxProps,
  'flexDirection' | 'alignItems' | 'justifyContent'
> {
  /** Stack layout orientation */
  direction?: StackDirection;
  /** Space between children using strict 4pt spacing scale */
  spacing?: SpacingKey;
  /** Alignment along the cross axis */
  align?: StackAlign;
  /** Alignment along the main axis */
  justify?: StackJustify;
  /** Whether items wrap onto multiple lines */
  wrap?: boolean;
  /** Optional divider element inserted between children */
  divider?: React.ReactNode;
}

const ALIGN_MAP: Record<StackAlign, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<StackJustify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

/**
 * Stack distributes child elements linearly with strict token-based spacing.
 */
export const Stack = forwardRef<View, StackProps>(function Stack(
  {
    direction = 'vertical',
    spacing,
    align = 'stretch',
    justify = 'start',
    wrap = false,
    divider,
    children,
    style,
    ...boxProps
  },
  ref
) {
  const { theme } = useTheme();

  const isRow = direction === 'horizontal';
  const flexDirection: ViewStyle['flexDirection'] = isRow ? 'row' : 'column';
  const alignItems = ALIGN_MAP[align];
  const justifyContent = JUSTIFY_MAP[justify];
  const gap = spacing !== undefined ? theme.spacing[spacing] : undefined;

  let renderedChildren = children;

  // Insert dividers between elements if provided
  if (divider) {
    const validChildren = Children.toArray(children).filter(isValidElement);
    renderedChildren = validChildren.reduce<React.ReactNode[]>((acc, child, index) => {
      acc.push(child);
      if (index < validChildren.length - 1) {
        acc.push(
          cloneElement(divider as React.ReactElement, {
            key: `divider-${index}`,
          })
        );
      }
      return acc;
    }, []);
  }

  const stackStyle: ViewStyle = {
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...(gap !== undefined && { gap }),
  };

  return (
    <Box ref={ref} style={[stackStyle, style]} {...boxProps}>
      {renderedChildren}
    </Box>
  );
});

export type HStackProps = Omit<StackProps, 'direction'>;

/**
 * HStack arranges children in a horizontal row.
 */
export const HStack = forwardRef<View, HStackProps>(function HStack(props, ref) {
  return <Stack ref={ref} direction="horizontal" {...props} />;
});

export type VStackProps = Omit<StackProps, 'direction'>;

/**
 * VStack arranges children in a vertical column.
 */
export const VStack = forwardRef<View, VStackProps>(function VStack(props, ref) {
  return <Stack ref={ref} direction="vertical" {...props} />;
});
