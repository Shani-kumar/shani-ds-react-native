import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  type ButtonVariant,
  type ButtonSize,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';
import { SegmentedOption } from '../../src/components/SegmentedOption';
import { getComponentDoc, formatPropsForGallery } from '../../src/componentsMeta';

const doc = getComponentDoc('Button');

export default function ButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title={doc.name}
      description={doc.description}
      category={doc.category}
      playground={
        <VStack spacing="2" align="center">
          <Button
            variant={variant}
            size={size}
            loading={loading}
            disabled={disabled}
            leftIcon="Package"
          >
            Confirm Dispatch
          </Button>
          <Text variant="caption">
            Variant: {variant} | Size: {size} | Status: {loading ? 'Loading' : disabled ? 'Disabled' : 'Ready'}
          </Text>
        </VStack>
      }
      playgroundControls={
        <VStack spacing="3">
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Variant:</Text>
            {(['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as ButtonVariant[]).map((v) => (
              <SegmentedOption
                key={v}
                label={v}
                selected={variant === v}
                onPress={() => setVariant(v)}
              />
            ))}
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
          <HStack spacing="2" align="center" wrap={true}>
            <Text variant="caption">Toggles:</Text>
            <SegmentedOption
              label={`Loading: ${loading ? 'On' : 'Off'}`}
              selected={loading}
              onPress={() => setLoading(!loading)}
            />
            <SegmentedOption
              label={`Disabled: ${disabled ? 'On' : 'Off'}`}
              selected={disabled}
              onPress={() => setDisabled(!disabled)}
            />
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">All Variants</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="3" wrap={true}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </HStack>
          </Box>
          <Text variant="label">Interactive States</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="3" wrap={true}>
              <Button variant="primary" loading={true}>Processing</Button>
              <Button variant="primary" disabled={true}>Disabled</Button>
              <Button variant="secondary" leftIcon="Printer">Print Waybill</Button>
              <Button variant="primary" rightIcon="ArrowRight">Next Step</Button>
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

