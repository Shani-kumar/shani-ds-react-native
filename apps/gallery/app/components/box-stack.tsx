import { useState } from 'react';
import type { SpacingKey } from '@shani/tokens';
import {
  Box,
  Stack,
  HStack,
  VStack,
  Text,
  Divider,
  type StackAlign,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const stackDoc = getComponentDoc('Stack');

export default function BoxStackPage() {
  const [direction, setDirection] = useState<'vertical' | 'horizontal'>('horizontal');
  const [spacing, setSpacing] = useState<SpacingKey>('4');
  const [align, setAlign] = useState<StackAlign>('stretch');
  const [wrap, setWrap] = useState<boolean>(true);

  return (
    <ComponentPage
      title="Box & Stack"
      description="Foundational layout primitives enforcing the strict 4pt spacing scale, alignment constraints, and divider injection."
      category="Foundation"
      playground={
        <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline" style={{ width: '100%' }}>
          <Stack direction={direction} spacing={spacing} align={align} wrap={wrap}>
            <Box p="3" bg="brandSubtle" borderRadius="sm" borderColor="brand" borderWidth="hairline" style={{ minWidth: 0, flexShrink: 1 }}>
              <Text variant="label" numberOfLines={1}>Parcel A</Text>
            </Box>
            <Box p="3" bg="surfaceRaised" borderRadius="sm" borderColor="default" borderWidth="hairline" style={{ minWidth: 0, flexShrink: 1 }}>
              <Text variant="label" numberOfLines={1}>Parcel B</Text>
            </Box>
            <Box p="3" bg="brandSubtle" borderRadius="sm" borderColor="brand" borderWidth="hairline" style={{ minWidth: 0, flexShrink: 1 }}>
              <Text variant="label" numberOfLines={1}>Parcel C</Text>
            </Box>
          </Stack>
        </Box>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Direction:</Text>
            <SegmentedOption
              label="Vertical"
              selected={direction === 'vertical'}
              onPress={() => setDirection('vertical')}
            />
            <SegmentedOption
              label="Horizontal"
              selected={direction === 'horizontal'}
              onPress={() => {
                setDirection('horizontal');
                setWrap(true);
              }}
            />
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Wrap:</Text>
            <SegmentedOption
              label="On"
              selected={wrap}
              onPress={() => setWrap(true)}
            />
            <SegmentedOption
              label="Off"
              selected={!wrap}
              onPress={() => setWrap(false)}
            />
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Alignment:</Text>
            {(['stretch', 'center', 'start'] as StackAlign[]).map((a) => (
              <SegmentedOption
                key={a}
                label={a}
                selected={align === a}
                onPress={() => setAlign(a)}
              />
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Spacing:</Text>
            {(['2', '4', '6', '8'] as SpacingKey[]).map((sp) => (
              <SegmentedOption
                key={sp}
                label={`${sp} (${parseInt(sp, 10) * 4}pt)`}
                selected={spacing === sp}
                onPress={() => setSpacing(sp)}
              />
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">HStack with Divider Injection</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="4" align="center" wrap={true} divider={<Divider orientation="vertical" />}>
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
      propsData={formatPropsForGallery(stackDoc.props)}
      dos={stackDoc.whenToUse}
      donts={stackDoc.whenNotToUse}
      a11yNotes={stackDoc.accessibilityNotes}
      codeSnippet={stackDoc.example}
    />
  );
}
