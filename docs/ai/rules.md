# Shani Design System — AI & Agent Guidelines

You are an expert React Native engineer building mobile screens for logistics applications using the **Shani Design System (`@shani/ui`)**.

Follow these strict rules when generating or modifying any user interface code.

---

## 1. What is Shani DS?

Shani Design System is a production-grade, multi-tenant React Native design system built for logistics operations (driver tracking, dispatch run-sheets, and warehouse cargo scanners).

It is engineered on three core architectural foundations:
1. **W3C DTCG 3-Tier Token Architecture:** Primitive constants, semantic aliases (light/dark themes), and component-scoped tokens.
2. **Zero-Runtime Styling Engine:** Context-driven theme resolution with zero extra runtime CSS overhead.
3. **Headless Accessibility Primitives:** Minimum 44×44pt touch targets, Dynamic Type font scaling, vestibular motion reduction, and mandatory accessibility attributes.

---

## 2. Allowed Imports

You may ONLY import UI primitives, components, and tokens from the official packages:

```tsx
// 1. All UI components must come from @shani/ui
import {
  Box,
  Stack,
  HStack,
  VStack,
  Divider,
  Text,
  Icon,
  Button,
  IconButton,
  TextField,
  Checkbox,
  Switch,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  Skeleton,
  Timeline,
  useTheme,
  useStyles,
  useResponsive,
} from '@shani/ui';

// 2. Tokens, themes, or token types from @shani/tokens or @shani/ui
import type { SpacingKey, ColorToken } from '@shani/tokens';
```

### Icon Imports
Icons must ALWAYS be rendered through the `@shani/ui` `Icon` component using valid Lucide icon names:
```tsx
// CORRECT: Render via Icon component
<Icon name="Search" size="sm" color="secondary" />

// INCORRECT: Never import directly from lucide-react-native in screen files
import { Search } from 'lucide-react-native';
```

---

## 3. Strict Prohibitions (NEVER)

1. **NEVER use raw hex codes or RGB strings** in screen code (e.g. `#1D4ED8`, `#FFFFFF`, `rgba(0,0,0,0.5)`). All colors must reference theme semantic tokens via `theme.colors.*` or component props.
2. **NEVER use raw numbers for layout spacing, sizes, margins, padding, or border radius** (e.g. `margin: 12`, `padding: 15`, `borderRadius: 8`). All values must reference token scales (`spacing="3"`, `p="4"`, `theme.radius.md`).
3. **NEVER import or render raw React Native primitives** in screen code:
   - Do NOT use `<Text>` from `'react-native'` -> Use `<Text variant="...">` from `'@shani/ui'`.
   - Do NOT use `<TextInput>` from `'react-native'` -> Use `<TextField label="...">` from `'@shani/ui'`.
   - Do NOT use `<Button>` or `<Pressable>` or `<TouchableOpacity>` from `'react-native'` -> Use `<Button>` or `<IconButton>` from `'@shani/ui'`.
   - Do NOT use raw nested `<View>` for linear spacing -> Use `<VStack spacing="...">` or `<HStack spacing="...">` from `'@shani/ui'`.

---

## 4. Spacing & Size Token Scales

Components accept strict token keys. Use real component prop names and allowed scale values:

| Component | Prop | Allowed Scale Values |
| :--- | :--- | :--- |
| `Stack`, `HStack`, `VStack` | `spacing` | `'none'` (0pt), `'1'` (4pt), `'2'` (8pt), `'3'` (12pt), `'4'` (16pt), `'5'` (20pt), `'6'` (24pt), `'8'` (32pt), `'10'` (40pt), `'12'` (48pt), `'16'` (64pt) |
| `Box` | `p`, `px`, `py`, `m`, `mx`, `my`, `gap` | Token keys `'none'`, `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'8'`, `'10'`, `'12'`, `'16'` |
| `Card` | `padding` | `'none'`, `'sm'`, `'md'`, `'lg'` |
| `Card` | `variant` | `'outlined'`, `'elevated'`, `'filled'` |
| `Text` | `variant` | `'display'`, `'heading'`, `'title'`, `'body'`, `'label'`, `'caption'` |
| `Text` | `color` | `'primary'`, `'secondary'`, `'tertiary'`, `'brand'`, `'inverse'`, `'danger'`, `'warning'`, `'success'`, `'info'` |
| `Button` | `size` | `'sm'` (44pt touch min), `'md'` (48pt), `'lg'` (56pt) |
| `Button` | `variant` | `'primary'`, `'secondary'`, `'tertiary'`, `'danger'`, `'ghost'` |
| `IconButton` | `size` | `'sm'` (44pt), `'md'` (48pt), `'lg'` (56pt) |
| `IconButton` | `shape` | `'circle'`, `'square'` |
| `Badge` | `size` | `'sm'`, `'md'` |
| `Badge` | `variant` | `'neutral'`, `'brand'`, `'success'`, `'warning'`, `'danger'`, `'info'` |
| `Icon` | `size` | `'xs'` (14pt), `'sm'` (16pt), `'md'` (20pt), `'lg'` (24pt), `'xl'` (32pt) |
| `Skeleton` | `variant` | `'text'`, `'rectangular'`, `'circular'` |

---

## 5. Accessibility Requirements

Every interactive element MUST meet accessibility standards:

1. **44×44pt Minimum Touch Target:** Enforced automatically by `Button` and `IconButton`. Never wrap interactive controls in views with smaller explicit heights.
2. **Mandatory Screen-Reader Labels:**
   - `IconButton` requires `accessibilityLabel: string` at compile-time in TypeScript.
   - `Button` must have clear text or `accessibilityLabel`.
   - `TextField` requires `label: string`.
3. **Roles and States:**
   - Toggles (`Checkbox`, `Switch`) automatically announce checked/unchecked states.
   - Buttons announce `busy` state when `loading={true}`.
4. **Vestibular Safety:** All animations and transitions must check `useReducedMotion()`.

---

## 6. Screen Composition Patterns

Follow standard logistics composition hierarchies:

### 1. Root Screen Structure
```tsx
import { Box, VStack, Text, useTheme } from '@shani/ui';
import { ScrollView } from 'react-native';

export function ShipmentScreen() {
  const { theme } = useTheme();

  return (
    <Box flex={1} bg="canvas">
      <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }}>
        <VStack spacing="4">
          {/* Screen Content */}
        </VStack>
      </ScrollView>
    </Box>
  );
}
```

### 2. Typographic Hierarchy
- **Single Hero:** Only ONE value per screen uses `variant="display"` (e.g. ETA time `"Today, 04:30 PM"`).
- **Entity Identifiers:** Waybill numbers and asset codes use `variant="heading"` (e.g. `"#SHN-849102-US"`).
- **Section Headers:** Card titles and grouping headers use `variant="title"`.
- **Primary Content:** Explanations and status descriptions use `variant="body"`.
- **Metadata & Labels:** Form labels, table headers, and badges use `variant="label"`.
- **Timestamps & Hints:** Small time records and search helper hints use `variant="caption"`.
- **Rule:** Never render text larger than the section or entity it labels.

### 3. Card Action Placement Rule
- **Header (Top-Right):** Utility and secondary icon actions (e.g. `Printer`, `Share2`, `MoreVertical`) must be ghost `IconButton` elements with mandatory `accessibilityLabel`.
- **Footer (Bottom-Right):** Exactly ONE primary or secondary main action (e.g. `"Track Live"` with `ChevronRight`).
- **Footer Layout:** Left metadata (e.g. ETA) takes `flex: 1, minWidth: 140`; right button uses `style={{ flexGrow: 1, flexBasis: 120, maxWidth: '100%' }}` so it sits on the right on wide viewports and wraps to full width on narrow viewports without stretching vertically.

---

## 7. Do / Don't Code Examples

### Example 1: Waybill Card

#### ❌ WRONG (Antipattern)
```tsx
// NEVER DO THIS:
import { View, Text as RNText, TouchableOpacity } from 'react-native';

export function BadCard() {
  return (
    <View style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, borderColor: '#CBD5E1', borderWidth: 1 }}>
      <RNText style={{ fontSize: 20, color: '#0F172A', fontWeight: 'bold' }}>#SHN-102938</RNText>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity style={{ backgroundColor: '#1D4ED8', padding: 10 }}>
          <RNText style={{ color: '#FFFFFF' }}>Print</RNText>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#1D4ED8', padding: 10, marginLeft: 10 }}>
          <RNText style={{ color: '#FFFFFF' }}>Track</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

#### ✅ CORRECT (Shani DS)
```tsx
import { Card, VStack, HStack, Text, Badge, Icon, IconButton, Button, Divider } from '@shani/ui';

export function GoodCard() {
  return (
    <Card variant="outlined" padding="md">
      <VStack spacing="3">
        {/* Header: Tracking code left, utility actions right */}
        <HStack justify="between" align="center" wrap={true} spacing="2">
          <VStack spacing="0" style={{ flex: 1, minWidth: 140 }}>
            <Text variant="heading">#SHN-102938</Text>
            <Text variant="caption" color="secondary">Acme Logistics Corp</Text>
          </VStack>
          <IconButton
            name="Printer"
            accessibilityLabel="Print waybill label"
            variant="ghost"
            size="sm"
          />
        </HStack>

        {/* Body: Status and location metadata */}
        <HStack spacing="2" align="center" wrap={true}>
          <Badge variant="brand" dot={true}>In Transit</Badge>
          <HStack spacing="1" align="center">
            <Icon name="MapPin" size="xs" color="secondary" />
            <Text variant="caption" color="secondary">Chicago Central Hub</Text>
          </HStack>
        </HStack>

        <Divider />

        {/* Footer: ETA on left, single main action on right */}
        <HStack justify="between" align="center" wrap={true} spacing="3" style={{ width: '100%' }}>
          <HStack spacing="1" align="center" wrap={true} style={{ flex: 1, minWidth: 140 }}>
            <Icon name="Clock" size="xs" color="brand" />
            <Text variant="label">ETA: Today, 05:00 PM</Text>
          </HStack>
          <Button
            variant="secondary"
            size="sm"
            rightIcon="ChevronRight"
            onPress={() => {}}
            style={{ flexGrow: 1, flexBasis: 120, maxWidth: '100%' }}
          >
            Track Live
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}
```

### Example 2: Search Input

#### ❌ WRONG
```tsx
import { TextInput, View } from 'react-native';

<View style={{ borderWidth: 1, borderColor: '#CCC' }}>
  <TextInput placeholder="Search by tracking number, consignee, or hub address..." />
</View>
```

#### ✅ CORRECT
```tsx
import { TextField, Icon } from '@shani/ui';

<TextField
  label="Search Shipments"
  placeholder="Search shipments"
  prefix={<Icon name="Search" size="sm" color="secondary" />}
  helperText="Displaying 14 matching waybills"
  onChangeText={() => {}}
/>
```

---

## 8. Pre-Submission Quality Checklist

Before completing any implementation or refactoring task, run and pass every check:

1. `pnpm typecheck` — 0 TypeScript diagnostic errors.
2. `pnpm lint` — 0 ESLint errors or warnings.
3. `pnpm test` — All Jest test suites pass.
4. `pnpm contrast` — All WCAG 2.1 AA mathematical checks pass.
5. `pnpm tokens:drift` — No token compiler drift detected.
6. `pnpm snippets:check` — All component documentation snippets compile.
7. `pnpm rules:check` — Rules files in sync with `docs/ai/rules.md`.
8. Check that no raw hex colors, raw numbers, or raw React Native primitives are introduced.
