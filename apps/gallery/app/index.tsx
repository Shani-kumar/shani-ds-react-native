import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  useTheme,
} from '@shani/ui';
import { GalleryHeader } from '../src/components/GalleryHeader';
import { useGallery } from '../src/context/GalleryContext';

interface NavItem {
  title: string;
  description: string;
  path: string;
  category: 'Foundation' | 'Actions' | 'Forms' | 'Display';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Demo: Shipment Tracking',
    description: 'Realistic tracking screen featuring status Badge, ETA Card, Timeline stepper, and Consignment details.',
    path: '/demos/tracking',
    category: 'Display',
    badge: 'Live Demo',
  },
  {
    title: 'Demo: Shipments Fleet List',
    description: 'Production search, status filter chips, interactive Skeleton loading states, and waybill cards.',
    path: '/demos/shipments',
    category: 'Display',
    badge: 'Live Demo',
  },
  {
    title: 'Design Tokens Explorer',
    description: 'Primitive scales, semantic light/dark palettes, WCAG contrast audits, motion & spacing.',
    path: '/tokens',
    category: 'Foundation',
    badge: 'Core',
  },
  {
    title: 'Accessibility & Contrast Audit',
    description: 'Full automated WCAG 2.1 AA report with all 58 contrast checks across Light and Dark themes.',
    path: '/accessibility',
    category: 'Foundation',
    badge: 'WCAG AA',
  },
  {
    title: 'Box & Stack',
    description: 'Layout containers with 4pt grid token spacing, alignment, and divider injection.',
    path: '/components/box-stack',
    category: 'Foundation',
  },
  {
    title: 'Text',
    description: 'Dynamic Type typography variants with auto-heading accessibility and max scaling protection.',
    path: '/components/text',
    category: 'Foundation',
  },
  {
    title: 'Icon',
    description: 'Semantic Lucide icon wrapper with tokenized sizes and colors.',
    path: '/components/icon',
    category: 'Foundation',
  },
  {
    title: 'Button',
    description: 'Accessible action triggers with Reanimated UI-thread spring micro-animations and loading states.',
    path: '/components/button',
    category: 'Actions',
  },
  {
    title: 'IconButton',
    description: 'Strictly accessible 44x44 icon buttons with mandatory accessibility labels.',
    path: '/components/icon-button',
    category: 'Actions',
  },
  {
    title: 'TextField',
    description: 'Form input with accessible error descriptions, prefix/suffix icons, and secure entry toggle.',
    path: '/components/text-field',
    category: 'Forms',
  },
  {
    title: 'Checkbox',
    description: 'Ternary checkbox with checked, unchecked, and indeterminate (mixed) state animations.',
    path: '/components/checkbox',
    category: 'Forms',
  },
  {
    title: 'Switch',
    description: 'Smooth UI-thread spring toggle respecting user reduced-motion preferences.',
    path: '/components/switch',
    category: 'Forms',
  },
  {
    title: 'Card',
    description: 'Surface containers supporting outlined, elevated, and filled variants with composable slots.',
    path: '/components/card',
    category: 'Display',
  },
  {
    title: 'Badge',
    description: 'High-contrast status pills (success, warning, danger, brand) for parcel waybills.',
    path: '/components/badge',
    category: 'Display',
  },
  {
    title: 'Skeleton',
    description: 'Pulse shimmer placeholders with automatic static fallbacks for vestibular comfort.',
    path: '/components/skeleton',
    category: 'Display',
  },
  {
    title: 'Timeline',
    description: 'Vertical stepper for multi-stop courier routes and package milestone tracking.',
    path: '/components/timeline',
    category: 'Display',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { mode, resolvedMode } = useTheme();
  const { brand } = useGallery();

  return (
    <Box flex={1} bg="canvas">
      <GalleryHeader subtitle="Multi-Brand React Native Logistics Design System" />
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Welcome Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <VStack spacing="1">
                <Text variant="heading">Shani Design System Showcase</Text>
                <Text variant="caption">
                  Production-grade cross-platform React Native design system engineered for 15+ logistics and courier applications.
                </Text>
              </VStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="4">
                <HStack spacing="2" align="center" wrap={true}>
                  <Badge variant="brand">Mode: {mode} ({resolvedMode})</Badge>
                  <Badge variant={brand === 'apex' ? 'warning' : 'neutral'}>
                    Tenant: {brand === 'apex' ? 'Apex Fleet' : 'Shani Core'}
                  </Badge>
                  <Badge variant="success">WCAG 2.1 AA Compliant</Badge>
                </HStack>
                <Text variant="body">
                  Toggle the theme switcher or brand switcher in the header above. Notice how all
                  colors, shadows, and interactive components react in real time through the zero-runtime
                  theme engine without any flash of unstyled content or layout shifts.
                </Text>
              </VStack>
            </CardContent>
          </Card>

          {/* Component & Token Directory */}
          <VStack spacing="4">
            <Text variant="heading">Design System Directory</Text>
            <VStack spacing="3">
              {NAV_ITEMS.map((item) => (
                <Card key={item.path} variant="outlined" padding="md">
                  <HStack justify="between" align="center" wrap={true} spacing="3">
                    <VStack spacing="1" style={{ flex: 1, minWidth: 200, paddingRight: 8 }}>
                      <HStack spacing="2" align="center" wrap={true}>
                        <Text variant="title">{item.title}</Text>
                        <Badge variant="neutral" size="sm">{item.category}</Badge>
                        {item.badge ? (
                          <Badge variant="brand" size="sm">{item.badge}</Badge>
                        ) : null}
                      </HStack>
                      <Text variant="caption">{item.description}</Text>
                    </VStack>
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon="ChevronRight"
                      onPress={() => router.push(item.path as never)}
                    >
                      Explore
                    </Button>
                  </HStack>
                </Card>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
