import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  type TextVariant,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Text');

export default function TextPage() {
  const [variant, setVariant] = useState<TextVariant>('title');

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
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
            <SegmentedOption
              key={v}
              label={v}
              selected={variant === v}
              onPress={() => setVariant(v)}
            />
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
      propsData={formatPropsForGallery(doc.props)}
      dos={doc.whenToUse}
      donts={doc.whenNotToUse}
      a11yNotes={doc.accessibilityNotes}
      codeSnippet={doc.example}
    />
  );
}

