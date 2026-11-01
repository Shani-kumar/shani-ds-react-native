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
      propsData={[
        {
          name: 'children',
          type: 'string | React element',
          default: 'required',
          description: 'Button text label or nested content describing the primary action.',
          example: 'children="Confirm Waybill"',
        },
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'",
          default: "'primary'",
          description: 'Visual style tier establishing action hierarchy.',
          example: 'variant="primary"',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Button size tier. All sizes strictly meet ≥44x44pt touch target minimums (sm=44pt, md=48pt, lg=56pt).',
          example: 'size="md"',
        },
        {
          name: 'onPress',
          type: '(event: GestureResponderEvent) => void',
          default: 'None',
          description: 'Callback invoked on tap or press release.',
          example: 'onPress={() => handleDispatch()}',
        },
        {
          name: 'leftIcon',
          type: 'Lucide icon component, name, or React element',
          default: 'None',
          description: "Leading icon rendered before button text. Accepts PascalCase string name (e.g. 'Truck') or direct Lucide component.",
          example: 'leftIcon="Truck"',
        },
        {
          name: 'rightIcon',
          type: 'Lucide icon component, name, or React element',
          default: 'None',
          description: "Trailing icon rendered after button text. Accepts PascalCase string name (e.g. 'ChevronRight') or direct Lucide component.",
          example: 'rightIcon="ChevronRight"',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Displays an activity indicator, disables taps, and sets accessibilityState.busy.',
          example: 'loading={isSubmitting}',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables press interactions and applies muted tokens with accessible contrast.',
          example: 'disabled={!isFormValid}',
        },
        {
          name: 'fullWidth',
          type: 'boolean',
          default: 'false',
          description: 'Expands button to occupy 100% width of its parent container.',
          example: 'fullWidth={true}',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'None',
          description: 'Spoken label for screen readers. Defaults to the string value of children if omitted.',
          example: 'accessibilityLabel="Confirm consignment dispatch"',
        },
        {
          name: 'accessibilityHint',
          type: 'string',
          default: 'None',
          description: 'Additional guidance describing the consequence of performing the action.',
          example: 'accessibilityHint="Navigates to tracking summary"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout constraints only (margin, flex, alignSelf). Padding, height, radius, and colors come from tokens.',
          example: 'style={{ marginTop: 16 }}',
        },
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

