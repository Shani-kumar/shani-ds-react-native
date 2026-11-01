import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  type ButtonVariant,
  type ButtonSize,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('IconButton');

export default function IconButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('secondary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [shape, setShape] = useState<'square' | 'circle'>('circle');

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="2" align="center">
          <IconButton
            name="Search"
            accessibilityLabel="Search shipments"
            variant={variant}
            size={size}
            shape={shape}
          />
          <Text variant="caption">
            Variant: {variant} | Size: {size} | Shape: {shape}
          </Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Variant:</Text>
            {(['primary', 'secondary', 'tertiary', 'ghost', 'danger'] as ButtonVariant[]).map((v) => (
              <SegmentedOption
                key={v}
                label={v}
                selected={variant === v}
                onPress={() => setVariant(v)}
              />
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Shape:</Text>
            <SegmentedOption
              label="Circle"
              selected={shape === 'circle'}
              onPress={() => setShape('circle')}
            />
            <SegmentedOption
              label="Square"
              selected={shape === 'square'}
              onPress={() => setShape('square')}
            />
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Size:</Text>
            {(['sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
              <SegmentedOption
                key={s}
                label={`${s} (${s === 'sm' ? '44pt' : s === 'md' ? '48pt' : '56pt'})`}
                selected={size === s}
                onPress={() => setSize(s)}
              />
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Action Bar Icons</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="4" align="center" wrap={true}>
              <IconButton
                name="Filter"
                accessibilityLabel="Filter shipments"
                variant="secondary"
                shape="circle"
              />
              <IconButton
                name="QrCode"
                accessibilityLabel="Scan barcode"
                variant="primary"
                shape="square"
              />
              <IconButton
                name="Share2"
                accessibilityLabel="Share tracking link"
                variant="tertiary"
                shape="circle"
              />
              <IconButton
                name="Trash2"
                accessibilityLabel="Delete draft order"
                variant="danger"
                shape="circle"
              />
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

