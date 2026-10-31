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

export default function ButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentPage
      title="Button"
      description="Primary action primitive built on usePressable with Reanimated UI-thread micro-interactions, loading states, and WCAG AA contrast."
      category="Actions"
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
          <HStack spacing="2" align="center">
            <Text variant="caption">Variant:</Text>
            {(['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as ButtonVariant[]).map((v) => (
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
          <HStack spacing="2" align="center">
            <Text variant="caption">Toggles:</Text>
            <Button
              variant={loading ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setLoading(!loading)}
            >
              Toggle Loading
            </Button>
            <Button
              variant={disabled ? 'danger' : 'secondary'}
              size="sm"
              onPress={() => setDisabled(!disabled)}
            >
              Toggle Disabled
            </Button>
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
      propsData={[
        { name: 'variant', type: "'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'", default: "'primary'", description: 'Visual style tier.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size tier. All sizes strictly meet ≥44pt touch minimum.' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Displays an activity indicator and announces busy state.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables press interactions and applies disabled tokens.' },
        { name: 'leftIcon', type: 'LucideIconName', default: 'undefined', description: 'Icon rendered before button text.' },
        { name: 'rightIcon', type: 'LucideIconName', default: 'undefined', description: 'Icon rendered after button text.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expands button to fill parent container width.' },
      ]}
      dos={[
        'Use primary for the single most important action on a screen (e.g. Complete Delivery).',
        'Use danger for destructive, irreversible operations (e.g. Cancel Shipment).',
        'Use loading prop during background network submissions to prevent double taps.',
      ]}
      donts={[
        'Never place two primary buttons in the same container; use primary + secondary.',
        'Never shrink buttons below size="sm" (44pt) on mobile screens.',
      ]}
      a11yNotes={[
        'Button automatically manages accessibilityRole="button" and accessibilityState={{ disabled, busy: loading }}.',
        'Uses Reanimated snappy spring physics on the native UI thread, respecting system reduced-motion settings.',
      ]}
      codeSnippet={`import { Button } from '@shani/ui';

export function DispatchAction() {
  return (
    <Button
      variant="primary"
      size="lg"
      leftIcon="CheckCircle"
      onPress={() => console.log('Confirmed')}
    >
      Confirm Delivery
    </Button>
  );
}`}
    />
  );
}

