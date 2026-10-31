import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  type IconSize,
  type IconColor,
} from '@shani/ui';
import { ComponentPage } from '../../src/components/ComponentPage';

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
          <HStack spacing="2" align="center">
            <Text variant="caption">Size:</Text>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as IconSize[]).map((s) => (
              <Button
                key={s}
                variant={size === s ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </HStack>
          <HStack spacing="2" align="center">
            <Text variant="caption">Color:</Text>
            {(['primary', 'secondary', 'brand', 'success', 'warning', 'danger'] as IconColor[]).map((c) => (
              <Button
                key={c}
                variant={color === c ? 'primary' : 'ghost'}
                size="sm"
                onPress={() => setColor(c)}
              >
                {c}
              </Button>
            ))}
          </HStack>
        </VStack>
      }
      allStates={
        <VStack spacing="4">
          <Text variant="label">Logistics Status Icons</Text>
          <Box p="4" bg="surface" borderRadius="md" borderColor="subtle" borderWidth="hairline">
            <HStack spacing="6" align="center">
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
        { name: 'name', type: 'LucideIconName', default: 'required', description: 'PascalCase name of any supported Lucide icon (e.g. Truck, Package, Clock).' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Icon size token: xs=12, sm=16, md=20, lg=24, xl=32.' },
        { name: 'color', type: 'IconColor', default: "'primary'", description: 'Semantic color mapping from theme tokens.' },
        { name: 'accessibilityLabel', type: 'string', default: 'undefined', description: 'Spoken description. If omitted, icon is treated as decorative (accessible={false}).' },
      ]}
      dos={[
        'Use semantic color tokens (success, warning, brand) to signify status.',
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

export function DeliveryStatus() {
  return (
    <HStack spacing="2" align="center">
      <Icon name="CheckCircle" size="sm" color="success" />
      <Text variant="body">Signature Received</Text>
    </HStack>
  );
}`}
    />
  );
}

