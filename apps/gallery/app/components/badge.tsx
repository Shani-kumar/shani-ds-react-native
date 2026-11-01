import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  type BadgeVariant,
  type BadgeSize,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Badge');

export default function BadgePage() {
  const [variant, setVariant] = useState<BadgeVariant>('success');
  const [size, setSize] = useState<BadgeSize>('md');
  const [dot, setDot] = useState(true);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
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
              <SegmentedOption
                key={v}
                label={v}
                selected={variant === v}
                onPress={() => setVariant(v)}
              />
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Size & Dot:</Text>
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
            <SegmentedOption
              label={`Dot: ${dot ? 'On' : 'Off'}`}
              selected={dot}
              onPress={() => setDot(!dot)}
            />
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
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}

