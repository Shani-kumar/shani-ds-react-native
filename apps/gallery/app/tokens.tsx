import { useState } from 'react';
import { ScrollView, View, Pressable, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  useReducedMotion,
  Easing,
} from 'react-native-reanimated';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Divider,
  Icon,
  useTheme,
} from '@shani/ui';
import { GalleryHeader } from '../src/components/GalleryHeader';
import { getContrastRatio } from '../src/utils/contrast';

type TokenCategory = 'colors' | 'spacing' | 'typography' | 'radius' | 'shadows' | 'motion';

function DurationDemoCard({
  name,
  duration,
  usage,
  shouldReduceMotion,
}: {
  name: string;
  duration: number;
  usage: string;
  shouldReduceMotion: boolean;
}) {
  const { theme } = useTheme();
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handleReplay = () => {
    if (shouldReduceMotion) return;
    offset.value = 0;
    offset.value = withTiming(140, { duration });
  };

  return (
    <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 200, maxWidth: '100%' }}>
      <VStack spacing="3">
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <HStack spacing="2" align="center">
            <Badge variant="brand">{name}</Badge>
            <Text variant="title">{duration}ms</Text>
          </HStack>
          <Button
            variant="secondary"
            size="sm"
            leftIcon="Play"
            onPress={handleReplay}
            disabled={shouldReduceMotion}
          >
            Replay
          </Button>
        </HStack>
        <Box
          p="2"
          bg="canvas"
          borderRadius="md"
          borderColor="subtle"
          borderWidth="hairline"
          style={{ width: '100%', height: 48, justifyContent: 'center', overflow: 'hidden' }}
        >
          <Animated.View
            style={[
              {
                width: 32,
                height: 32,
                backgroundColor: theme.colors.action.primary.default,
                borderRadius: theme.radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedStyle,
            ]}
          >
            <Icon name="Truck" size="xs" color="inverse" />
          </Animated.View>
        </Box>
        <Text variant="caption" color="secondary">
          {usage}
        </Text>
      </VStack>
    </Card>
  );
}

function EasingDemoCard({
  name,
  bezier,
  description,
  shouldReduceMotion,
}: {
  name: string;
  bezier: [number, number, number, number];
  description: string;
  shouldReduceMotion: boolean;
}) {
  const { theme } = useTheme();
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePlay = () => {
    if (shouldReduceMotion) return;
    offset.value = 0;
    offset.value = withTiming(140, {
      duration: 500,
      easing: Easing.bezier(bezier[0], bezier[1], bezier[2], bezier[3]),
    });
  };

  return (
    <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 200, maxWidth: '100%' }}>
      <VStack spacing="3">
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <Badge variant="neutral">{name}</Badge>
          <Button
            variant="ghost"
            size="sm"
            leftIcon="Play"
            onPress={handlePlay}
            disabled={shouldReduceMotion}
          >
            Play
          </Button>
        </HStack>
        <Box
          p="2"
          bg="canvas"
          borderRadius="md"
          borderColor="subtle"
          borderWidth="hairline"
          style={{ width: '100%', height: 44, justifyContent: 'center', overflow: 'hidden' }}
        >
          <Animated.View
            style={[
              {
                width: 28,
                height: 28,
                backgroundColor: theme.colors.action.primary.pressed,
                borderRadius: theme.radius.full,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedStyle,
            ]}
          >
            <Icon name="ArrowRight" size="xs" color="inverse" />
          </Animated.View>
        </Box>
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <Text variant="caption" color="secondary" style={{ flex: 1, minWidth: 0 }}>
            {description}
          </Text>
          <Text variant="caption" style={{ fontFamily: 'monospace', fontSize: 10 }}>
            [{bezier.join(', ')}]
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

function SpringDemoCard({
  name,
  spring,
  usage,
  shouldReduceMotion,
}: {
  name: string;
  spring: { damping: number; mass: number; stiffness: number };
  usage: string;
  shouldReduceMotion: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleTap = () => {
    if (shouldReduceMotion) return;
    scale.value = 0.82;
    scale.value = withSpring(1, {
      damping: spring.damping,
      mass: spring.mass,
      stiffness: spring.stiffness,
    });
  };

  return (
    <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 200, maxWidth: '100%' }}>
      <VStack spacing="3">
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <Badge variant="warning">{name}</Badge>
          <Text variant="caption" color="secondary">
            d:{spring.damping} • m:{spring.mass} • s:{spring.stiffness}
          </Text>
        </HStack>
        <Divider />
        <Pressable
          onPress={handleTap}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Test ${name} spring micro-animation`}
          style={{ width: '100%', alignItems: 'center', paddingVertical: theme.spacing[2] }}
        >
          <Animated.View
            style={[
              {
                width: 120,
                height: 52,
                backgroundColor: theme.colors.bg.surfaceRaised,
                borderColor: theme.colors.border.brand,
                borderWidth: theme.borderWidth.thin,
                borderRadius: theme.radius.md,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedStyle,
            ]}
          >
            <HStack spacing="2" align="center">
              <Icon name="Zap" size="xs" color="brand" />
              <Text variant="label" color="brand">Tap to Test</Text>
            </HStack>
          </Animated.View>
        </Pressable>
        <Text variant="caption" color="secondary">
          {usage}
        </Text>
      </VStack>
    </Card>
  );
}

export default function TokensScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TokenCategory>('colors');
  const shouldReduceMotion = Boolean(useReducedMotion());

  // Key contrast pairs from WCAG 2.1 AA audit
  const contrastPairs = [
    {
      label: 'Primary Text on Canvas',
      fgToken: 'text.primary',
      fgHex: theme.colors.text.primary,
      bgToken: 'bg.canvas',
      bgHex: theme.colors.bg.canvas,
      minRatio: 4.5,
    },
    {
      label: 'Primary Text on Surface',
      fgToken: 'text.primary',
      fgHex: theme.colors.text.primary,
      bgToken: 'bg.surface',
      bgHex: theme.colors.bg.surface,
      minRatio: 4.5,
    },
    {
      label: 'Secondary Text on Surface',
      fgToken: 'text.secondary',
      fgHex: theme.colors.text.secondary,
      bgToken: 'bg.surface',
      bgHex: theme.colors.bg.surface,
      minRatio: 4.5,
    },
    {
      label: 'Tertiary Text on Surface (AA Small Text)',
      fgToken: 'text.tertiary',
      fgHex: theme.colors.text.tertiary,
      bgToken: 'bg.surface',
      bgHex: theme.colors.bg.surface,
      minRatio: 4.5,
    },
    {
      label: 'Brand Text on Surface',
      fgToken: 'text.brand',
      fgHex: theme.colors.text.brand,
      bgToken: 'bg.surface',
      bgHex: theme.colors.bg.surface,
      minRatio: 4.5,
    },
    {
      label: 'Primary Action Text on Button',
      fgToken: 'action.primary.text',
      fgHex: theme.colors.action.primary.text,
      bgToken: 'action.primary.default',
      bgHex: theme.colors.action.primary.default,
      minRatio: 4.5,
    },
    {
      label: 'Danger Action Text on Button',
      fgToken: 'action.danger.text',
      fgHex: theme.colors.action.danger.text,
      bgToken: 'action.danger.default',
      bgHex: theme.colors.action.danger.default,
      minRatio: 4.5,
    },
    {
      label: 'Success Feedback Text on Badge',
      fgToken: 'feedback.success.text',
      fgHex: theme.colors.feedback.success.text,
      bgToken: 'feedback.success.bg',
      bgHex: theme.colors.feedback.success.bg,
      minRatio: 4.5,
    },
    {
      label: 'Warning Feedback Text on Badge',
      fgToken: 'feedback.warning.text',
      fgHex: theme.colors.feedback.warning.text,
      bgToken: 'feedback.warning.bg',
      bgHex: theme.colors.feedback.warning.bg,
      minRatio: 4.5,
    },
    {
      label: 'Danger Feedback Text on Badge',
      fgToken: 'feedback.danger.text',
      fgHex: theme.colors.feedback.danger.text,
      bgToken: 'feedback.danger.bg',
      bgHex: theme.colors.feedback.danger.bg,
      minRatio: 4.5,
    },
  ];

  return (
    <Box flex={1} bg="canvas">
      <GalleryHeader title="Tokens Explorer" showBack={true} />

      {/* Category Navigation Bar */}
      <Box px="4" py="3" bg="surface" borderColor="subtle" borderWidth="hairline">
        <HStack spacing="2" wrap={true}>
          {(['colors', 'spacing', 'typography', 'radius', 'shadows', 'motion'] as TokenCategory[]).map(
            (cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setActiveTab(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            )
          )}
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* TAB 1: COLORS */}
          {activeTab === 'colors' ? (
            <VStack spacing="6">
              {/* Semantic Intent Colors */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <Text variant="title">Semantic Intent Colors</Text>
                </CardHeader>
                <CardContent>
                  <VStack spacing="4">
                    <Text variant="caption">
                      Verified light/dark semantic color mappings designed for high-contrast logistics screens.
                    </Text>
                    <HStack spacing="4" wrap={true}>
                      {contrastPairs.map((pair) => {
                        const ratio = getContrastRatio(pair.fgHex, pair.bgHex);
                        const passed = ratio >= pair.minRatio;
                        return (
                          <Card
                            key={pair.label}
                            variant="outlined"
                            padding="sm"
                            style={{ flex: 1, minWidth: 200, maxWidth: '100%' }}
                          >
                            <VStack spacing="2">
                              <HStack justify="between" align="center" wrap={true}>
                                <Text variant="label" style={{ flex: 1, minWidth: 0 }}>
                                  {pair.label}
                                </Text>
                                <Badge variant={passed ? 'success' : 'danger'} size="sm">
                                  {ratio}:1 (AA)
                                </Badge>
                              </HStack>
                              <View
                                style={{
                                  padding: theme.spacing[3],
                                  backgroundColor: pair.bgHex,
                                  borderColor: theme.colors.border.subtle,
                                  borderWidth: theme.borderWidth.hairline,
                                  borderRadius: theme.radius.sm,
                                }}
                              >
                                <Text variant="body" style={{ color: pair.fgHex, fontWeight: '600' }}>
                                  Sample Text: #SHN-84912
                                </Text>
                              </View>
                              <HStack justify="between" align="center" wrap={true}>
                                <Text variant="caption">{pair.fgToken} ({pair.fgHex})</Text>
                                <Text variant="caption">on {pair.bgToken} ({pair.bgHex})</Text>
                              </HStack>
                            </VStack>
                          </Card>
                        );
                      })}
                    </HStack>
                  </VStack>
                </CardContent>
              </Card>

              {/* Action Tokens */}
              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <Text variant="title">Semantic Action Tokens</Text>
                </CardHeader>
                <CardContent>
                  <VStack spacing="4">
                    <HStack spacing="3" wrap={true}>
                      {Object.entries(theme.colors.action).map(([key, actionGroup]) => (
                        <Card
                          key={key}
                          variant="outlined"
                          padding="sm"
                          style={{ flex: 1, minWidth: 140, maxWidth: '100%' }}
                        >
                          <VStack spacing="2">
                            <Text variant="label">{key}</Text>
                            <View
                              style={{
                                height: 40,
                                backgroundColor: actionGroup.default,
                                borderRadius: theme.radius.sm,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text variant="caption" style={{ color: actionGroup.text }}>
                                {actionGroup.default}
                              </Text>
                            </View>
                            <Text variant="caption">Pressed: {actionGroup.pressed}</Text>
                          </VStack>
                        </Card>
                      ))}
                    </HStack>
                  </VStack>
                </CardContent>
              </Card>

              {/* Primitive Palette Scales */}
              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <Text variant="title">Primitive Scales (50 - 900)</Text>
                </CardHeader>
                <CardContent>
                  <VStack spacing="4">
                    {(['brand', 'neutral', 'success', 'warning', 'danger', 'info', 'partner'] as const).map(
                      (scaleName) => {
                        const scale = theme.colors.palette[scaleName];
                        if (!scale) return null;
                        return (
                          <VStack key={scaleName} spacing="2">
                            <Text variant="label">
                              {scaleName.charAt(0).toUpperCase() + scaleName.slice(1)} Scale
                            </Text>
                            <HStack spacing="1" wrap={true}>
                              {Object.entries(scale).map(([step, hex]) => (
                                <View
                                  key={step}
                                  style={{
                                    alignItems: 'center',
                                    marginBottom: theme.spacing[2],
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 44,
                                      height: 36,
                                      backgroundColor: hex,
                                      borderRadius: theme.radius.xs,
                                      borderColor: theme.colors.border.subtle,
                                      borderWidth: theme.borderWidth.hairline,
                                    }}
                                  />
                                  <Text variant="caption" style={{ fontSize: 10 }}>
                                    {step}
                                  </Text>
                                </View>
                              ))}
                            </HStack>
                          </VStack>
                        );
                      }
                    )}
                  </VStack>
                </CardContent>
              </Card>
            </VStack>
          ) : null}

          {/* TAB 2: SPACING */}
          {activeTab === 'spacing' ? (
            <Box style={{ maxWidth: 720, width: '100%' }}>
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <VStack spacing="1">
                    <Text variant="title">4pt Spacing Scale</Text>
                    <Text variant="caption">
                      Every padding, margin, and gap is mapped to the 4pt grid scale. Shown at 1:1 scale (1pt = 1 dp).
                    </Text>
                  </VStack>
                </CardHeader>
                <CardContent>
                  <VStack spacing="3">
                    {Object.entries(theme.spacing).map(([key, value]) => {
                      const numValue = Number(value);
                      return (
                        <Card key={key} variant="outlined" padding="sm">
                          <HStack align="center" style={{ width: '100%' }}>
                            {/* Fixed-width label column */}
                            <HStack spacing="2" align="center" style={{ width: 140, flexShrink: 0 }}>
                              <Badge variant="brand" size="sm" style={{ flexShrink: 0 }}>
                                spacing[{key}]
                              </Badge>
                              <Text variant="caption" style={{ fontWeight: '600', flexShrink: 0 }}>
                                {value}pt
                              </Text>
                            </HStack>
                            {/* 1:1 true scale bar column */}
                            <View style={{ flex: 1, minWidth: 0, paddingLeft: theme.spacing[3], justifyContent: 'center' }}>
                              {numValue === 0 ? (
                                <HStack spacing="2" align="center">
                                  <View
                                    style={{
                                      width: 1,
                                      height: theme.spacing[4],
                                      backgroundColor: theme.colors.border.subtle,
                                    }}
                                  />
                                  <Text variant="caption" color="secondary" style={{ fontStyle: 'italic' }}>
                                    none (0pt)
                                  </Text>
                                </HStack>
                              ) : (
                                <View
                                  style={{
                                    height: theme.spacing[4],
                                    width: numValue,
                                    maxWidth: '100%',
                                    backgroundColor: theme.colors.action.primary.default,
                                    borderRadius: theme.radius.xs,
                                  }}
                                />
                              )}
                            </View>
                          </HStack>
                        </Card>
                      );
                    })}
                  </VStack>
                </CardContent>
              </Card>
            </Box>
          ) : null}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' ? (
            <VStack spacing="6">
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <Text variant="title">Typography Scales</Text>
                </CardHeader>
                <CardContent>
                  <VStack spacing="4">
                    {Object.entries(theme.typography.fontSize).map(([key, size]) => (
                      <Card key={key} variant="outlined" padding="sm">
                        <VStack spacing="1">
                          <HStack justify="between" align="center" wrap={true} spacing="2">
                            <Badge variant="neutral" size="sm">
                              fontSize.{key}
                            </Badge>
                            <Text variant="caption">
                              Size: {size}pt | LineHeight:{' '}
                              {theme.typography.lineHeight[key as keyof typeof theme.typography.lineHeight]}pt
                            </Text>
                          </HStack>
                          <Text
                            variant="body"
                            style={{
                              fontSize: size,
                              lineHeight:
                                theme.typography.lineHeight[
                                  key as keyof typeof theme.typography.lineHeight
                                ],
                              flexShrink: 1,
                              minWidth: 0,
                            }}
                          >
                            Logistics Waybill: #SHN-94812
                          </Text>
                        </VStack>
                      </Card>
                    ))}
                  </VStack>
                </CardContent>
              </Card>

              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <Text variant="title">Font Weights</Text>
                </CardHeader>
                <CardContent>
                  <HStack spacing="4" wrap={true}>
                    {Object.entries(theme.typography.fontWeight).map(([key, weight]) => (
                      <Card
                        key={key}
                        variant="outlined"
                        padding="sm"
                        style={{ flex: 1, minWidth: 120, maxWidth: '100%' }}
                      >
                        <VStack spacing="1">
                          <Badge variant="brand" size="sm">{key}</Badge>
                          <Text variant="title" style={{ fontWeight: weight as TextStyle['fontWeight'] }}>
                            AaBbCc 123
                          </Text>
                          <Text variant="caption">weight: {weight}</Text>
                        </VStack>
                      </Card>
                    ))}
                  </HStack>
                </CardContent>
              </Card>
            </VStack>
          ) : null}

          {/* TAB 4: RADIUS */}
          {activeTab === 'radius' ? (
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <Text variant="title">Border Radius Scale</Text>
              </CardHeader>
              <CardContent>
                <HStack spacing="4" wrap={true}>
                  {Object.entries(theme.radius).map(([key, radius]) => (
                    <Card
                      key={key}
                      variant="outlined"
                      padding="sm"
                      style={{ flex: 1, minWidth: 120, maxWidth: '100%', alignItems: 'center' }}
                    >
                      <VStack spacing="2" align="center">
                        <Badge variant="neutral" size="sm">{key}</Badge>
                        <View
                          style={{
                            width: 64,
                            height: 64,
                            backgroundColor: theme.colors.bg.brandSubtle,
                            borderColor: theme.colors.border.brand,
                            borderWidth: theme.borderWidth.thin,
                            borderRadius: radius,
                          }}
                        />
                        <Text variant="caption">{radius}pt</Text>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </CardContent>
            </Card>
          ) : null}

          {/* TAB 5: SHADOWS */}
          {activeTab === 'shadows' ? (
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <Text variant="title">Elevation & Drop Shadows</Text>
              </CardHeader>
              <CardContent>
                <HStack spacing="4" wrap={true}>
                  {Object.entries(theme.shadow).map(([key, shadowToken]) => (
                    <Card
                      key={key}
                      variant="outlined"
                      padding="lg"
                      style={{
                        flex: 1,
                        minWidth: 140,
                        maxWidth: '100%',
                        backgroundColor: theme.colors.bg.surface,
                        elevation: shadowToken.elevation,
                        shadowColor: shadowToken.shadowColor,
                        shadowOffset: shadowToken.shadowOffset,
                        shadowOpacity: shadowToken.shadowOpacity,
                        shadowRadius: shadowToken.shadowRadius,
                        borderRadius: theme.radius.md,
                      }}
                    >
                      <VStack spacing="2">
                        <Badge variant="brand">{key}</Badge>
                        <Text variant="body">Elevation: {shadowToken.elevation}</Text>
                        <Text variant="caption">Radius: {shadowToken.shadowRadius}pt</Text>
                        <Text variant="caption">Opacity: {shadowToken.shadowOpacity}</Text>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </CardContent>
            </Card>
          ) : null}

          {/* TAB 6: MOTION (LIVE) */}
          {activeTab === 'motion' ? (
            <VStack spacing="6">
              {/* Reduced Motion System Warning (if active) */}
              {shouldReduceMotion ? (
                <Box
                  p="3"
                  bg="brandSubtle"
                  borderRadius="md"
                  borderColor="subtle"
                  borderWidth="hairline"
                >
                  <HStack spacing="2" align="center">
                    <Icon name="Info" size="sm" color="brand" />
                    <Text variant="caption" color="brand">
                      Reduce motion is on, animations are disabled.
                    </Text>
                  </HStack>
                </Box>
              ) : null}

              {/* Component Motion Usage Cross-Reference */}
              <Card variant="outlined" padding="md">
                <VStack spacing="2">
                  <HStack spacing="2" align="center">
                    <Icon name="Layers" size="sm" color="brand" />
                    <Text variant="label" style={{ fontWeight: '700' }}>
                      Design System Component Motion Usages:
                    </Text>
                  </HStack>
                  <Text variant="caption" color="secondary">
                    • Button: Press micro-scale uses motion.spring.snappy (damping 26, mass 0.8, stiffness 300)
                  </Text>
                  <Text variant="caption" color="secondary">
                    • Switch: Thumb translation uses motion.spring.snappy (instant fallback on reduced motion)
                  </Text>
                  <Text variant="caption" color="secondary">
                    • Skeleton: Opacity shimmer pulse uses motion.duration.normal (250ms) with repeat
                  </Text>
                </VStack>
              </Card>

              {/* 1. Live Duration Tokens with Replay */}
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <VStack spacing="1">
                    <Text variant="title">Live Duration Tokens</Text>
                    <Text variant="caption">
                      Interactive sliding preview. Tap Replay to trigger timing animation with exact duration tokens.
                    </Text>
                  </VStack>
                </CardHeader>
                <CardContent>
                  <HStack spacing="4" wrap={true}>
                    {Object.entries(theme.motion.duration).map(([key, duration]) => (
                      <DurationDemoCard
                        key={key}
                        name={key}
                        duration={duration}
                        shouldReduceMotion={shouldReduceMotion}
                        usage={
                          key === 'instant'
                            ? 'Accessibility: Zero-latency reduced motion'
                            : key === 'fast'
                            ? 'Micro-interactions: buttons, switches, checkboxes'
                            : key === 'normal'
                            ? 'Standard transitions: expand/collapse, cards'
                            : key === 'slow'
                            ? 'Major transitions: modals, page sheets'
                            : 'Progressive multi-step animations'
                        }
                      />
                    ))}
                  </HStack>
                </CardContent>
              </Card>

              {/* 2. Visual Easing Comparison */}
              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <VStack spacing="1">
                    <Text variant="title">Cubic Bezier Easing Curves</Text>
                    <Text variant="caption">
                      Visual comparison of acceleration and deceleration curves running at 500ms.
                    </Text>
                  </VStack>
                </CardHeader>
                <CardContent>
                  <HStack spacing="4" wrap={true}>
                    {Object.entries(theme.motion.easing).map(([key, bezier]) => (
                      <EasingDemoCard
                        key={key}
                        name={key}
                        bezier={bezier as [number, number, number, number]}
                        shouldReduceMotion={shouldReduceMotion}
                        description={
                          key === 'standard'
                            ? 'Standard material curve for general UI element motion'
                            : key === 'accelerate'
                            ? 'Accelerates out of view for elements exiting screen'
                            : key === 'decelerate'
                            ? 'Decelerates into place for incoming elements'
                            : 'Constant velocity linear motion for spinners and loaders'
                        }
                      />
                    ))}
                  </HStack>
                </CardContent>
              </Card>

              {/* 3. Interactive Spring Physics on Tap */}
              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <VStack spacing="1">
                    <Text variant="title">Spring Physics Tokens (Interactive)</Text>
                    <Text variant="caption">
                      Tap any card to feel the spring physics driven by damping, mass, and stiffness tokens.
                    </Text>
                  </VStack>
                </CardHeader>
                <CardContent>
                  <HStack spacing="4" wrap={true}>
                    {Object.entries(theme.motion.spring).map(([key, spring]) => (
                      <SpringDemoCard
                        key={key}
                        name={key}
                        spring={spring}
                        shouldReduceMotion={shouldReduceMotion}
                        usage={
                          key === 'default'
                            ? 'Standard natural spring for UI gestures'
                            : key === 'snappy'
                            ? 'Snappy response for switches, buttons, and chips'
                            : key === 'bouncier'
                            ? 'Playful accent feedback for completed milestones'
                            : 'Smooth bottom sheet drag settling and sheet dismiss'
                        }
                      />
                    ))}
                  </HStack>
                </CardContent>
              </Card>
            </VStack>
          ) : null}
        </VStack>
      </ScrollView>
    </Box>
  );
}
