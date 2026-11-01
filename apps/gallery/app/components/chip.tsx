import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Chip,
  ChipGroup,
  type ChipSize,
  type ChipGroupItem,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('ChipGroup');

const FILTER_OPTIONS: ChipGroupItem[] = [
  { value: 'all', label: 'All Fleet', leftIcon: 'Layers' },
  { value: 'air', label: 'Air Express', leftIcon: 'Plane' },
  { value: 'ground', label: 'Ground Freight', leftIcon: 'Truck' },
  { value: 'cold', label: 'Cold Storage', leftIcon: 'Snowflake' },
];

export default function ChipPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [size, setSize] = useState<ChipSize>('md');
  const [scrollable, setScrollable] = useState(false);

  return (
    <ComponentPage
      title="Chip & ChipGroup"
      description="Interactive pill selection controls built on useSelection and usePressable with guaranteed 44pt touch targets."
      category="Forms"
      playground={
        <VStack spacing="4" align="center" style={{ width: '100%' }}>
          <ChipGroup
            label="Dispatch Filter"
            mode="single"
            value={selectedFilter}
            onChange={(val) => setSelectedFilter(val as string)}
            options={FILTER_OPTIONS}
            size={size}
            scrollable={scrollable}
          />
          <Text variant="caption">
            Active: {selectedFilter} | Size: {size} | Scrollable: {scrollable ? 'Yes' : 'No (Wrap)'}
          </Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Size:</Text>
            <SegmentedOption
              label="Small (sm)"
              selected={size === 'sm'}
              onPress={() => setSize('sm')}
            />
            <SegmentedOption
              label="Medium (md)"
              selected={size === 'md'}
              onPress={() => setSize('md')}
            />
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Layout Mode:</Text>
            <SegmentedOption
              label="Wrap (Default)"
              selected={!scrollable}
              onPress={() => setScrollable(false)}
            />
            <SegmentedOption
              label="Horizontal Scroll"
              selected={scrollable}
              onPress={() => setScrollable(true)}
            />
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Individual Chip States</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="3" wrap={true} align="center">
              <Chip label="Unselected" selected={false} onPress={() => {}} />
              <Chip label="Selected Brand" selected={true} leftIcon="Check" onPress={() => {}} />
              <Chip label="With Icon" leftIcon="Tag" selected={false} onPress={() => {}} />
              <Chip label="Disabled" disabled={true} onPress={() => {}} />
              <Chip label="Small (sm)" size="sm" selected={true} onPress={() => {}} />
            </HStack>
          </Box>
        </VStack>
      }
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}
