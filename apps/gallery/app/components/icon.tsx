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

export default function IconPage() {
  const [size, setSize] = useState<IconSize>('lg');
  const [color, setColor] = useState<IconColor>('brand');

  return (
    <ComponentPage
      title="Icon"
      description="Tokenized wrapper around Lucide icons mapping design system sizes, semantic colors, and screen reader roles."
      category="Foundation"
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
      propsData={[
        {
          name: 'name',
          type: 'string',
          default: 'None',
          description: "PascalCase string name of any Lucide icon (e.g. 'Truck', 'Clock', 'Package'). Use either 'name' or 'icon'.",
          example: 'name="Truck"',
        },
        {
          name: 'icon',
          type: 'Lucide icon component',
          default: 'None',
          description: "Direct Lucide icon component. Requires import from 'lucide-react-native'.",
          example: 'icon={Truck}',
        },
        {
          name: 'size',
          type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
          default: "'md'",
          description: 'Icon size token (xs=12, sm=16, md=20, lg=24, xl=32) or numeric pixel size.',
          example: 'size="md"',
        },
        {
          name: 'color',
          type: "'primary' | 'secondary' | 'tertiary' | 'brand' | 'danger' | 'warning' | 'success' | 'info' | 'inverse'",
          default: "'primary'",
          description: 'Semantic color mapping from theme tokens. Resolves to contrast-checked palette values.',
          example: 'color="success"',
        },
        {
          name: 'strokeWidth',
          type: 'number',
          default: '2',
          description: 'Stroke width in pixels for SVG icon line thickness.',
          example: 'strokeWidth={2}',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          default: 'None',
          description: 'Spoken description for screen readers. If omitted, icon is decorative (accessible={false}). When provided, sets accessibilityRole="image".',
          example: 'accessibilityLabel="Delivered package"',
        },
        {
          name: 'style',
          type: 'StyleProp<ViewStyle>',
          default: 'None',
          description: 'Outer layout positioning only (margin, transform). Icon dimensions and colors must come from tokens.',
          example: 'style={{ marginLeft: 8 }}',
        },
      ]}
      dos={[
        "Use either 'name=\"Truck\"' or 'icon={Truck}' with semantic color tokens (success, warning, brand).",
        'Provide accessibilityLabel if the icon conveys standalone information without adjacent text.',
        'Match icon sizes to typography scale (sm with caption, md with body, lg with title).',
      ]}
      donts={[
        'Never pass arbitrary pixel sizes or raw hex codes to Icon.',
        'Never leave interactive icon buttons unlabelled; use IconButton instead of bare Icon.',
      ]}
      a11yNotes={[
        'Icons default to accessible={false} so decorative icons do not clutter screen reader output.',
        'When accessibilityLabel is provided, Icon automatically sets accessibilityRole="image".',
      ]}
      codeSnippet={`import { Icon, HStack, Text } from '@shani/ui';
import { CheckCircle } from 'lucide-react-native';

export function DeliveryStatus() {
  return (
    <HStack spacing="2" align="center">
      {/* Option 1: Via PascalCase string name */}
      <Icon name="CheckCircle" size="sm" color="success" />

      {/* Option 2: Via direct Lucide component */}
      <Icon icon={CheckCircle} size="sm" color="success" />

      <Text variant="body">Signature Received</Text>
    </HStack>
  );
}`}
    />
  );
}

