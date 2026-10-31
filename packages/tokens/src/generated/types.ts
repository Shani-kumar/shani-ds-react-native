/**
 * Shani DS - Generated Design System Token Types
 * DO NOT EDIT DIRECTLY. Generated via `pnpm tokens:build`.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorActionState {
  default: string;
  pressed: string;
  disabled: string;
  text: string;
  textDisabled: string;
  border?: string;
  borderPressed?: string;
}

export interface FeedbackTokenGroup {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

export interface ThemeColors {
  bg: {
    canvas: string;
    surface: string;
    surfaceRaised: string;
    surfaceOverlay: string;
    muted: string;
    subtle: string;
    inverse: string;
    brand: string;
    brandSubtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
    brand: string;
    brandEmphasized: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    brand: string;
    focus: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  action: {
    primary: ColorActionState;
    secondary: ColorActionState;
    danger: ColorActionState;
  };
  feedback: {
    success: FeedbackTokenGroup;
    warning: FeedbackTokenGroup;
    danger: FeedbackTokenGroup;
    info: FeedbackTokenGroup;
  };
  palette: {
    brand: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    neutral: Record<'0' | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950' | '1000', string>;
    success: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    warning: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    danger: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    info: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
  };
}

export type SpacingKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '12' | '14' | '16' | '20' | '24';
export type SpacingScale = Record<SpacingKey, number>;
export type RadiusScale = Record<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full', number>;
export type BorderWidthScale = Record<'none' | 'hairline' | 'thin' | 'medium' | 'thick' | 'heavy', number>;

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export type ShadowScale = Record<'none' | 'sm' | 'md' | 'lg' | 'xl', ShadowToken>;
export type OpacityScale = Record<'0' | 'faint' | 'subtle' | 'muted' | 'medium' | 'strong' | 'full', number>;
export type ZIndexScale = Record<'deep' | 'base' | 'docked' | 'dropdown' | 'sticky' | 'banner' | 'overlay' | 'modal' | 'popover' | 'toast' | 'tooltip', number>;
export type BreakpointScale = Record<'phone' | 'tablet' | 'desktop' | 'wide', number>;

export interface MotionDurationScale {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  crawl: number;
}

export interface MotionSpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
}

export interface MotionTokens {
  duration: MotionDurationScale;
  easing: {
    standard: [number, number, number, number];
    accelerate: [number, number, number, number];
    decelerate: [number, number, number, number];
    linear: [number, number, number, number];
  };
  spring: Record<'default' | 'snappy' | 'bouncier' | 'gentle', MotionSpringConfig>;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl', number>;
  lineHeight: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl', number>;
  fontWeight: Record<'regular' | 'medium' | 'semibold' | 'bold', string>;
  letterSpacing: Record<'tight' | 'normal' | 'wide' | 'wider', number>;
}

export interface ComponentTokens {
  button: {
    primary: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
    secondary: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      border: string;
      borderPressed: string;
      text: string;
      textDisabled: string;
    };
    danger: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
  };
  input: {
    bg: string;
    border: {
      default: string;
      focus: string;
      error: string;
    };
    text: {
      value: string;
      placeholder: string;
      label: string;
      helper: string;
      error: string;
    };
  };
  badge: Record<'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info', { bg: string; text: string }>;
  card: {
    bg: string;
    bgElevated: string;
    border: string;
  };
}

export interface ThemeTokens {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: SpacingScale;
  radius: RadiusScale;
  borderWidth: BorderWidthScale;
  typography: TypographyTokens;
  shadow: ShadowScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  breakpoints: BreakpointScale;
  motion: MotionTokens;
  components: ComponentTokens;
}

export interface PrimitivesTokens {
  color: ThemeColors['palette'];
  spacing: SpacingScale;
  radius: RadiusScale;
  borderWidth: BorderWidthScale;
  typography: TypographyTokens;
  shadow: ShadowScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  breakpoints: BreakpointScale;
  motion: MotionTokens;
}
