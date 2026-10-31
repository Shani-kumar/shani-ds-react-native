import { useState } from 'react';
import type { SpacingKey } from '@shani/tokens';
import {
  Box,
  Stack,
  HStack,
  VStack,
  Text,
  Button,
  Divider,
  type StackAlign,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function BoxStackPage() {
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');
  const [spacing, setSpacing] = useState<SpacingKey>('4');
  const [align, setAlign] = useState<StackAlign>('stretch');

  return (
    <ComponentPage
      title="Box & Stack"
      description="Foundational layout primitives enforcing the strict 4pt spacing scale, alignment constraints, and divider injection."
      category="Foundation"
      playground={
        <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline" style={{ width: '100%' }}>
          <Stack direction={direction} spacing={spacing} align={align}>
            <Box p="3" bg="brandSubtle" borderRadius="sm" borderColor="brand" borderWidth="hairline">
              <Text variant="label">Parcel A (Express)</Text>
            </Box>
            <Box p="3" bg="surfaceRaised" borderRadius="sm" borderColor="default" borderWidth="hairline">
              <Text variant="label">Parcel B (Standard)</Text>
            </Box>
            <Box p="3" bg="brandSubtle" borderRadius="sm" borderColor="brand" borderWidth="hairline">
              <Text variant="label">Parcel C (Freight)</Text>
            </Box>
          </Stack>
        </Box>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center">
            <Text variant="caption">Direction:</Text>
            <Button
              variant={direction === 'vertical' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setDirection('vertical')}
            >
              Vertical
            </Button>
            <Button
              variant={direction === 'horizontal' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setDirection('horizontal')}
            >
              Horizontal
            </Button>
          </HStack>
          <HStack spacing="2" align="center">
            <Text variant="caption">Alignment:</Text>
            {(['stretch', 'center', 'start'] as StackAlign[]).map((a) => (
              <Button
                key={a}
                variant={align === a ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setAlign(a)}
              >
                {a}
              </Button>
            ))}
          </HStack>
          <HStack spacing="2" align="center">
            <Text variant="caption">Spacing:</Text>
            {(['2', '4', '6', '8'] as SpacingKey[]).map((sp) => (
              <Button
                key={sp}
                variant={spacing === sp ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setSpacing(sp)}
              >
                {sp} ({parseInt(sp, 10) * 4}pt)
              </Button>
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">HStack with Divider Injection</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="4" align="center" divider={<Divider orientation="vertical" />}>
              <Text variant="caption">Origin: LAX</Text>
              <Text variant="caption">Transit: ORD</Text>
              <Text variant="caption">Dest: JFK</Text>
            </HStack>
          </Box>
          <Text variant="label">VStack with Semantic Padding & Borders</Text>
          <Box p="4" bg="surfaceRaised" borderRadius="lg" shadow="sm">
            <VStack spacing="2">
              <Text variant="title">Dispatch Route #412</Text>
              <Text variant="caption">Driver: Sarah Jenkins | Vehicle: Van 14</Text>
            </VStack>
          </Box>
        </VStack>
      }
      propsData={[
        { name: 'direction', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Linear distribution axis for child components.' },
        { name: 'spacing', type: 'SpacingKey', default: 'undefined', description: 'Space between children mapped to strict 4pt tokens (e.g. 1=4pt, 4=16pt).' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'", description: 'Cross-axis alignment.' },
        { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis alignment.' },
        { name: 'divider', type: 'React.ReactNode', default: 'undefined', description: 'Divider component automatically injected between each child.' },
      ]}
      dos={[
        'Use Stack, HStack, and VStack for all linear content spacing instead of manual margins.',
        'Use tokenized spacing values (2, 4, 6) to keep 15+ logistics apps on a harmonious 4pt grid.',
        'Use the divider prop for automated separator injection in shipment summary lists.',
      ]}
      donts={[
        'Never hardcode raw pixel margins (e.g. marginBottom: 13) in application components.',
        'Never mix arbitrary flexbox alignment props on container views.',
      ]}
      a11yNotes={[
        'Stack and Box pass through accessibility props to native Views without interfering with screen reader hierarchies.',
        'Divider automatically sets accessible={false} and accessibilityRole="none" so non-interactive dividers do not announce clutter.',
      ]}
      codeSnippet={`import { Box, HStack, VStack, Text, Divider } from '@shani/ui';

export function ShipmentSummary() {
  return (
    <Box p="4" bg="surface" borderRadius="md" shadow="sm">
      <VStack spacing="3">
        <Text variant="title">Waybill Details</Text>
        <HStack spacing="4" divider={<Divider orientation="vertical" />}>
          <Text variant="caption">Weight: 14.2 kg</Text>
          <Text variant="caption">Pieces: 3</Text>
        </HStack>
      </VStack>
    </Box>
  );
}`}
    />
  );
}
