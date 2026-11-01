# Shani Design System — AI Screen Building Guidelines

This guide establishes the architectural layout patterns, typographic hierarchy rules, density conventions, and composition standards for constructing production-grade React Native screens with Shani DS (`@shani/ui` and `@shani/tokens`).

---

## 1. Core Principles

1. **Tokens Over Hardcoded Values:** Never use raw hex colors (`#1D4ED8`), magic numbers for spacing (`marginTop: 15`), or arbitrary border radii (`borderRadius: 7`). All visual properties must resolve through Shani DS semantic tokens or component props.
2. **Components Over Primitives:** Screen code must NEVER import `<Text>`, `<TextInput>`, `<Pressable>`, `<Button>`, or `<View>` directly from `'react-native'` for UI presentation. Always use `@shani/ui` primitives: `Box`, `Stack`, `HStack`, `VStack`, `Divider`, `Text`, `Icon`, `Button`, `IconButton`, `TextField`, `Checkbox`, `Switch`, `Card`, `Badge`, `Skeleton`, `Timeline`.
3. **44pt Touch Target Guarantee:** Every interactive element must provide at least a $44\times 44\text{pt}$ tappable area to comply with WCAG 2.1 SC 2.5.5 and mobile ergonomics for couriers wearing industrial gloves.
4. **Defensive Mobile Layout:** Mobile screens ($320\text{pt}$ to $390\text{pt}$) and accessibility font scaling (up to 200%) must never cause horizontal clipping or text overflow. Every row containing dynamic text must support wrapping (`wrap={true}`), flex shrinking (`flexShrink: 1`), and zero minimum width (`minWidth: 0`).

---

## 2. Standard Screen Anatomy

Every standard screen in Shani DS follows a consistent 4-layer composition:

```
┌────────────────────────────────────────────────────────┐
│ 1. Header / Navigation Bar                             │
│    [Back Button]  Title / Consignment ID   [Utility]   │
├────────────────────────────────────────────────────────┤
│ 2. Scrollable Body Content                             │
│    VStack spacing="4" (16pt gap)                       │
│    ┌────────────────────────────────────────────────┐  │
│    │ Card 1: Primary Entity / Hero Metric           │  │
│    └────────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────────┐  │
│    │ Card 2: Interactive Stepper / Timeline         │  │
│    └────────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────────┐  │
│    │ Card 3: Consignment / Manifest Details         │  │
│    └────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│ 3. Sticky Bottom Action Bar (or in-card footer)        │
│    [Primary Full-Width Action Button (48pt/56pt)]      │
└────────────────────────────────────────────────────────┘
```

### Complete Screen Boilerplate

```tsx
import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  IconButton,
  Divider,
} from '@shani/ui';

export function StandardLogisticsScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Box flex={1} bg="canvas">
      {/* 1. Header Row */}
      <Box p="4" bg="surface" borderWidth="hairline" borderColor="subtle">
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <HStack spacing="2" align="center" style={{ flex: 1, minWidth: 0 }}>
            <IconButton
              name="ArrowLeft"
              accessibilityLabel="Navigate back"
              variant="ghost"
              size="sm"
              onPress={() => console.log('Back')}
            />
            <Text variant="heading" numberOfLines={1} style={{ flexShrink: 1 }}>
              Run Sheet #402
            </Text>
          </HStack>
          <Badge variant="brand" size="sm">Active</Badge>
        </HStack>
      </Box>

      {/* 2. Scrollable Body */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack spacing="4">
          <Card variant="elevated" padding="md">
            <CardHeader>
              <Text variant="title">Current Delivery Stop</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="2">
                <Text variant="body" color="primary">Global Aero Logistics</Text>
                <Text variant="caption" color="secondary">Terminal 4, Loading Bay 12</Text>
              </VStack>
            </CardContent>
            <CardFooter>
              <Button
                variant="primary"
                size="md"
                fullWidth={true}
                loading={isSubmitting}
                leftIcon="CheckCircle"
                onPress={() => setIsSubmitting(true)}
              >
                Confirm Delivery
              </Button>
            </CardFooter>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}
```

---

## 3. Layout Patterns

### A. The Card Grid Pattern (`VStack spacing="4"`)
- Place cards inside a vertical stack with tokenized `spacing="4"` ($16\text{pt}$).
- Never place margins directly on cards. Let the enclosing `VStack` govern the vertical rhythm.
- Use `variant="elevated"` with `padding="md"` ($16\text{pt}$) for interactive content and active milestones.
- Use `variant="outlined"` with `padding="md"` for secondary information and static summaries.

### B. The Card Section Pattern (`CardHeader`, `CardContent`, `CardFooter`)
- **`CardHeader`:** Groups section titles, status badges, and top-right utility icon buttons. Automatically applies tokenized bottom margin ($12\text{pt}$).
- **`CardContent`:** Holds the primary payload (descriptions, data tables, steppers, metrics).
- **`CardFooter`:** Houses bottom actions and auxiliary metadata. Always spans full width and allows actions to wrap.

### C. The Card Action Placement Rule (ADR-021)
- **Top-Right Icon Actions:** Secondary utility actions (such as `Print`, `Share2`, `Bell`, `QrCode`) must be placed in the card header at the top-right as ghost `IconButton` elements with mandatory `accessibilityLabel` attributes.
- **Bottom-Right Main Action:** Each card may contain at most ONE primary or secondary button, anchored in the bottom-right footer row. On narrow screens ($\le 390\text{pt}$), the footer row allows wrapping, and the main action expands to full width (`fullWidth={true}` or flex growth).

### D. The Two-Item Responsive Row Pattern (`HStack wrap={true}`)
When displaying two items horizontally (e.g. label + value, title + badge, ETA + button):
```tsx
<HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
  <Text variant="caption" color="secondary" style={{ flexShrink: 1, minWidth: 0 }}>
    ETA: Today, 04:30 PM
  </Text>
  <Button variant="secondary" size="sm" style={{ flexShrink: 0 }}>
    Track Live
  </Button>
</HStack>
```

---

## 4. Typographic Hierarchy

To eliminate visual competition and create instant scanning for couriers on the move, follow these strict typographic rules (ADR-019, ADR-020):

| Variant | Font Size | Line Height | Weight | Permitted Screen Usage |
| :--- | :--- | :--- | :--- | :--- |
| **`display`** | $32\text{pt}$ | $40\text{pt}$ | Bold | **Single Screen Hero ONLY** (e.g. ETA time `"Today, 04:30 PM"` or primary revenue figure). At most ONE per screen. |
| **`heading`** | $24\text{pt}$ | $28\text{pt}$ | Bold | **Primary Entity Identifiers** (e.g. Waybill `#SHN-849102-US`, Order ID, Hub Name). |
| **`title`** | $18\text{pt}$ | $24\text{pt}$ | Semibold | **Card Section Headers** (e.g. `"Estimated Delivery"`, `"Shipment Progress"`, `"Consignment Details"`). |
| **`body`** | $16\text{pt}$ | $24\text{pt}$ | Regular | **Primary Content Text** (consignee names, addresses, descriptions, instructions). |
| **`label`** | $14\text{pt}$ | $20\text{pt}$ | Medium | **Form Labels, Inactive Steppers, Table Keys** (field labels, completed timeline steps). |
| **`caption`** | $12\text{pt}$ | $16\text{pt}$ | Regular | **Secondary Metadata, Timestamps, Barcodes** (`"Created at 08:30 AM"`, weight metrics). |

### Golden Hierarchy Rule:
> **No label or metadata element may ever be styled larger than the entity or section it describes.**

---

## 5. Information Density & Industrial Mobile Ergonomics

Logistics couriers and warehouse operators view screens in high-glare environments, on handheld scanners (Zebra, Honeywell), or on delivery vans. The layout must balance high density with touch accuracy:

1. **Strict 4pt Spacing Scale:**
   - `spacing="1"` ($4\text{pt}$): Micro-gaps between icons and adjacent labels.
   - `spacing="2"` ($8\text{pt}$): Standard gap between subtitle and title, or between chips in a filter group.
   - `spacing="3"` ($12\text{pt}$): Standard bottom margin in card headers.
   - `spacing="4"` ($16\text{pt}$): Standard padding inside cards and standard gap between vertical cards.
   - `spacing="6"` ($24\text{pt}$): Large separation between distinct screen sections.
2. **Industrial Touch Targets:**
   - Smallest tappable component is `size="sm"` ($44\text{pt}$ min height).
   - `IconButton` enforces $44\times 44\text{pt}$ touch area even with a $16\text{pt}$ visual icon.
   - `Checkbox` and `Switch` expand tappable bounding boxes to $44\text{pt}$ touch height with `hitSlop`.
3. **No Horizontal Scroll Views for Layouts:**
   - Never wrap cards or timelines in horizontal scroll views to "fix" clipping.
   - A vertical milestone stepper (`Timeline`) must always fit container width. Use `flex: 1, minWidth: 0` on content columns so timestamps wrap naturally below step titles.

---

## 6. Real Screen Walkthroughs

### Walkthrough 1: Shipment Tracking Screen Pattern

```tsx
import { Box, VStack, HStack, Text, Card, CardHeader, CardContent, Badge, Timeline, type TimelineStep } from '@shani/ui';

const trackingSteps: TimelineStep[] = [
  { id: '1', title: 'Pickup Completed', state: 'completed', timestamp: '08:30 AM' },
  { id: '2', title: 'Sorted at Hub 4', state: 'completed', timestamp: '11:15 AM' },
  { id: '3', title: 'Out for Delivery', state: 'current', timestamp: '02:00 PM', description: 'Driver: Mike R. (Van 14)' },
  { id: '4', title: 'Delivered', state: 'upcoming' },
];

export function TrackingDemo() {
  return (
    <VStack spacing="4">
      {/* Hero Card: Single Display Hero */}
      <Card variant="elevated" padding="md">
        <CardHeader>
          <HStack justify="between" align="center" wrap={true}>
            <Text variant="title">Estimated Delivery</Text>
            <Badge variant="brand" dot={true}>On Schedule</Badge>
          </HStack>
        </CardHeader>
        <CardContent>
          <VStack spacing="1">
            {/* The ONLY display variant on this screen */}
            <Text variant="display" color="primary">Today, 04:30 PM</Text>
            <Text variant="caption" color="secondary">Carrier: Express Air Freight • Waybill #849102</Text>
          </VStack>
        </CardContent>
      </Card>

      {/* Stepper Card */}
      <Card variant="outlined" padding="md">
        <CardHeader>
          <Text variant="title">Transit Progress</Text>
        </CardHeader>
        <CardContent>
          <Timeline steps={trackingSteps} />
        </CardContent>
      </Card>
    </VStack>
  );
}
```

### Walkthrough 2: Shipments List Card Pattern

```tsx
import { HStack, VStack, Text, Card, CardHeader, CardContent, CardFooter, Badge, Button, IconButton } from '@shani/ui';

export function WaybillListCard() {
  return (
    <Card variant="elevated" padding="md">
      {/* 1. Header: Entity heading left, utility action top-right */}
      <CardHeader>
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <Text variant="heading" style={{ flex: 1, minWidth: 0 }}>
            #SHN-741920-US
          </Text>
          <IconButton
            name="Printer"
            accessibilityLabel="Print waybill label"
            variant="ghost"
            size="sm"
            onPress={() => console.log('Print')}
          />
        </HStack>
      </CardHeader>

      {/* 2. Content: Status badge and destination metadata */}
      <CardContent>
        <VStack spacing="2">
          <Badge variant="success" dot={true} style={{ alignSelf: 'flex-start' }}>
            In Transit
          </Badge>
          <Text variant="body">Denver Regional Hub → Austin Terminal</Text>
          <Text variant="caption" color="secondary">3 Parcels • 42.0 kg • Priority Air</Text>
        </VStack>
      </CardContent>

      {/* 3. Footer: ETA caption left, single main action bottom-right */}
      <CardFooter>
        <HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
          <Text variant="caption" color="secondary" style={{ flexShrink: 1, minWidth: 0 }}>
            ETA: Today 05:00 PM
          </Text>
          <Button variant="secondary" size="sm" rightIcon="ChevronRight">
            Track Live
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}
```

