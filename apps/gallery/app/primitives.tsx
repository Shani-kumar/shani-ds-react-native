import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Divider,
  useTheme,
} from '@shani/ui';
import { GalleryHeader } from '../src/components/GalleryHeader';

interface HookDoc {
  name: string;
  category: string;
  description: string;
  returns: string;
  example: string;
}

const HOOKS: HookDoc[] = [
  {
    name: 'useSelection',
    category: 'State & Selection',
    description:
      'Orchestrates single or multiple selection state for chip groups, filter bars, and segmented controls with automatic ARIA radiogroup/checkbox roles.',
    returns:
      '{ selected, isSelected(val), select(val), toggle(val), setSelected(val), getItemProps(val) }',
    example: `import { useSelection } from '@shani/ui';

export function StatusFilter() {
  const { selected, getItemProps } = useSelection({
    mode: 'single',
    defaultValue: 'all',
  });

  return (
    <View {...getItemProps('in_transit')}>
      <Text>In Transit ({selected === 'in_transit' ? 'Selected' : 'Inactive'})</Text>
    </View>
  );
}`,
  },
  {
    name: 'useCounter',
    category: 'State & Numbers',
    description:
      'Manages bounded stepped numeric counter states with limits clamping, canIncrement/canDecrement flags, and VoiceOver adjustable accessibility.',
    returns:
      '{ value, setValue(val), increment(), decrement(), canIncrement, canDecrement, adjustableProps }',
    example: `import { useCounter } from '@shani/ui';

export function PalletCounter() {
  const { value, increment, decrement, adjustableProps } = useCounter({
    defaultValue: 1,
    min: 1,
    max: 10,
  });

  return (
    <View {...adjustableProps}>
      <Button onPress={decrement} title="-" />
      <Text>{value} pallets</Text>
      <Button onPress={increment} title="+" />
    </View>
  );
}`,
  },
  {
    name: 'usePressable',
    category: 'Gestures & Micro-interactions',
    description:
      'Encapsulates press responder lifecycle, hover/focus states, and ARIA button contracts with zero visual styling opinions.',
    returns:
      '{ state: { isPressed, isHovered, isFocused, isDisabled, isLoading }, pressableProps }',
    example: `import { usePressable } from '@shani/ui';

export function CustomCardAction() {
  const { state, pressableProps } = usePressable({
    onPress: () => console.log('Tapped'),
    accessibilityLabel: 'Track shipment',
  });

  return (
    <Pressable {...pressableProps}>
      <Text>{state.isPressed ? 'Pressed' : 'Resting'}</Text>
    </Pressable>
  );
}`,
  },
  {
    name: 'useToggle',
    category: 'State & Binary',
    description:
      'Manages binary boolean state with controlled/uncontrolled synchronization and native checkbox, switch, or radio accessibility states.',
    returns:
      '{ state: { isChecked, isPressed, isFocused, isDisabled, toggle }, toggleProps }',
    example: `import { useToggle } from '@shani/ui';

export function DarkModeToggle() {
  const { state, toggleProps } = useToggle({
    defaultChecked: false,
    role: 'switch',
  });

  return (
    <Pressable {...toggleProps}>
      <Text>Night Mode: {state.isChecked ? 'ON' : 'OFF'}</Text>
    </Pressable>
  );
}`,
  },
  {
    name: 'useTextField',
    category: 'Forms & Inputs',
    description:
      'Orchestrates text input focus lifecycles, error states, and floating helper/label accessibility bindings.',
    returns:
      '{ state: { isFocused, isHovered, isFilled, hasError }, inputProps, labelProps, helperProps }',
    example: `import { useTextField } from '@shani/ui';

export function WaybillSearch() {
  const { state, inputProps, labelProps } = useTextField({
    label: 'Tracking ID',
  });

  return (
    <View>
      <Text {...labelProps}>Tracking ID</Text>
      <TextInput {...inputProps} />
    </View>
  );
}`,
  },
  {
    name: 'useDisclosure',
    category: 'Layout & Overlays',
    description:
      'Headless disclosure primitive for collapsible cargo inspection run-sheets, accordion details, and filter sheets.',
    returns:
      '{ isOpen, onOpen(), onClose(), onToggle(), getButtonProps(), getDisclosureProps() }',
    example: `import { useDisclosure } from '@shani/ui';

export function ManifestDetails() {
  const { isOpen, onToggle, getButtonProps } = useDisclosure();

  return (
    <View>
      <Button {...getButtonProps()} onPress={onToggle}>
        {isOpen ? 'Hide Cargo Items' : 'View Cargo Items'}
      </Button>
      {isOpen && <Text>4 Pieces, 280 kg, Hazardous</Text>}
    </View>
  );
}`,
  },
];

export default function PrimitivesPage() {
  const { theme } = useTheme();

  return (
    <Box flex={1} bg="canvas">
      <GalleryHeader
        title="Headless Hooks"
        subtitle="Pure behavioral logic, state machines, and ARIA contracts decoupled from styling"
      />

      <ScrollView contentContainerStyle={{ padding: theme.spacing[6] }}>
        <VStack spacing="6">
          <Card variant="outlined" padding="lg">
            <VStack spacing="3">
              <Text variant="title">Why Headless Primitives?</Text>
              <Text variant="body" color="secondary">
                Shani DS separates behavior from presentation. Components like ChipGroup,
                QuantityStepper, Switch, and Button are visual skins over these six headless hooks.
                They manage controlled/uncontrolled synchronization, native ARIA contracts, and
                keyboard/touch focus without hardcoded styles.
              </Text>
            </VStack>
          </Card>

          <VStack spacing="4">
            {HOOKS.map((hook) => (
              <Card key={hook.name} variant="elevated" padding="lg">
                <VStack spacing="3">
                  <HStack justify="between" align="center" wrap={true}>
                    <Text variant="heading">{hook.name}</Text>
                    <Badge variant="brand">{hook.category}</Badge>
                  </HStack>

                  <Text variant="body">{hook.description}</Text>

                  <Box p="3" bg="muted" borderRadius="md">
                    <VStack spacing="1">
                      <Text variant="caption" color="secondary">Returns:</Text>
                      <Text variant="label" style={{ fontFamily: theme.typography.fontFamily.mono }}>
                        {hook.returns}
                      </Text>
                    </VStack>
                  </Box>

                  <Divider />

                  <VStack spacing="2">
                    <Text variant="caption" color="secondary">Example Usage:</Text>
                    <Box
                      p="3"
                      bg="surface"
                      borderRadius="md"
                      borderColor="subtle"
                      borderWidth="hairline"
                    >
                      <Text
                        variant="caption"
                        style={{ fontFamily: theme.typography.fontFamily.mono }}
                      >
                        {hook.example}
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </Card>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
