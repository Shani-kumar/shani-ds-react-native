export interface ComponentStaticMeta {
  category: 'Foundation' | 'Actions' | 'Forms' | 'Display';
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  accessibilityNotes: string[];
  example: string;
  propExamples?: Record<string, string>;
}

export const COMPONENT_METADATA: Record<string, ComponentStaticMeta> = {
  Box: {
    category: 'Foundation',
    description:
      'Atomic layout primitive providing tokenized padding, margin, surface backgrounds, borders, shadows, and flex constraints without hardcoded styling.',
    whenToUse: [
      'Use Box for atomic layout containment and surface-level background styling.',
      'Use token-mapped padding and margin shorthand (p, px, py, m) instead of raw style objects.',
      'Use for cards, containers, and badges that require tokenized borders, radii, or shadows.',
    ],
    whenNotToUse: [
      'Never use Box with arbitrary pixel numbers; stick to strict spacing tokens (1=4pt, 2=8pt, etc.).',
      'Never use raw hex colors or inline style overrides for background colors; use bg="surface", bg="brand", etc.',
    ],
    accessibilityNotes: [
      'Box passes through accessibility props directly to the underlying View without interfering with screen readers.',
      'Ensure background surface contrast matches or exceeds WCAG AA against foreground text.',
    ],
    propExamples: {
      p: 'p="4"',
      px: 'px="4"',
      py: 'py="3"',
      pt: 'pt="2"',
      pb: 'pb="2"',
      pl: 'pl="4"',
      pr: 'pr="4"',
      m: 'm="2"',
      mx: 'mx="auto"',
      my: 'my="4"',
      mt: 'mt="2"',
      mb: 'mb="4"',
      ml: 'ml="2"',
      mr: 'mr="2"',
      bg: 'bg="surface"',
      borderRadius: 'borderRadius="md"',
      borderColor: 'borderColor="subtle"',
      borderWidth: 'borderWidth="hairline"',
      shadow: 'shadow="sm"',
      opacity: 'opacity={0.8}',
      flex: 'flex={1}',
      flexDirection: 'flexDirection="column"',
      alignItems: 'alignItems="center"',
      justifyContent: 'justifyContent="space-between"',
      flexWrap: 'flexWrap="wrap"',
      style: "style={{ minWidth: 0 }}",
      testID: 'testID="status-box"',
      children: '<Text variant="body">Box content</Text>',
    },
    example: `import { Box, Text } from '@shani/ui';

export function ParcelContainer() {
  return (
    <Box p="4" bg="surface" borderRadius="md" borderWidth="hairline" borderColor="subtle">
      <Text variant="body">Warehouse Container #402</Text>
    </Box>
  );
}`,
  },

  Stack: {
    category: 'Foundation',
    description:
      'Directional layout primitive enforcing the strict 4pt spacing scale between child elements with optional divider injection.',
    whenToUse: [
      'Use Stack for linear content spacing instead of manual margin calculations.',
      'Use tokenized spacing values (2, 3, 4, 6) to keep screens strictly aligned on the 4pt grid.',
      'Use the divider prop for automated separator injection between adjacent children.',
    ],
    whenNotToUse: [
      'Never hardcode raw pixel margins (e.g. marginBottom: 13) on children inside a Stack.',
      'Never mix arbitrary flexbox alignment props on container views when Stack provides align and justify.',
    ],
    accessibilityNotes: [
      'Stack passes through accessibility props without interfering with the screen reader reading order.',
      'Non-interactive dividers injected by Stack automatically hide from assistive tech.',
    ],
    propExamples: {
      direction: 'direction="horizontal"',
      spacing: 'spacing="4"',
      align: 'align="center"',
      justify: 'justify="between"',
      wrap: 'wrap={true}',
      divider: '<Divider orientation="vertical" />',
      p: 'p="4"',
      bg: 'bg="surface"',
      style: "style={{ flex: 1 }}",
    },
    example: `import { Stack, Box, Text } from '@shani/ui';

export function LoadingBays() {
  return (
    <Stack direction="horizontal" spacing="4" align="center">
      <Box p="2" bg="surfaceRaised">
        <Text variant="label">Bay 1</Text>
      </Box>
      <Box p="2" bg="surfaceRaised">
        <Text variant="label">Bay 2</Text>
      </Box>
    </Stack>
  );
}`,
  },

  HStack: {
    category: 'Foundation',
    description:
      'Horizontal stack layout enforcing consistent spacing between horizontal items with optional divider injection and wrap support.',
    whenToUse: [
      'Use HStack for horizontal rows (e.g. title + badge, icon + label, action bars).',
      'Use spacing tokens to define gaps between elements.',
      'Use wrap={true} on narrow containers to prevent content from clipping offscreen.',
    ],
    whenNotToUse: [
      'Never use HStack when items need to stack vertically on mobile; use wrap={true} or conditional direction.',
      'Never apply manual marginRight to children inside an HStack.',
    ],
    accessibilityNotes: [
      'Preserves logical left-to-right reading order for screen readers.',
      'Divider elements inside HStack automatically receive accessibilityRole="none".',
    ],
    propExamples: {
      spacing: 'spacing="3"',
      align: 'align="center"',
      justify: 'justify="between"',
      wrap: 'wrap={true}',
      divider: '<Divider orientation="vertical" />',
    },
    example: `import { HStack, Text, Badge } from '@shani/ui';

export function WaybillStatusRow() {
  return (
    <HStack spacing="3" align="center" justify="between" wrap={true}>
      <Text variant="title">Waybill #849102</Text>
      <Badge variant="brand">In Transit</Badge>
    </HStack>
  );
}`,
  },

  VStack: {
    category: 'Foundation',
    description:
      'Vertical stack layout enforcing consistent spacing between vertical elements with optional divider injection.',
    whenToUse: [
      'Use VStack for vertical column layouts (form fields, card sections, screen bodies).',
      'Use spacing tokens to enforce consistent vertical rhythm (spacing="4" for 16pt, spacing="6" for 24pt).',
      'Use divider for separating list items or summary rows.',
    ],
    whenNotToUse: [
      'Never apply manual marginBottom to children inside a VStack.',
      'Never nest dozens of deep empty VStacks; keep layout hierarchies lean.',
    ],
    accessibilityNotes: [
      'Preserves top-to-bottom reading flow for assistive accessibility services.',
    ],
    propExamples: {
      spacing: 'spacing="4"',
      align: 'stretch',
      justify: 'start',
      divider: '<Divider orientation="horizontal" />',
    },
    example: `import { VStack, Text } from '@shani/ui';

export function TerminalHeader() {
  return (
    <VStack spacing="2">
      <Text variant="heading">Terminal 4 - Cargo</Text>
      <Text variant="caption" color="secondary">Gate B12 • Ramp Access</Text>
    </VStack>
  );
}`,
  },

  Divider: {
    category: 'Foundation',
    description:
      'Decorative or semantic separator line with tokenized hairline thickness, subtle border colors, and spacing insets.',
    whenToUse: [
      'Use Divider to visually separate distinct content groups (e.g. between form sections or waybill items).',
      'Use orientation="vertical" inside horizontal headers or action bars.',
      'Use inset tokens to align dividers with container padding.',
    ],
    whenNotToUse: [
      'Never use Divider where spacing alone provides adequate visual separation.',
      'Never use raw hex colors or arbitrary height numbers for separators.',
    ],
    accessibilityNotes: [
      'Divider defaults to accessibilityRole="none" so decorative lines do not clutter screen reader announcements.',
    ],
    propExamples: {
      orientation: 'orientation="horizontal"',
      color: 'color="subtle"',
      thickness: 'thickness="thin"',
      inset: 'inset="4"',
      accessibilityRole: 'accessibilityRole="separator"',
      style: "style={{ width: '100%' }}",
      testID: 'testID="section-divider"',
    },
    example: `import { VStack, Text, Divider } from '@shani/ui';

export function WaybillSections() {
  return (
    <VStack spacing="3">
      <Text variant="body">Consignor Details</Text>
      <Divider orientation="horizontal" color="subtle" thickness="thin" />
      <Text variant="body">Consignee Details</Text>
    </VStack>
  );
}`,
  },

  Text: {
    category: 'Foundation',
    description:
      'Accessible typography primitive with 6 semantic variants, automated header roles, Dynamic Type protection, and WCAG AA contrast.',
    whenToUse: [
      'Use semantic variants (display, heading, title, body, label, caption) instead of overriding font sizes.',
      'Always keep allowFontScaling enabled for accessibility compliance.',
      'Use caption for metadata like timestamps, barcodes, and waybill numbers.',
    ],
    whenNotToUse: [
      'Never use raw hex colors or inline style fontSize on Text.',
      'Never disable allowFontScaling to fix card layouts; adjust card flex/padding instead.',
    ],
    accessibilityNotes: [
      'Heading and display variants automatically apply accessibilityRole="header" for screen reader navigation.',
      'Default maxFontSizeMultiplier of 2.0 accommodates low-vision warehouse workers without breaking layout flow.',
    ],
    propExamples: {
      variant: 'variant="heading"',
      color: 'color="primary"',
      weight: 'weight="bold"',
      align: 'align="left"',
      maxFontSizeMultiplier: 'maxFontSizeMultiplier={2.0}',
      allowFontScaling: 'allowFontScaling={true}',
      style: "style={{ flexShrink: 1 }}",
      testID: 'testID="waybill-title"',
      children: '"Waybill #840192"',
    },
    example: `import { Text, VStack } from '@shani/ui';

export function WaybillHeader() {
  return (
    <VStack spacing="1">
      <Text variant="heading">Shipment #849102</Text>
      <Text variant="caption" color="secondary">
        Created at 08:30 AM • Priority Overnight
      </Text>
    </VStack>
  );
}`,
  },

  Icon: {
    category: 'Foundation',
    description:
      'Tokenized wrapper around Lucide icons mapping design system sizes, semantic colors, and screen reader accessibility roles.',
    whenToUse: [
      'Use Icon to render Lucide iconography with design system size tokens (xs, sm, md, lg, xl).',
      'Use semantic color tokens (primary, secondary, brand, success, danger) matching the surrounding context.',
      'Provide an accessibilityLabel when the icon conveys standalone visual meaning.',
    ],
    whenNotToUse: [
      'Never use standalone clickable icons without wrapping in IconButton (which enforces 44pt touch targets).',
      'Never hardcode raw icon pixel sizes or raw hex colors.',
    ],
    accessibilityNotes: [
      'Icons without accessibilityLabel default to decorative state and are ignored by screen readers.',
      'Icons with accessibilityLabel receive accessibilityRole="image".',
    ],
    propExamples: {
      name: 'name="Package"',
      size: 'size="md"',
      color: 'color="brand"',
      strokeWidth: 'strokeWidth={2}',
      accessibilityLabel: 'accessibilityLabel="Parcel package"',
      style: "style={{ marginRight: 8 }}",
      testID: 'testID="package-icon"',
    },
    example: `import { HStack, Icon, Text } from '@shani/ui';

export function ParcelStatus() {
  return (
    <HStack spacing="2" align="center">
      <Icon name="Truck" size="sm" color="brand" accessibilityLabel="Delivery truck" />
      <Text variant="body">Dispatched on Van #14</Text>
    </HStack>
  );
}`,
  },

  Button: {
    category: 'Actions',
    description:
      'Primary action primitive built on usePressable with Reanimated UI-thread micro-interactions, loading states, and WCAG AA contrast.',
    whenToUse: [
      'Use primary for the single most important action on a screen (e.g. Complete Delivery).',
      'Use secondary or tertiary for auxiliary actions (e.g. View Manifest, Cancel).',
      'Use danger for destructive, irreversible operations (e.g. Delete Waybill).',
      'Use the loading prop during background network submissions to prevent double taps.',
    ],
    whenNotToUse: [
      'Never place two primary buttons in the same container; use primary + secondary.',
      'Never shrink buttons below size="sm" (44pt touch target) on mobile screens.',
      'Never allow buttons to stretch vertically in parent rows or flex containers.',
    ],
    accessibilityNotes: [
      'Button automatically manages accessibilityRole="button" and accessibilityState={{ disabled, busy: loading }}.',
      'Uses Reanimated snappy spring physics on the native UI thread, respecting system reduced-motion settings.',
      'All size variants guarantee at least a 44x44pt tappable area.',
    ],
    propExamples: {
      variant: 'variant="primary"',
      size: 'size="md"',
      loading: 'loading={isSubmitting}',
      disabled: 'disabled={!isValid}',
      leftIcon: 'leftIcon="Package"',
      rightIcon: 'rightIcon="ChevronRight"',
      fullWidth: 'fullWidth={true}',
      onPress: 'onPress={() => handleDispatch()}',
      onLongPress: 'onLongPress={() => handleLongPress()}',
      accessibilityLabel: 'accessibilityLabel="Confirm dispatch"',
      accessibilityHint: 'accessibilityHint="Starts vehicle dispatch workflow"',
      style: "style={{ alignSelf: 'flex-start' }}",
      testID: 'testID="confirm-btn"',
    },
    example: `import { Button } from '@shani/ui';

export function DispatchAction() {
  return (
    <Button
      variant="primary"
      size="md"
      leftIcon="CheckCircle"
      onPress={() => console.log('Confirmed')}
    >
      Confirm Delivery
    </Button>
  );
}`,
  },

  IconButton: {
    category: 'Actions',
    description:
      'Touch-optimized 44x44 icon button with compile-time mandatory accessibility labels and UI-thread spring physics.',
    whenToUse: [
      'Use IconButton for compact secondary actions in headers, toolbars, and card action clusters (e.g. Print, Filter, Close).',
      'Always supply a descriptive accessibilityLabel describing the action (mandatory at compile-time).',
      'Use variant="ghost" for low-emphasis toolbar icons and variant="primary" or "secondary" for floating buttons.',
    ],
    whenNotToUse: [
      'Never use IconButton for the screen\'s main primary call-to-action; use Button with text label.',
      'Never omit accessibilityLabel, as screen readers cannot announce unlabeled icons.',
    ],
    accessibilityNotes: [
      'TypeScript enforces accessibilityLabel at compile time on IconButtonProps.',
      'Guarantees at least a 44x44pt touch target on all size tiers to satisfy WCAG AA 2.5.5.',
    ],
    propExamples: {
      accessibilityLabel: 'accessibilityLabel="Print waybill barcode"',
      name: 'name="Printer"',
      variant: 'variant="ghost"',
      size: 'size="md"',
      shape: 'shape="square"',
      loading: 'loading={isPrinting}',
      disabled: 'disabled={isOffline}',
      onPress: 'onPress={() => handlePrint()}',
      accessibilityHint: 'accessibilityHint="Sends waybill PDF to connected printer"',
      style: "style={{ alignSelf: 'center' }}",
      testID: 'testID="print-icon-btn"',
    },
    example: `import { IconButton } from '@shani/ui';

export function PrintWaybillButton() {
  return (
    <IconButton
      name="Printer"
      accessibilityLabel="Print waybill manifest"
      variant="ghost"
      size="md"
      onPress={() => console.log('Printing...')}
    />
  );
}`,
  },

  TextField: {
    category: 'Forms',
    description:
      'Accessible text input built on useTextField with error association, secure text toggles, and tokenized border states.',
    whenToUse: [
      'Always provide a visible label or accessibilityLabel for screen reader clarity.',
      'Use error to communicate specific validation failures (e.g. invalid format).',
      'Use prefix/suffix elements to hint at the input format (e.g. MapPin for address, Search for filtering).',
    ],
    whenNotToUse: [
      'Never rely solely on placeholder text as a label, as it disappears when typing.',
      'Never hide error messages without announcing them via accessibilityHint.',
    ],
    accessibilityNotes: [
      'TextField binds error text directly to accessibilityHint so screen readers announce errors immediately upon focus.',
      'Enforces a minimum 44pt touch height to satisfy WCAG AA target size criteria.',
    ],
    propExamples: {
      label: 'label="Waybill Number"',
      placeholder: 'placeholder="e.g. SHN-000000-XX"',
      placeholderTextColor: 'placeholderTextColor="secondary"',
      helperText: 'helperText="Enter 18-digit carrier barcode number"',
      error: 'error="Waybill number not found"',
      prefix: '<Icon name="Package" size="sm" />',
      suffix: '<Icon name="Check" size="sm" color="success" />',
      secureTextEntry: 'secureTextEntry={true}',
      showSecureToggle: 'showSecureToggle={true}',
      size: 'size="md"',
      disabled: 'disabled={isSubmitting}',
      readOnly: 'readOnly={true}',
      required: 'required={true}',
      value: 'value={waybillNumber}',
      defaultValue: 'defaultValue="1Z999"',
      onChangeText: 'onChangeText={setWaybillNumber}',
      testID: 'testID="waybill-input"',
    },
    example: `import { TextField, Icon } from '@shani/ui';

export function WaybillInput() {
  return (
    <TextField
      label="Waybill Number"
      placeholder="e.g. 1Z9999999999999999"
      prefix={<Icon name="Package" size="sm" />}
      helperText="Enter 18-digit carrier barcode number"
      required={true}
    />
  );
}`,
  },

  Checkbox: {
    category: 'Forms',
    description:
      'Ternary selection primitive supporting checked, unchecked, and indeterminate (mixed) states with Reanimated spring physics.',
    whenToUse: [
      'Use Checkbox when users can select zero, one, or multiple options from a list (e.g. shipment filters).',
      'Use indeterminate={true} for parent "Select All" controls when a subset of children are selected.',
      'Provide clear label text describing the selection.',
    ],
    whenNotToUse: [
      'Never use Checkbox for mutually exclusive single-select options; use Radio or SegmentedOption.',
      'Never use Checkbox for instantaneous settings changes; use Switch instead.',
    ],
    accessibilityNotes: [
      'Checkbox automatically manages accessibilityRole="checkbox" and accessibilityState={{ checked: indeterminate ? "mixed" : checked }}.',
      'Meets WCAG AA touch target criteria by expanding the tappable container beyond the visual box to 44pt.',
    ],
    propExamples: {
      checked: 'checked={isSelected}',
      defaultChecked: 'defaultChecked={false}',
      indeterminate: 'indeterminate={isPartial}',
      onChange: 'onChange={setIsSelected}',
      disabled: 'disabled={isLocked}',
      label: 'label="Require signature upon delivery"',
      size: 'size="md"',
      accessibilityLabel: 'accessibilityLabel="Require signature upon delivery"',
      testID: 'testID="signature-checkbox"',
    },
    example: `import { useState } from 'react';
import { Checkbox } from '@shani/ui';

export function SignatureRequirement() {
  const [required, setRequired] = useState(false);

  return (
    <Checkbox
      checked={required}
      onChange={setRequired}
      label="Require adult signature at delivery"
    />
  );
}`,
  },

  Switch: {
    category: 'Forms',
    description:
      'Binary toggle primitive with Reanimated UI-thread spring physics (motion.spring.snappy) and reduced-motion fallback.',
    whenToUse: [
      'Use switches for instantaneous binary state settings (e.g. Turn on Geofencing, Dark Mode).',
      'Provide clear affirmative labels describing what happens when turned on.',
      'Ensure the switch track and thumb maintain WCAG AA contrast against card backgrounds.',
    ],
    whenNotToUse: [
      'Never use a switch when a user must submit the change via a "Save" button; use Checkbox instead.',
      'Never invert the meaning (e.g. "Disable Notifications" switched to ON).',
    ],
    accessibilityNotes: [
      'Switch applies accessibilityRole="switch" and accessibilityState={{ checked }}.',
      'The thumb translates across the track using Reanimated on the UI thread, instantly disabling animation if useReducedMotion() is active.',
    ],
    propExamples: {
      checked: 'checked={isLive}',
      defaultChecked: 'defaultChecked={true}',
      onChange: 'onChange={setIsLive}',
      disabled: 'disabled={!hasPermission}',
      label: 'label="Enable GPS tracking telemetry"',
      accessibilityLabel: 'accessibilityLabel="Enable GPS tracking telemetry"',
      testID: 'testID="gps-switch"',
    },
    example: `import { useState } from 'react';
import { Switch } from '@shani/ui';

export function DispatchSettings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      label="High-Priority Dispatch Alerts"
    />
  );
}`,
  },

  Card: {
    category: 'Display',
    description:
      'Surface container primitive supporting outlined, elevated, and filled variants with composable header, content, and footer slots.',
    whenToUse: [
      'Use elevated cards to lift interactive items (e.g. delivery run sheet items) off the background canvas.',
      'Use composable CardHeader, CardContent, and CardFooter to enforce standard section spacing.',
      'Use variant="outlined" for secondary summary information.',
    ],
    whenNotToUse: [
      'Never nest cards inside cards with matching borders or shadows.',
      'Never set arbitrary pixel margins on Card; wrap in Stack or Box.',
    ],
    accessibilityNotes: [
      'Cards organize content logically so screen readers navigate sequential shipment details naturally.',
      'Ensure text inside cards maintains WCAG AA contrast against card background surfaces in both light and dark modes.',
    ],
    propExamples: {
      variant: 'variant="elevated"',
      padding: 'padding="md"',
      style: "style={{ width: '100%' }}",
      testID: 'testID="waybill-card"',
      children: '<CardHeader>...</CardHeader><CardContent>...</CardContent>',
    },
    example: `import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '@shani/ui';

export function ShipmentCard() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader>
        <Text variant="title">Route #490</Text>
      </CardHeader>
      <CardContent>
        <Text variant="body">5 Deliveries Remaining</Text>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Start Route</Button>
      </CardFooter>
    </Card>
  );
}`,
  },

  CardHeader: {
    category: 'Display',
    description:
      'Card slot component grouping title and action elements at the top of a Card with tokenized bottom margin.',
    whenToUse: [
      'Use CardHeader as the first child of a Card to contain title, subtitle, and badge or action icons.',
    ],
    whenNotToUse: [
      'Never place primary full-width buttons inside CardHeader; use CardFooter instead.',
    ],
    accessibilityNotes: [
      'Group header elements so screen readers announce title and badge status first.',
    ],
    propExamples: {
      style: "style={{ marginBottom: 12 }}",
      testID: 'testID="card-header"',
      children: '<Text variant="title">Route Details</Text>',
    },
    example: `import { CardHeader, HStack, Text, Badge } from '@shani/ui';

export function HeaderExample() {
  return (
    <CardHeader>
      <HStack justify="between" align="center" wrap={true}>
        <Text variant="title">Waybill #840192</Text>
        <Badge variant="brand">Priority Air</Badge>
      </HStack>
    </CardHeader>
  );
}`,
  },

  CardContent: {
    category: 'Display',
    description:
      'Card slot component holding the primary body elements of a Card.',
    whenToUse: [
      'Use CardContent for the main payload of a card (descriptions, milestone details, summary metrics).',
    ],
    whenNotToUse: [
      'Never place sticky card action buttons in CardContent; place them in CardFooter.',
    ],
    accessibilityNotes: [
      'Ensures sequential reading order between CardHeader and CardFooter.',
    ],
    propExamples: {
      style: "style={{ flex: 1 }}",
      testID: 'testID="card-content"',
      children: '<Text variant="body">Consignee: Global Aero</Text>',
    },
    example: `import { CardContent, VStack, Text } from '@shani/ui';

export function ContentExample() {
  return (
    <CardContent>
      <VStack spacing="2">
        <Text variant="body">Consignee: Global Aero Logistics</Text>
        <Text variant="caption">Destination: Terminal 4, Gate B12</Text>
      </VStack>
    </CardContent>
  );
}`,
  },

  CardFooter: {
    category: 'Display',
    description:
      'Card slot component holding auxiliary metadata and action buttons at the bottom of a Card.',
    whenToUse: [
      'Use CardFooter for bottom-anchored actions (e.g. Track Live, View Manifest, ETA labels).',
    ],
    whenNotToUse: [
      'Never place card titles or badges in CardFooter.',
    ],
    accessibilityNotes: [
      'Ensures screen readers reach action buttons after hearing card content.',
    ],
    propExamples: {
      style: "style={{ width: '100%' }}",
      testID: 'testID="card-footer"',
      children: '<Button variant="primary" size="sm">Track Live</Button>',
    },
    example: `import { CardFooter, HStack, Text, Button } from '@shani/ui';

export function FooterExample() {
  return (
    <CardFooter>
      <HStack justify="between" align="center" wrap={true} style={{ width: '100%' }}>
        <Text variant="caption">Weight: 42.0 kg</Text>
        <Button variant="secondary" size="sm">View Manifest</Button>
      </HStack>
    </CardFooter>
  );
}`,
  },

  Badge: {
    category: 'Display',
    description:
      'Semantic status indicator with guaranteed WCAG AA contrast (≥ 4.5:1), optional status dots, and leading icons.',
    whenToUse: [
      'Use semantic variants according to their true feedback state (success=green, warning=amber, danger=red, brand=blue).',
      'Use the dot prop when status represents live or changing operational states.',
      'Keep badge text concise (1 to 3 words) for quick mobile scanning by couriers.',
    ],
    whenNotToUse: [
      'Never use danger badges for non-critical information.',
      'Never use raw hex colors or inline background styles for badges.',
    ],
    accessibilityNotes: [
      'Every badge foreground and background pairing meets or exceeds WCAG AA 4.5:1 contrast.',
      'Badge applies accessibilityRole="text" so screen readers speak status clearly without announcing it as a button.',
    ],
    propExamples: {
      variant: 'variant="success"',
      size: 'size="sm"',
      dot: 'dot={true}',
      icon: '<Icon name="Check" size="xs" />',
      style: "style={{ alignSelf: 'flex-start' }}",
      testID: 'testID="status-badge"',
      children: '"Delivered"',
    },
    example: `import { Badge } from '@shani/ui';

export function ParcelStatusBadge({ status }: { status: 'delivered' | 'delayed' }) {
  if (status === 'delivered') {
    return <Badge variant="success" dot={true}>Delivered</Badge>;
  }
  return <Badge variant="warning" dot={true}>Delayed</Badge>;
}`,
  },

  Skeleton: {
    category: 'Display',
    description:
      'Content placeholder primitive using Reanimated UI-thread pulse micro-interactions with automated static fallback for vestibular comfort.',
    whenToUse: [
      'Use Skeleton loaders during asynchronous data fetching to reduce perceived latency.',
      'Match skeleton geometry to the exact layout of the arriving content (text, avatar, cards).',
      'Compose multiple skeletons into composite card placeholders.',
    ],
    whenNotToUse: [
      'Never use animated skeletons for fast synchronous operations (< 150ms).',
      'Never invent arbitrary flashing animations; use the built-in pulse variant.',
    ],
    accessibilityNotes: [
      'Skeleton applies accessibilityRole="none" and accessibilityLabel="Loading content" with accessibilityState={{ busy: true }}.',
      'Automatically respects system reduce-motion settings by halting pulse animation and presenting a static tone.',
    ],
    propExamples: {
      variant: 'variant="text"',
      width: 'width="80%"',
      height: 'height={16}',
      borderRadius: 'borderRadius="sm"',
      testID: 'testID="loading-skeleton"',
      style: "style={{ marginBottom: 8 }}",
    },
    example: `import { Card, HStack, VStack, Skeleton } from '@shani/ui';

export function WaybillCardSkeleton() {
  return (
    <Card variant="outlined" padding="md">
      <HStack spacing="3" align="center">
        <Skeleton variant="circular" width={44} height={44} />
        <VStack spacing="2" style={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={16} />
          <Skeleton variant="text" width="80%" height={12} />
        </VStack>
      </HStack>
    </Card>
  );
}`,
  },

  Timeline: {
    category: 'Display',
    description:
      'Vertical milestone stepper for courier deliveries and logistics tracking waybills with accessible list semantics and active focus rings.',
    whenToUse: [
      'Use Timeline to structure sequential logistics workflows (e.g. pickup -> sort -> transit -> delivery).',
      'Mark exactly one active in-progress milestone as state="current".',
      'Provide timestamps to reassure customers about delivery recency.',
    ],
    whenNotToUse: [
      'Never use Timeline for non-chronological or parallel tasks.',
      'Never skip milestone steps without marking preceding steps completed.',
    ],
    accessibilityNotes: [
      'Timeline applies accessibilityRole="list" and marks each item with spoken step numbers (e.g. "Step 2 of 4, current: Sorted at Hub").',
      'Ensures users of assistive technologies understand exactly where an order is along its transit route.',
    ],
    propExamples: {
      steps: 'steps={shipmentSteps}',
      testID: 'testID="shipment-timeline"',
      style: "style={{ width: '100%' }}",
    },
    example: `import { Timeline, type TimelineStep } from '@shani/ui';

const shipmentSteps: TimelineStep[] = [
  { id: '1', title: 'Pickup Completed', state: 'completed', timestamp: '09:00 AM' },
  { id: '2', title: 'In Transit', state: 'current', timestamp: '11:15 AM' },
  { id: '3', title: 'Delivered', state: 'upcoming' },
];

export function OrderTracker() {
  return <Timeline steps={shipmentSteps} />;
}`,
  },
};

