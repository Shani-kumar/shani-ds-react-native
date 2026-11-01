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
      propsData={[
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'required',
          description: 'Spoken description for screen readers. Strictly required in TypeScript to prevent unlabeled icon buttons.',
          example: 'accessibilityLabel="Scan package barcode"',
        },
        {
          name: 'name',
          type: 'string',
          default: 'None',
          description: "PascalCase name of any supported Lucide icon (e.g. 'Printer', 'Share2', 'QrCode'). Use either 'name' or 'icon'.",
          example: 'name="QrCode"',
        },
        {
          name: 'icon',
          type: 'Lucide icon component',
          default: 'None',
          description: "Direct Lucide icon component reference. Requires import from 'lucide-react-native'.",
          example: 'icon={QrCode}',
        },
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'",
          default: "'ghost'",
          description: 'Visual style tier establishing action hierarchy.',
          example: 'variant="primary"',
        },
        {
          name: 'shape',
          type: "'square' | 'circle'",
          default: "'square'",
          description: 'Corner geometry (square uses theme.radius.md; circle uses theme.radius.full).',
          example: 'shape="circle"',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Button touch area strictly enforcing ≥44x44pt minimums (sm=44x44, md=48x48, lg=56x56).',
          example: 'size="md"',
        },
        {
          name: 'onPress',
          type: '(event: GestureResponderEvent) => void',
          default: 'None',
          description: 'Callback invoked on tap or press release.',
          example: 'onPress={() => handleScan()}',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Displays a spinner indicator and temporarily disables taps.',
          example: 'loading={false}',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables press interactions and applies muted tokens with accessible contrast.',
          example: 'disabled={false}',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout positioning only (margin). Touch target dimensions and colors must come from tokens.',
          example: 'style={{ marginLeft: 8 }}',
        },
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

