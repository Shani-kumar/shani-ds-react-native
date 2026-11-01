import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export type CardVariant = 'outlined' | 'elevated' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  /** Visual presentation variant (default: 'outlined') */
  variant?: CardVariant;
  /** Internal padding using tokenized card padding scale (default: 'md') */
  padding?: CardPadding;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
  /** Child content */
  children?: React.ReactNode;
}

/**
 * Card is a flexible, surface-level content container in Shani DS.
 * Bounded to tokenized background surfaces, elevation shadows, and border tokens.
 */
export const Card = forwardRef<View, CardProps>(function Card(
  { variant = 'outlined', padding = 'md', style, testID, children, ...rest },
  ref
) {
  const { theme } = useTheme();

  const cardTokens = theme.components.card;
  const paddingValue = padding === 'none' ? 0 : cardTokens.padding[padding];

  let backgroundColor = cardTokens.bg;
  let borderWidth = 0;
  let borderColor: string | undefined = undefined;
  let shadowStyle: ViewStyle = {};

  if (variant === 'outlined') {
    backgroundColor = cardTokens.bg;
    borderWidth = theme.borderWidth.thin;
    borderColor = cardTokens.border;
  } else if (variant === 'elevated') {
    backgroundColor = cardTokens.bgElevated;
    const shadowToken = theme.shadow.md;
    shadowStyle = {
      elevation: shadowToken.elevation,
      shadowColor: shadowToken.shadowColor,
      shadowOffset: shadowToken.shadowOffset,
      shadowOpacity: shadowToken.shadowOpacity,
      shadowRadius: shadowToken.shadowRadius,
    };
  } else if (variant === 'filled') {
    backgroundColor = cardTokens.bgFilled;
  }

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius: theme.radius.lg,
    padding: paddingValue,
    borderWidth,
    ...(borderColor && { borderColor }),
    ...shadowStyle,
    maxWidth: '100%',
  };

  return (
    <View ref={ref} testID={testID} style={[containerStyle, style]} {...rest}>
      {children}
    </View>
  );
});

export interface CardSectionProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children?: React.ReactNode;
}

/**
 * CardHeader groups title and action slots at the top of a Card.
 */
export const CardHeader = forwardRef<View, CardSectionProps>(function CardHeader(
  { style, testID, children, ...rest },
  ref
) {
  const { theme } = useTheme();
  return (
    <View ref={ref} testID={testID} style={[{ marginBottom: theme.spacing[3], width: '100%', maxWidth: '100%' }, style]} {...rest}>
      {children}
    </View>
  );
});

/**
 * CardContent holds the primary body elements of a Card.
 */
export const CardContent = forwardRef<View, CardSectionProps>(function CardContent(
  { style, testID, children, ...rest },
  ref
) {
  return (
    <View ref={ref} testID={testID} style={[{ width: '100%', maxWidth: '100%' }, style]} {...rest}>
      {children}
    </View>
  );
});

/**
 * CardFooter holds actions or metadata at the bottom of a Card.
 */
export const CardFooter = forwardRef<View, CardSectionProps>(function CardFooter(
  { style, testID, children, ...rest },
  ref
) {
  const { theme } = useTheme();
  return (
    <View
      ref={ref}
      testID={testID}
      style={[{ marginTop: theme.spacing[3], flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: '100%' }, style]}
      {...rest}
    >
      {children}
    </View>
  );
});
