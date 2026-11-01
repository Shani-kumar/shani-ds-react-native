import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  type CardVariant,
  type CardPadding,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function CardPage() {
  const [variant, setVariant] = useState<CardVariant>('elevated');
  const [padding, setPadding] = useState<CardPadding>('md');

  return (
    <ComponentPage
      title="Card"
      description="Surface container primitive supporting outlined, elevated, and filled variants with composable header, content, and footer slots."
      category="Display"
      playground={
        <Box style={{ width: '100%' }}>
          <Card variant={variant} padding={padding}>
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>Waybill #840192</Text>
                <Badge variant="brand" size="sm" style={{ flexShrink: 0 }}>Priority Air</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="2">
                <Text variant="body">Consignee: Global Aero Logistics</Text>
                <Text variant="caption">Destination: Terminal 4, Gate B12</Text>
              </VStack>
            </CardContent>
            <CardFooter>
              <HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
                <Text variant="caption">Weight: 42.0 kg</Text>
                <Button variant="secondary" size="sm">View Manifest</Button>
              </HStack>
            </CardFooter>
          </Card>
        </Box>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Variant:</Text>
            {(['outlined', 'elevated', 'filled'] as CardVariant[]).map((v) => (
              <Button
                key={v}
                variant={variant === v ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setVariant(v)}
              >
                {v}
              </Button>
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Padding:</Text>
            {(['none', 'sm', 'md', 'lg'] as CardPadding[]).map((p) => (
              <Button
                key={p}
                variant={padding === p ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setPadding(p)}
              >
                {p}
              </Button>
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Outlined Card</Text>
          <Card variant="outlined" padding="md">
            <Text variant="body">Outlined: Subtle 1px border using border.subtle with transparent/surface background.</Text>
          </Card>
          <Text variant="label">Elevated Card</Text>
          <Card variant="elevated" padding="md">
            <Text variant="body">Elevated: Soft drop shadow using shadow.md token for card elevation and visual hierarchy.</Text>
          </Card>
          <Text variant="label">Filled Card</Text>
          <Card variant="filled" padding="md">
            <Text variant="body">Filled: Flat background container using bg.surfaceRaised without outer border.</Text>
          </Card>
        </VStack>
      }
      propsData={[
        {
          name: 'children',
          type: 'React element or tree',
          default: 'required',
          description: 'Composable card body content, typically combining CardHeader, CardContent, and CardFooter.',
          example: 'children={<CardContent><Text>Manifest</Text></CardContent>}',
        },
        {
          name: 'variant',
          type: "'outlined' | 'elevated' | 'filled'",
          default: "'outlined'",
          description: 'Container surface style. Outlined has a 1px border; Elevated adds elevation and shadow.md; Filled uses bg.surfaceRaised.',
          example: 'variant="elevated"',
        },
        {
          name: 'padding',
          type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
          default: "'md'",
          description: 'Internal token padding tier (none=0, xs=4, sm=8, md=16, lg=24, xl=32).',
          example: 'padding="lg"',
        },
        {
          name: 'onPress',
          type: '(event: GestureResponderEvent) => void',
          default: 'None',
          description: 'Optional press handler callback that turns the Card into an accessible interactive button.',
          example: 'onPress={() => openDetails()}',
        },
        {
          name: 'accessibilityRole',
          type: 'AccessibilityRole',
          default: 'None',
          description: 'Screen reader accessibility role. Automatically sets "button" when onPress is provided.',
          example: 'accessibilityRole="button"',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'None',
          description: 'Spoken description for screen readers when card is interactive.',
          example: 'accessibilityLabel="View shipment tracking route #490"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout constraints only (margin, flex, minWidth). Background colors, borders, and shadows are token-governed.',
          example: 'style={{ width: \'100%\' }}',
        },
      ]}
      dos={[
        'Use elevated cards to lift interactive items (e.g. delivery run sheet items) off the background canvas.',
        'Use composable CardHeader, CardContent, and CardFooter to enforce standard section spacing.',
      ]}
      donts={[
        'Never nest cards inside cards with matching borders or shadows.',
        'Never set arbitrary pixel margins on Card; wrap in Stack or Box.',
      ]}
      a11yNotes={[
        'Cards organize content logically so screen readers navigate sequential shipment details naturally.',
        'Ensure text inside cards maintains WCAG AA contrast against card background surfaces in both light and dark modes.',
      ]}
      codeSnippet={`import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '@shani/ui';

export function ShipmentCard() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader>
        <Text variant="title">Route #490</Text>
      </CardHeader>
      <CardContent>
        <Text variant="body">5 Deliveries Remaining</Text>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Start Route</Button>
      </CardFooter>
    </Card>
  );
}`}
    />
  );
}

