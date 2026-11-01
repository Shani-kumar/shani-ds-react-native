import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  type TextVariant,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function TextPage() {
  const [variant, setVariant] = useState<TextVariant>('title');

  return (
    <ComponentPage
      title="Text"
      description="Accessible typography primitive with 6 semantic variants, automated header roles, and Dynamic Type protection."
      category="Foundation"
      playground={
        <VStack spacing="2" align="center">
          <Text variant={variant}>
            {variant === 'display' ? 'Expedited Freight' : 'Order Tracking #SHN-94812'}
          </Text>
          <Text variant="caption">Active variant: {variant}</Text>
        </VStack>
      }
      playgroundControls={
        <HStack spacing="2" wrap={true}>
          {(['display', 'heading', 'title', 'body', 'label', 'caption'] as TextVariant[]).map((v) => (
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
      }
      allStates={
        <VStack spacing="4">
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <VStack spacing="3">
              <Text variant="display">Display: 32pt Semibold</Text>
              <Text variant="heading">Heading: 24pt Semibold</Text>
              <Text variant="title">Title: 18pt Medium</Text>
              <Text variant="body">Body: 16pt Regular - Standard courier instructions and shipment manifest notes.</Text>
              <Text variant="label">Label: 14pt Semibold - Form labels & table headers</Text>
              <Text variant="caption">Caption: 12pt Regular - Timestamps, helper hints, tracking metadata</Text>
            </VStack>
          </Box>
        </VStack>
      }
      propsData={[
        {
          name: 'children',
          type: 'React text or node',
          default: 'required',
          description: 'Text string or nested React elements to render within the typography scale.',
          example: 'children="Priority Overnight Waybill"',
        },
        {
          name: 'variant',
          type: "'display' | 'heading' | 'title' | 'body' | 'label' | 'caption'",
          default: "'body'",
          description: 'Typography scale token mapping font size, line height, and default weight (display=32pt, heading=24pt, title=18pt, body=16pt, label=14pt, caption=12pt).',
          example: 'variant="title"',
        },
        {
          name: 'color',
          type: "'primary' | 'secondary' | 'tertiary' | 'brand' | 'danger' | 'warning' | 'success' | 'info' | 'inverse'",
          default: "'primary'",
          description: 'Semantic text token. All color pairings are strictly validated for WCAG 2.1 AA (≥4.5:1) compliance.',
          example: 'color="brand"',
        },
        {
          name: 'weight',
          type: "'regular' | 'medium' | 'semibold' | 'bold'",
          default: 'None',
          description: 'Optional font weight override. If omitted, uses variant defaults (e.g. semibold for heading, regular for body).',
          example: 'weight="semibold"',
        },
        {
          name: 'align',
          type: "'auto' | 'left' | 'right' | 'center' | 'justify'",
          default: "'left'",
          description: 'Text alignment across available container width.',
          example: 'align="center"',
        },
        {
          name: 'maxFontSizeMultiplier',
          type: 'number',
          default: '2.0',
          description: 'Caps Dynamic Type scaling to prevent text truncation in fixed logistics cards while supporting low-vision users.',
          example: 'maxFontSizeMultiplier={2.0}',
        },
        {
          name: 'allowFontScaling',
          type: 'boolean',
          default: 'true',
          description: 'Enables OS-level font accessibility scaling for assistive technology.',
          example: 'allowFontScaling={true}',
        },
        {
          name: 'style',
          type: 'StyleProp<TextStyle>',
          default: 'None',
          description: 'Outer layout overrides only (flexShrink, maxWidth, textTransform). Font sizes and colors must use tokens.',
          example: 'style={{ flexShrink: 1, minWidth: 0 }}',
        },
      ]}
      dos={[
        'Use semantic variants (heading, title, body) rather than overriding fontSize directly.',
        'Always keep allowFontScaling enabled for accessibility compliance.',
        'Use caption for metadata like carrier timestamps and tracking numbers.',
      ]}
      donts={[
        'Never use raw hex colors or inline style font sizes on Text.',
        'Never disable allowFontScaling to fix card layouts; adjust card flex/padding instead.',
      ]}
      a11yNotes={[
        'Heading and display variants automatically apply accessibilityRole="header" for assistive screen reader navigation.',
        'Default maxFontSizeMultiplier of 2.0 accommodates vision-impaired warehouse workers without breaking layout flow.',
      ]}
      codeSnippet={`import { Text, VStack } from '@shani/ui';

// 1. Plain Text usage:
export function StatusLabel() {
  return (
    <Text variant="body" color="primary">
      Package Out for Delivery
    </Text>
  );
}

// 2. Composing with layout:
export function WaybillHeader() {
  return (
    <VStack spacing="1">
      <Text variant="heading">Shipment #849102</Text>
      <Text variant="caption" color="secondary">
        Created at 08:30 AM • Priority Overnight
      </Text>
    </VStack>
  );
}`}
    />
  );
}

