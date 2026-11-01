# Shani Design System — AI Prompt Templates

This guide provides copy-paste prompt templates for generating production-ready React Native screens using Shani DS (`@shani/ui` and `@shani/tokens`). Each template embeds strict system constraints, accessibility requirements, and layout rules to prevent AI hallucinations.

---

## Template 1: Build Screen from Scratch (Proof of Delivery)

Use this prompt when building a new logistics workflow screen from high-level operational requirements.

```markdown
You are an expert mobile React Native engineer building a production logistics screen using the Shani Design System.

TASK:
Build an accessible "Proof of Delivery" (POD) screen for a delivery courier mobile app.

REQUIRED FUNCTIONALITY:
1. Header: Back button navigation, Waybill number (#SHN-940124-US), and status Badge ("Out for Delivery").
2. Recipient Details Card: Consignee name ("Acme Industrial Labs"), address ("Gate 4, Bay B, Denver CO"), and package count ("2 Parcels • 14.5 kg").
3. Delivery Verification Checklist:
   - Checkbox 1: "Package condition inspected and intact"
   - Checkbox 2: "Delivered directly to designated consignee"
   - Checkbox 3: "Photo proof captured"
4. Recipient Name Input: TextField with label "Received By (Full Name)" and placeholder "e.g. Sarah Connor".
5. Signature Pad Placeholder: Outlined Card with title "Consignee Signature", empty surface box, and a ghost IconButton to clear signature.
6. Bottom Sticky Action Bar: Full-width primary Button "Complete Delivery" with leftIcon "CheckCircle" and loading state when submitting.

STRICT DESIGN SYSTEM RULES:
- The ONLY allowed component imports are from '@shani/ui'.
- The ONLY allowed token imports are from '@shani/tokens'.
- NEVER import raw Text, TextInput, Pressable, Button, or View from 'react-native'.
- NEVER use raw hex color codes or arbitrary pixel margins/paddings.
- Use strict 4pt spacing scale tokens (spacing="2", "3", "4", "6").
- Typographic hierarchy: The entity identifier (#SHN-940124-US) uses variant="heading". Card section titles use variant="title". Content uses variant="body". Metadata uses variant="caption".
- All interactive elements must satisfy the 44pt touch target minimum.
- IconButton requires compile-time accessibilityLabel.
- Ensure all rows wrap (wrap={true}, minWidth: 0, flexShrink: 1) so no content clips on 320px–390px screens.

OUTPUT:
Provide a single compiling TypeScript React Native component file.
```

---

## Template 2: Build Screen from Scratch (Warehouse Inventory Audit)

Use this prompt for warehouse inventory, shelf bay auditing, or barcode scanning workflows.

```markdown
You are an expert mobile React Native engineer building a production warehouse screen using the Shani Design System.

TASK:
Build an accessible "Warehouse Inventory Audit" screen for handheld scanner terminals (e.g. Zebra/Honeywell).

REQUIRED FUNCTIONALITY:
1. Header: Back button, title "Bay Audit: Aisle 14-B", and a ghost IconButton for "Filter".
2. Search & Scan Card:
   - TextField with prefix Search icon, placeholder "Scan SKU or Barcode...", and clear button suffix.
   - HStack with two quick action buttons: "Scan Barcode" (Button variant="secondary" size="sm" leftIcon="QrCode") and "Manual Add" (Button variant="tertiary" size="sm").
3. Bay Progress Metric:
   - Outlined Card with title "Audit Progress".
   - HStack showing "42 of 50 SKUs Verified" (variant="title") and Badge variant="brand" ("84% Complete").
   - Skeleton pulse placeholder if data is loading.
4. Item List:
   - 3 item rows inside a VStack spacing="3" with Divider elements.
   - Each item displays SKU number (variant="label"), description (variant="body"), quantity on hand, and a Checkbox to mark as verified.
5. Bottom Action Bar:
   - Sticky footer with secondary Button "Save Draft" and primary Button "Submit Audit" (wrapped in responsive HStack).

STRICT DESIGN SYSTEM RULES:
- Only import components from '@shani/ui' and tokens from '@shani/tokens'.
- No raw hex codes, no arbitrary style margins, no raw React Native text or buttons.
- Follow the card action rule: utility actions top-right, primary actions bottom-right or sticky footer.
- Guarantee 44pt touch targets for warehouse workers wearing gloves.
- Use spacing tokens (spacing="1", "2", "3", "4", "6").

OUTPUT:
Provide a single compiling TypeScript React Native component file.
```

---

## Template 3: Build Screen from Figma Spec / Dev Mode MCP

Use this prompt when providing Figma design inspect data or querying Figma via MCP tools.

```markdown
You are an expert React Native engineer translating a Figma design spec into production code with the Shani Design System.

CONTEXT:
I have selected a Figma frame with node ID `<FIGMA_NODE_ID>` in file `<FIGMA_FILE_KEY>`.

TASK:
1. Read the layer tree, auto-layout directions, gaps, paddings, and bound Figma variables from the design.
2. Translate all Figma elements into `@shani/ui` and `@shani/tokens` equivalents using the official Figma mapping:
   - Figma Auto-Layout VERTICAL with gap `spacing/4` (16px) -> `<VStack spacing="4">`
   - Figma Auto-Layout HORIZONTAL with gap `spacing/2` (8px) -> `<HStack spacing="2" wrap={true}>`
   - Figma Frame with background `color/bg/surface` and border -> `<Card variant="outlined" padding="md">`
   - Figma Frame with elevation shadow -> `<Card variant="elevated" padding="md">`
   - Figma Component `Button` -> `<Button variant="..." size="...">`
   - Figma Component `IconButton` -> `<IconButton name="..." accessibilityLabel="...">`
   - Figma Component `Badge` -> `<Badge variant="..." dot={...}>`
   - Figma Component `TextField` -> `<TextField label="..." helperText="...">`
   - Figma Component `Timeline` -> `<Timeline steps={[...]} />`
3. Map all typography styles to Shani semantic variants:
   - $32\text{pt}$ Bold -> `variant="display"` (ensure only ONE hero per screen)
   - $24\text{pt}$ Bold -> `variant="heading"` (entity titles)
   - $18\text{pt}$ Semibold -> `variant="title"` (section headers)
   - $16\text{pt}$ Regular -> `variant="body"` (content)
   - $14\text{pt}$ Medium -> `variant="label"` (form labels)
   - $12\text{pt}$ Regular -> `variant="caption"` (timestamps/metadata)

STRICT CONSTRAINTS:
- No raw React Native `<Text>`, `<TextInput>`, `<Pressable>`, `<Button>`, or `<View>`.
- No raw hex codes (`#1D4ED8`) or pixel measurements outside the 4pt grid.
- Every interactive element must enforce a 44pt touch target minimum.
- Generate compiling TypeScript code that passes typecheck without errors.

OUTPUT:
Output the complete, self-contained React Native screen component.
```

---

## Template 4: Refactor Legacy React Native Screen to Shani DS

Use this prompt to modernize an existing unstyled screen or one using raw React Native primitives.

```markdown
You are a senior React Native engineer refactoring legacy screen code to the Shani Design System.

LEGACY CODE TO REFACTOR:
```tsx
<PASTE_LEGACY_CODE_HERE>
```

REFACTORING INSTRUCTIONS:
1. Replace all raw React Native primitives:
   - `<View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>` -> `<Box flex={1} bg="canvas">`
   - `<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>` -> `<HStack justify="between" align="center" wrap={true}>`
   - `<View style={{ flexDirection: 'column', gap: 16 }}>` -> `<VStack spacing="4">`
   - `<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0F172A' }}>` -> `<Text variant="heading" color="primary">`
   - `<TextInput style={{ borderWidth: 1, borderColor: '#CBD5E1', padding: 12 }}>` -> `<TextField label="..." />`
   - `<TouchableOpacity style={{ backgroundColor: '#1D4ED8', padding: 14 }}>` -> `<Button variant="primary" size="md">`
   - Container views with white background and borders -> `<Card variant="outlined" padding="md">`
2. Enforce Typographic Hierarchy (ADR-019, ADR-020):
   - At most ONE hero value uses `variant="display"`.
   - Card section titles must use `variant="title"`.
   - Entity identifiers use `variant="heading"`.
   - Metadata and timestamps use `variant="caption"`.
3. Enforce Card Action Placement (ADR-021):
   - Utility icon actions (Print, Share) must sit top-right in `CardHeader` as `<IconButton variant="ghost" accessibilityLabel="...">`.
   - Main actions must sit bottom-right in `CardFooter`.
4. Enforce 44pt Touch Targets:
   - Replace any unpadded touchable with `size="sm"` ($44\text{pt}$) or larger.
5. Defensive Layout:
   - Add `wrap={true}`, `minWidth: 0`, and `flexShrink: 1` on text containers so the screen is responsive on 320px–390px viewports.

OUTPUT:
Return the refactored compiling TypeScript component file with an explanation of each rule applied.
```

---

## Template 5: New Compound Component Composition Prompt

Use this prompt when creating a new specialized domain component (e.g. `PalletSummaryCard`, `DriverStatusPill`).

```markdown
You are an expert React Native design system engineer extending the Shani Design System.

TASK:
Compose a new compound component `<PalletSummaryCard>` for warehouse pallet manifests.

REQUIREMENTS:
- Must compose existing `@shani/ui` primitives: `Card`, `CardHeader`, `CardContent`, `CardFooter`, `HStack`, `VStack`, `Text`, `Badge`, `Icon`, `Button`.
- Accepts typed props: `palletId: string`, `status: 'stored' | 'transit' | 'damaged'`, `bayLocation: string`, `weightKg: number`, `onInspect?: () => void`.
- Visual structure:
  - Header: Pallet ID (`variant="title"`) and semantic status Badge.
  - Content: Bay location with MapPin icon and weight in kg with Scale icon.
  - Footer: "Inspect Pallet" secondary button.
- Strict token binding: All padding, spacing, and colors come from Shani DS tokens.
- Accessibility: Declares proper accessibility roles and labels; button enforces 44pt touch target.

OUTPUT:
Provide the component file and an example usage file.
```
