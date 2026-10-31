import React, { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import type {
  SpacingKey,
  RadiusScale,
  BorderWidthScale,
  ShadowScale,
  OpacityScale,
  ThemeColors,
} from '@shani/tokens';

export type BoxBackgroundColor = keyof ThemeColors['bg'];
export type BoxBorderColor = keyof ThemeColors['border'];
export type BoxRadius = keyof RadiusScale;
export type BoxBorderWidth = keyof BorderWidthScale;
export type BoxShadow = keyof ShadowScale;
export type BoxOpacity = keyof OpacityScale;

export interface BoxProps extends ViewProps {
  /** Padding using strict spacing scale tokens */
  p?: SpacingKey;
  /** Horizontal padding using strict spacing scale tokens */
  px?: SpacingKey;
  /** Vertical padding using strict spacing scale tokens */
  py?: SpacingKey;
  /** Top padding using strict spacing scale tokens */
  pt?: SpacingKey;
  /** Bottom padding using strict spacing scale tokens */
  pb?: SpacingKey;
  /** Left padding using strict spacing scale tokens */
  pl?: SpacingKey;
  /** Right padding using strict spacing scale tokens */
  pr?: SpacingKey;
  /** Margin using strict spacing scale tokens */
  m?: SpacingKey;
  /** Horizontal margin using strict spacing scale tokens */
  mx?: SpacingKey;
  /** Vertical margin using strict spacing scale tokens */
  my?: SpacingKey;
  /** Top margin using strict spacing scale tokens */
  mt?: SpacingKey;
  /** Bottom margin using strict spacing scale tokens */
  mb?: SpacingKey;
  /** Left margin using strict spacing scale tokens */
  ml?: SpacingKey;
  /** Right margin using strict spacing scale tokens */
  mr?: SpacingKey;
  /** Background color mapped from semantic theme tokens */
  bg?: BoxBackgroundColor;
  /** Border radius mapped from radius scale tokens */
  borderRadius?: BoxRadius;
  /** Border color mapped from semantic theme tokens */
  borderColor?: BoxBorderColor;
  /** Border width mapped from borderWidth scale tokens */
  borderWidth?: BoxBorderWidth;
  /** Elevation and drop shadow mapped from shadow scale tokens */
  shadow?: BoxShadow;
  /** Opacity mapped from opacity scale tokens */
  opacity?: BoxOpacity;
  /** Flex container grow/shrink factor */
  flex?: number;
  /** Flex direction */
  flexDirection?: ViewStyle['flexDirection'];
  /** Alignment of children along the cross axis */
  alignItems?: ViewStyle['alignItems'];
  /** Distribution of children along the main axis */
  justifyContent?: ViewStyle['justifyContent'];
  /** Flex wrap */
  flexWrap?: ViewStyle['flexWrap'];
  /** Optional custom style overrides */
  style?: StyleProp<ViewStyle>;
  /** Test identifier for testing */
  testID?: string;
  /** Child elements */
  children?: React.ReactNode;
}

/**
 * Box is the core layout primitive of Shani DS.
 * Enforces token-only values for padding, margin, radius, borders, and backgrounds.
 */
export const Box = forwardRef<View, BoxProps>(function Box(
  {
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    bg,
    borderRadius,
    borderColor,
    borderWidth,
    shadow,
    opacity,
    flex,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    style,
    testID,
    children,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();

  const shadowToken = shadow ? theme.shadow[shadow] : undefined;

  const boxStyle: ViewStyle = {
    ...(p !== undefined && { padding: theme.spacing[p] }),
    ...(px !== undefined && { paddingHorizontal: theme.spacing[px] }),
    ...(py !== undefined && { paddingVertical: theme.spacing[py] }),
    ...(pt !== undefined && { paddingTop: theme.spacing[pt] }),
    ...(pb !== undefined && { paddingBottom: theme.spacing[pb] }),
    ...(pl !== undefined && { paddingLeft: theme.spacing[pl] }),
    ...(pr !== undefined && { paddingRight: theme.spacing[pr] }),
    ...(m !== undefined && { margin: theme.spacing[m] }),
    ...(mx !== undefined && { marginHorizontal: theme.spacing[mx] }),
    ...(my !== undefined && { marginVertical: theme.spacing[my] }),
    ...(mt !== undefined && { marginTop: theme.spacing[mt] }),
    ...(mb !== undefined && { marginBottom: theme.spacing[mb] }),
    ...(ml !== undefined && { marginLeft: theme.spacing[ml] }),
    ...(mr !== undefined && { marginRight: theme.spacing[mr] }),
    ...(bg && { backgroundColor: theme.colors.bg[bg] }),
    ...(borderRadius && { borderRadius: theme.radius[borderRadius] }),
    ...(borderColor && { borderColor: theme.colors.border[borderColor] }),
    ...(borderWidth && { borderWidth: theme.borderWidth[borderWidth] }),
    ...(opacity && { opacity: theme.opacity[opacity] }),
    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(flexWrap && { flexWrap }),
    ...(shadowToken && {
      shadowColor: shadowToken.shadowColor,
      shadowOffset: shadowToken.shadowOffset,
      shadowOpacity: shadowToken.shadowOpacity,
      shadowRadius: shadowToken.shadowRadius,
      elevation: shadowToken.elevation,
    }),
  };

  return (
    <View ref={ref} testID={testID} style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  );
});
