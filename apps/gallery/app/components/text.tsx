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
              <Text variant="display">Display: 30pt Semibold</Text>
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
        { name: 'variant', type: "'display' | 'heading' | 'title' | 'body' | 'label' | 'caption'", default: "'body'", description: 'Typography scale mapping font size, line height, and weight.' },
        { name: 'color', type: 'TextColor', default: "'primary'", description: 'Semantic text token (primary, secondary, tertiary, brand, danger, etc.).' },
        { name: 'align', type: "'auto' | 'left' | 'right' | 'center' | 'justify'", default: "'left'", description: 'Text alignment.' },
        { name: 'maxFontSizeMultiplier', type: 'number', default: '2.0', description: 'Caps Dynamic Type scaling to prevent text truncation in fixed logistics cards.' },
        { name: 'allowFontScaling', type: 'boolean', default: 'true', description: 'Enables system text accessibility scaling.' },
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

export function WaybillHeader() {
  return (
    <VStack spacing="1">
      <Text variant="heading">Shipment #849102</Text>
      <Text variant="caption" color="secondary">Created at 08:30 AM • Priority Overnight</Text>
    </VStack>
  );
}`}
    />
  );
}

