import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  type IconSize,
  type IconColor,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Icon');

export default function IconPage() {
  const [size, setSize] = useState<IconSize>('lg');
  const [color, setColor] = useState<IconColor>('brand');

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="2" align="center">
          <Icon name="Truck" size={size} color={color} />
          <Text variant="caption">Truck • Size: {size} • Color: {color}</Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Size:</Text>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as IconSize[]).map((s) => (
              <SegmentedOption
                key={s}
                label={s}
                selected={size === s}
                onPress={() => setSize(s)}
              />
            ))}
          </HStack>
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Color:</Text>
            {(['primary', 'secondary', 'brand', 'success', 'warning', 'danger'] as IconColor[]).map((c) => (
              <SegmentedOption
                key={c}
                label={c}
                selected={color === c}
                onPress={() => setColor(c)}
              />
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Logistics Status Icons</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="6" align="center" wrap={true}>
              <VStack spacing="1" align="center">
                <Icon name="PackageCheck" size="md" color="success" />
                <Text variant="caption">Delivered</Text>
              </VStack>
              <VStack spacing="1" align="center">
                <Icon name="Clock" size="md" color="warning" />
                <Text variant="caption">In Transit</Text>
              </VStack>
              <VStack spacing="1" align="center">
                <Icon name="AlertTriangle" size="md" color="danger" />
                <Text variant="caption">Delayed</Text>
              </VStack>
              <VStack spacing="1" align="center">
                <Icon name="MapPin" size="md" color="brand" />
                <Text variant="caption">Origin Hub</Text>
              </VStack>
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

