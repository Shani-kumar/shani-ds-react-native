import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  type BadgeVariant,
  type BadgeSize,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function BadgePage() {
  const [variant, setVariant] = useState<BadgeVariant>('success');
  const [size, setSize] = useState<BadgeSize>('md');
  const [dot, setDot] = useState(true);

  return (
    <ComponentPage
      title="Badge"
      description="Semantic status indicator with guaranteed WCAG AA contrast (≥ 4.5:1), optional status dots, and leading icons."
      category="Display"
      playground={
        <VStack spacing="2" align="center">
          <Badge variant={variant} size={size} dot={dot}>
            {variant === 'success'
              ? 'Delivered to Consignee'
              : variant === 'warning'
              ? 'Customs Inspection Delayed'
              : variant === 'danger'
              ? 'Address Correction Needed'
              : 'Out for Delivery'}
          </Badge>
          <Text variant="caption">
            Variant: {variant} | Size: {size} | Dot: {dot ? 'Yes' : 'No'}
          </Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Variant:</Text>
            {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as BadgeVariant[]).map((v) => (
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
            <Text variant="caption">Size & Dot:</Text>
            <Button
              variant={size === 'sm' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setSize('sm')}
            >
              Small (sm)
            </Button>
            <Button
              variant={size === 'md' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setSize('md')}
            >
              Medium (md)
            </Button>
            <Button
              variant={dot ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setDot(!dot)}
            >
              Toggle Dot
            </Button>
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Logistics Milestone Statuses</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="3" wrap={true}>
              <Badge variant="success" dot={true}>Delivered</Badge>
              <Badge variant="brand" dot={true}>Out for Delivery</Badge>
              <Badge variant="warning" dot={true}>Weather Delay</Badge>
              <Badge variant="danger" dot={true}>Failed Attempt</Badge>
              <Badge variant="info">In Sorting Facility</Badge>
              <Badge variant="neutral">Pending Pickup</Badge>
            </HStack>
          </Box>
        </VStack>
      }
      propsData={[
        {
          name: 'children',
          type: 'string | React element',
          default: 'required',
          description: 'Badge text label content describing state or category.',
          example: 'children="Out for Delivery"',
        },
        {
          name: 'variant',
          type: "'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'",
          default: "'neutral'",
          description: 'Semantic feedback color pairing. All pairings strictly verified for WCAG AA (≥4.5:1) text contrast.',
          example: 'variant="success"',
        },
        {
          name: 'size',
          type: "'sm' | 'md'",
          default: "'md'",
          description: 'Badge dimensions and font scale (sm uses caption 12pt; md uses label 14pt).',
          example: 'size="sm"',
        },
        {
          name: 'dot',
          type: 'boolean',
          default: 'false',
          description: 'Renders a colored status indicator dot before the label to denote live state.',
          example: 'dot={true}',
        },
        {
          name: 'icon',
          type: 'Lucide icon component or string',
          default: 'None',
          description: "Optional leading icon rendered before label. Accepts PascalCase string name (e.g. 'Truck') or direct Lucide component.",
          example: 'icon="Clock"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout constraints only (margin, flexShrink). Badge height, radius, padding, and colors come from tokens.',
          example: 'style={{ flexShrink: 0 }}',
        },
      ]}
      dos={[
        'Use semantic variants according to their true feedback state (success=green, warning=amber, danger=red).',
        'Use the dot prop when status represents live or changing operational states.',
        'Keep badge text concise (1 to 3 words) for quick mobile scanning by couriers.',
      ]}
      donts={[
        'Never use danger badges for non-critical information.',
        'Never use raw hex colors or inline background styles for badges.',
      ]}
      a11yNotes={[
        'Every badge foreground and background pairing has been mathematically tested and verified in scripts/contrast.ts to meet or exceed WCAG AA 4.5:1.',
        'Badge applies accessibilityRole="text" so screen readers speak status clearly without announcing it as a button.',
      ]}
      codeSnippet={`import { Badge } from '@shani/ui';

export function ParcelStatusBadge({ status }: { status: 'delivered' | 'delayed' }) {
  if (status === 'delivered') {
    return <Badge variant="success" dot={true}>Delivered</Badge>;
  }
  return <Badge variant="warning" dot={true}>Delayed</Badge>;
}`}
    />
  );
}

