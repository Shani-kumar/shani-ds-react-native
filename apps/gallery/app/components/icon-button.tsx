import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  type ButtonVariant,
  type ButtonSize,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

export default function IconButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('secondary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [shape, setShape] = useState<'square' | 'circle'>('circle');

  return (
    <ComponentPage
      title="IconButton"
      description="Touch-optimized 44x44 icon button with compile-time mandatory accessibility labels and UI-thread spring physics."
      category="Actions"
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
          <HStack spacing="2" align="center">
            <Text variant="caption">Variant:</Text>
            {(['primary', 'secondary', 'tertiary', 'ghost', 'danger'] as ButtonVariant[]).map((v) => (
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
          <HStack spacing="2" align="center">
            <Text variant="caption">Shape:</Text>
            <Button
              variant={shape === 'circle' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setShape('circle')}
            >
              Circle
            </Button>
            <Button
              variant={shape === 'square' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setShape('square')}
            >
              Square
            </Button>
          </HStack>
          <HStack spacing="2" align="center">
            <Text variant="caption">Size:</Text>
            {(['sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
              <Button
                key={s}
                variant={size === s ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setSize(s)}
              >
                {s} ({s === 'sm' ? '44pt' : s === 'md' ? '48pt' : '56pt'})
              </Button>
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Action Bar Icons</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="4" align="center">
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
      propsData={[
        { name: 'accessibilityLabel', type: 'string', default: 'STRICTLY MANDATORY', description: 'Screen reader label. TypeScript throws a compile-time error if omitted.' },
        { name: 'name', type: 'LucideIconName', default: 'required', description: 'PascalCase name of Lucide icon.' },
        { name: 'variant', type: "'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'", default: "'secondary'", description: 'Visual style tier.' },
        { name: 'shape', type: "'circle' | 'square'", default: "'square'", description: 'Corner geometry.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button touch area (min 44x44pt).' },
      ]}
      dos={[
        'Always provide descriptive accessibilityLabels explaining the action (e.g. "Scan tracking barcode").',
        'Use size="sm" in dense toolbars where 44x44pt preserves touch target compliance.',
      ]}
      donts={[
        'Never use generic labels like "button" or "icon".',
        'Never create custom icon buttons with raw Pressable; use IconButton to ensure 44pt touch areas.',
      ]}
      a11yNotes={[
        'IconButton strictly mandates accessibilityLabel: string in TypeScript to prevent unlabeled buttons from ever compiling.',
        'Meets WCAG 2.5.5 Target Size minimum (44x44pt) across all platform devices.',
      ]}
      codeSnippet={`import { IconButton } from '@shani/ui';

export function WaybillScanner() {
  return (
    <IconButton
      name="QrCode"
      accessibilityLabel="Scan package barcode"
      variant="primary"
      size="md"
      shape="circle"
      onPress={() => console.log('Scanning')}
    />
  );
}`}
    />
  );
}

