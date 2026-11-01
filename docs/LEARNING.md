# Design Systems Learning & Interview Guide

This guide breaks down every core architectural concept implemented in **Shani DS** in plain English, structured so a junior developer could explain them confidently in a technical interview.

---

## 1. The Three-Tier Design Token Architecture

### The Problem it Solves

In naive codebases, developers write raw hex values like `#2563EB` or magic numbers like `margin: 14` directly inside components. When the company rebrands, adds dark mode, or creates a white-label partner app, engineers have to find and replace thousands of hardcoded lines across 15+ apps.

### The Solution: 3 Tiers of Tokens

```
Tier 1: Primitives (What is the value?)
  └── color.brand.600 = "#1D4ED8"
        │
Tier 2: Semantic (What does it mean?)
  └── color.action.primary.default = "{color.brand.600}" (in light mode)
  └── color.action.primary.default = "{color.brand.400}" (in dark mode)
        │
Tier 3: Component (Where is it applied?)
  └── button.primary.bg.default = "{color.action.primary.default}"
```

1. **Primitive Tokens (Tier 1):**
   - **Definition:** The raw palette and scales of your design system. These represent choices, not decisions.
   - **Examples:** `brand-600: #1D4ED8`, `spacing-4: 16`, `radius-md: 8`.
   - **Analogy:** The raw ingredients in a pantry (flour, sugar, salt).

2. **Semantic Tokens (Tier 2):**
   - **Definition:** Intent-driven tokens that assign meaning to primitives. They answer _purpose_ and change based on context (such as Light Mode vs. Dark Mode or Brand A vs. Brand B).
   - **Examples:** `color.bg.canvas`, `color.text.primary`, `color.action.primary.pressed`.
   - **Analogy:** The course designation on a menu (appetizer, dessert). Sugar might be dessert, salt is appetizer.

3. **Component Tokens (Tier 3):**
   - **Definition:** Scoped tokens dedicated to specific components.
   - **Examples:** `button.primary.bg`, `card.border.subtle`, `input.text.active`.
   - **Analogy:** The specific recipe for the dish. If a chef wants to change only the button's hover state without affecting badges or links, they edit the component token.

### Interview Talking Point:

> "We separate tokens into three distinct tiers: Primitives (raw physical scales), Semantics (contextual intent for light/dark and white-label theming), and Component tokens (isolated component-level overrides). This decoupling allows our 15+ logistics apps to flip themes or white-label a sub-brand simply by swapping semantic token maps without touching a single line of component code."

---

## 2. W3C Design Tokens Standard Format

We format token JSON files following the emerging **W3C Design Tokens Community Group (DTCG)** standard:

- `$value`: The actual value or alias string (e.g., `"{color.brand.600}"`).
- `$type`: The design token type (`color`, `dimension`, `duration`, `cubicBezier`, etc.).
- `$description`: Human and machine-readable explanation of when and why to use the token.

### Why Aliasing (`{...}`) Matters

Using `{color.neutral.900}` inside semantic definitions creates a single source of truth. When the primitive scale changes, all semantic and component tokens automatically inherit the update.

---

## 3. WCAG Contrast Ratios & Automated Enforcement

### What is WCAG 2.1 AA Contrast?

The Web Content Accessibility Guidelines (WCAG) specify that text and essential UI elements must have sufficient luminance contrast against their background:

- **Normal Text (<18pt or <14pt bold):** At least **4.5:1** contrast ratio.
- **Large Text (≥18pt or ≥14pt bold):** At least **3.0:1** contrast ratio.
- **UI Components & Graphical Objects (Borders, Action icons):** At least **3.0:1** contrast ratio.

### How Luminance is Calculated

Relative luminance ($L$) calculates perceived lightness:
$$L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
where $R, G, B$ are gamma-corrected sRGB channel values.
The contrast ratio between light luminance ($L_1$) and dark luminance ($L_2$) is:
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### Why Automated Contrast CI Checks Matter

In a logistics app, drivers and warehouse operators work outdoors in direct sunlight or in dimly lit distribution hubs. An automated contrast check in CI (`pnpm contrast`) guarantees that no designer or developer can commit a color pair that fails WCAG AA standards. If a pair is below 4.5:1, the CI build fails instantly.

---

## 4. Theming Flow and White-Label Architecture

### How Theming Works in Shani DS

1. **Device Awareness:** `<ThemeProvider>` reads device system appearance using React Native's `useColorScheme()` when `mode="system"`.
2. **Explicit Override:** Users or apps can programmatically toggle between `'light'`, `'dark'`, and `'system'` using `setMode()`.
3. **Deep Merging for White-Labeling:** Partner apps or operations vs. customer apps can pass an `overrides` prop to `<ThemeProvider>` or use the `createTheme(base, overrides)` helper to replace brand scales, radius scales, or component tokens while retaining all underlying foundations.

```tsx
// Example: Creating a partner brand theme from Shani DS using a customized brand palette scale
const partnerTheme = createTheme(lightTheme, {
  colors: {
    palette: {
      brand: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316',
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
    },
    action: {
      primary: {
        default: '#EA580C', // derived from partner brand.600
        pressed: '#C2410C', // derived from partner brand.700
      },
    },
  },
});
```

---

## 5. The Headless Component Pattern

### What is the Headless Pattern?

In traditional React Native libraries, components bundle three things together into a single file:

1. **State management** (e.g. `isPressed`, `isFocused`, `isOpen`)
2. **Accessibility props & event handlers** (e.g. `accessibilityRole`, `accessibilityState`, `onPressIn`, `onFocus`)
3. **Visual styling & layout** (colors, padding, borders, shadows)

The **Headless Pattern** decouples steps 1 & 2 from step 3. A headless hook manages the brain (logic, state, accessibility props) and returns plain props to spread onto any UI component, leaving styling completely unopinionated.

### Why Do We Use It?

- **Separation of Concerns:** Accessibility is notoriously tricky to get right on mobile. By managing accessibility props inside headless hooks (`usePressable`, `useToggle`, `useTextField`, `useDisclosure`), every visual component automatically inherits a consistent accessibility baseline.
- **Testability:** We can unit test state machines and accessibility events in isolation without mounting complex native views or layout engines.
- **Maximum Flexibility:** If the customer app needs a pill button and the driver app needs an oversized industrial button, both share the exact same battle-tested `usePressable` hook while applying completely different design token styles.

### Plain English Example: Custom Accessible Switch using `useToggle`

```tsx
import React from 'react';
import { Pressable, View } from 'react-native';
import { useToggle, useStyles } from '@shani/ui';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
}

export function AccessibleSwitch({ checked, onChange, label }: SwitchProps) {
  // 1. Headless Hook manages state & accessibility props (ZERO styling)
  const { state, toggleProps } = useToggle({
    checked,
    onChange,
    role: 'switch',
    accessibilityLabel: label,
  });

  // 2. Zero-runtime style helper maps component tokens (no magic numbers)
  const styles = useStyles(theme => {
    const switchTokens = theme.components.switch;

    return {
      track: {
        width: switchTokens.track.width,
        height: switchTokens.track.height,
        borderRadius: theme.radius.full,
        backgroundColor: state.isChecked
          ? switchTokens.track.bgActive
          : switchTokens.track.bgInactive,
        padding: switchTokens.track.padding,
      },
      thumb: {
        width: switchTokens.thumb.size,
        height: switchTokens.thumb.size,
        borderRadius: theme.radius.full,
        backgroundColor: switchTokens.thumb.bg,
        transform: [{ translateX: state.isChecked ? switchTokens.thumb.offset : 0 }],
      },
    };
  });

  // 3. Render: Spread headless toggleProps directly onto Pressable
  return (
    <Pressable {...toggleProps} style={styles.track}>
      <View style={styles.thumb} />
    </Pressable>
  );
}
```

### Interview Talking Point:

> "We build our components on headless hooks like `usePressable`, `useToggle`, and `useDisclosure`. The headless hooks manage focus, press states, React Native accessibility props (`accessibilityRole`, `accessibilityState`, `accessibilityLabel`), and interaction states with zero styling opinions. Then our components combine those hooks with typed token styles (`useStyles`). This provides our 15+ logistics apps with a consistent accessibility baseline out of the box, which our teams then verify directly with screen readers (VoiceOver on iOS and TalkBack on Android)."

---

## 6. Base and Layout Primitives (Group A)

### Why Build Layout Components in a Design System?

In naive React Native code, developers write inline styles with magic numbers everywhere: `margin: 13`, `paddingLeft: 7`, `fontSize: 19`. This causes:

1. **Visual inconsistency** across apps (different button spacings, mismatched margins).
2. **Broken text layouts** when users enable OS accessibility font scaling (e.g., Dynamic Type on iOS or Font Size on Android).
3. **Screen reader clutter** when icons are read out as unlabeled shapes or unannounced SVGs.

### The Group A Primitives:

1. **`Box`:** The lowest-level layout building block. Takes typed token props (`p`, `m`, `bg`, `borderRadius`, `borderColor`, `borderWidth`, `shadow`, `opacity`) and maps them directly to theme values.
2. **`Stack`, `HStack`, `VStack`:** Replaces manual flex direction code with structured linear layout containers. Uses the tokenized 4pt grid spacing for `gap` and supports injecting dividers between items.
3. **`Text`:** Provides 6 semantic typography variants:
   - `display`: Hero numbers and large dashboard stats.
   - `heading`: Screen titles (`accessibilityRole="header"` assigned automatically).
   - `title`: Card and section headers.
   - `body`: Default reading text.
   - `label`: Form labels and badges.
   - `caption`: Timestamps, hints, and fine print.
     _Accessibility safeguard:_ Sets `maxFontSizeMultiplier={2.0}` and `allowFontScaling={true}`. This guarantees text scales up to 200% for low-vision users without clipping or breaking parent container boundaries.
4. **`Divider`:** Accessible rule with token thickness and semantic border color.
5. **`Icon`:** Wraps Lucide icons with design system size tokens (`xs: 12`, `sm: 16`, `md: 20`, `lg: 24`, `xl: 32`) and semantic text color tokens. Defaults to decorative (`accessible={false}`, `accessibilityRole="none"`), ensuring screen readers only announce icons when given an explicit `accessibilityLabel`.

---

## 7. Action Primitives (Group B: Button & IconButton)

### The 44x44 Touch Target Rule

- **WCAG 2.5.5 (Target Size) & Mobile HIG:** On touchscreens, interactive targets must be at least $44 \times 44$ points (iOS) / $48 \times 48$ dp (Android).
- **Logistics Reality:** Warehouse operators use rugged handheld scanners (Zebra, Honeywell) and delivery drivers frequently wear protective work gloves. An undersized button (e.g. 28px) causes missed taps and severe operational errors.
- **How Shani DS Solves This:** `Button` and `IconButton` size `sm` is clamped to a strict minimum height of 44pt and minimum width of 44pt (`theme.components.button.size.sm.minHeight: 44`). Even the smallest button is physically impossible to render below the WCAG touch target threshold.

### Anatomy of an Accessible Button

In Shani DS, `Button` is composed of three interconnected layers:

1. **Behavior & State Layer (`usePressable`):**
   - Tracks interaction states: `isPressed`, `isHovered`, `isFocused`, `isDisabled`, `isLoading`.
   - Maps states to native accessibility props:
     - `accessibilityRole="button"`
     - `accessibilityState={{ disabled: isDisabled, busy: isLoading }}`
     - `accessibilityLabel` & `accessibilityHint`
2. **Animation Layer (Reanimated + Motion Tokens):**
   - Applies an active press scale micro-interaction: scales down to `0.97` on press and springs back to `1.0` on release.
   - Spring physics use design tokens: `theme.motion.spring.snappy` (`damping: 26`, `mass: 0.8`, `stiffness: 300`).
   - Runs directly on the native UI thread, guaranteeing zero dropped frames even if the JavaScript thread is busy parsing shipment payloads.
   - _Reduced Motion Support:_ Uses `useReducedMotion()`. If the user enables "Reduce Motion" in iOS/Android OS settings, scale transforms are disabled to avoid triggering vestibular discomfort.
3. **Token Styling Layer (`useTheme`):**
   - Every color, padding, border, and radius value is derived from semantic and component tokens (`theme.components.button`).
   - Visual states (default, pressed, disabled) have dedicated token pairings guaranteed to meet WCAG AA contrast.

### Why IconButton Requires `accessibilityLabel` in TypeScript

A standard button displays text like "Confirm Delivery" that screen readers can read automatically. An icon button only displays a graphic (e.g. an arrow or a trash can). If an engineer forgets an `accessibilityLabel`, VoiceOver will announce "Button" with zero explanation of what it does.

In Shani DS, we enforce this at compile-time:

```tsx
export interface IconButtonProps {
  /** Screen reader accessibility label - STRICTLY MANDATORY */
  accessibilityLabel: string;
  // ...
}
```

If a developer tries to render `<IconButton name="Trash" />`, TypeScript throws a compile error:
`Property 'accessibilityLabel' is missing in type...`. This prevents inaccessible icon buttons from ever shipping to production.

### Interview Talking Point:

> "Our action components (`Button` and `IconButton`) pair our headless `usePressable` hook with Reanimated UI-thread micro-interactions. We enforce three non-negotiable rules: first, every button size—even `sm`—meets the WCAG 44x44pt touch target minimum. Second, `IconButton` requires `accessibilityLabel: string` as a non-optional TypeScript prop so an unlabeled icon button cannot compile. Third, our press scale animation respects `useReducedMotion()`, while running on the native thread using our tokenized spring physics (`motion.spring.snappy`)."

---

## 8. Form Primitives (Group C: TextField, Checkbox, Switch)

### Accessible Error Communication in Mobile Forms

In web development, forms connect inputs to error messages using `aria-describedby` and `aria-invalid`. In React Native, accessibility operates differently:

- `accessibilityState={{ disabled: true }}` marks disabled fields.
- `accessibilityLabel` provides the field's spoken name (e.g. "Tracking Number").
- `accessibilityHint` announces dynamic feedback (e.g. "Invalid logistics zone postal code").

When a `TextField` encounters an error, Shani DS automatically sets `accessibilityHint` to the active error message and increases the border thickness to `medium` with semantic `border.error` color, giving both visual and assistive technology users unambiguous error feedback.

### The Indeterminate ("Mixed") Checkbox State

- **The Problem:** In a warehouse dispatch app with 50 packages on a pallet, an operator needs to select subsets of shipments. If 3 of 10 items are selected, showing an unchecked box falsely implies zero are selected; showing a checked box falsely implies all are selected.
- **The Solution:** The `indeterminate` state displays a `Minus` horizontal dash and sets `accessibilityState={{ checked: 'mixed' }}`. VoiceOver announces this as "mixed, checkbox", following the W3C accessibility specification.

### Switch Micro-Animations with Spring Physics

- Traditional switches animate on the JavaScript thread using basic timing curves, which stutter during heavy background network fetches.
- Shani DS drives the switch thumb using Reanimated shared values on the UI thread (`translateX`) with tokenized spring parameters (`motion.spring.snappy`):
  $$\text{Damping: 26}, \quad \text{Stiffness: 300}, \quad \text{Mass: 0.8}$$
- This gives the thumb an organic, snappy snap-into-place feel that mimics physical hardware toggle switches.
- When `useReducedMotion()` is active, the switch snaps immediately without spring oscillation, ensuring comfort for vestibular-sensitive users.

---

## 9. Display Primitives (Group D: Card, Badge, Skeleton, Timeline)

### Composable Card Architecture

In enterprise React Native apps, cards often become bloated monoliths with dozens of configuration props. Shani DS uses a composable architecture:

- `<Card>` handles the outer elevation, borders, padding, and background surface (`outlined`, `elevated`, `filled`).
- `<CardHeader>`, `<CardContent>`, and `<CardFooter>` organize layout slots with standardized token spacing.
  This allows engineers to assemble custom package cards, driver summaries, or route waybills with zero inline styles.

### Semantic Status Badging

- Badges communicate mission-critical status: `Delivered` (success), `Delayed` (warning), `Out for Delivery` (brand), or `Hazardous Alert` (danger).
- Unlike ad-hoc pills, every badge variant pairs a subtle background with a bold foreground text token that has been mathematically verified in CI (`pnpm contrast`) to exceed the WCAG 4.5:1 contrast ratio.

### Skeleton Loading & Vestibular Safety

- **Layout Shift Prevention:** Skeletons preserve the exact dimensions of content during network fetches, preventing cumulative layout shift (CLS).
- **Reduced Motion Compliance:** Constant pulsing or shimmering can trigger nausea or dizziness in users with vestibular disorders. Using `useReducedMotion()`, the `Skeleton` detects OS accessibility settings and immediately replaces the pulse animation with a static low-contrast placeholder.

### Shipment Timeline (Vertical Stepper)

- Logistics tracking is inherently sequential: Order Placed $\to$ Sorted at Hub $\to$ Out for Delivery $\to$ Delivered.
- `Timeline` provides a vertical milestone stepper with:
  1. Connected vertical guide rails using semantic action line tokens.
  2. Multi-state indicators: Checkmark icons for `completed`, active focus dots for `current`, and subtle rings for `upcoming`.
  3. Screen reader accessibility: Encapsulated as `accessibilityRole="list"`, with each milestone announcing: _"Step 2 of 4: current, Customs Clearance, 02:15 PM, Passed inspection at Port of LA"_.

### Interview Talking Point:

> "Our display components (`Card`, `Badge`, `Skeleton`, `Timeline`) turn complex logistics state into accessible, scannable UI. Our `Skeleton` component respects `useReducedMotion()` by halting pulse animations on the native UI thread, and our `Timeline` stepper structures multi-stop package tracking with semantic list roles and clear milestone states for screen readers."

---

## 10. Monorepo Expo Gallery & Multi-Brand Architecture (apps/gallery)

### How Metro Resolves Monorepos in pnpm

In a pnpm monorepo, dependencies are isolated into a content-addressable virtual store (`node_modules/.pnpm`). Metro, React Native's bundler, does not automatically walk parent directories or follow symlinks outside its project root unless explicitly instructed.

To make Metro bundle across the monorepo seamlessly:

1. **`watchFolders = [monorepoRoot]`**: Tells Metro's file watcher to watch all workspace packages (`packages/tokens`, `packages/ui`).
2. **`nodeModulesPaths = [projectRoot/node_modules, monorepoRoot/node_modules]`**: Guides module resolution to find shared dependencies and hoisted libraries.
3. **Source-level resolution (`main: "./src/index.ts"`):** In internal packages, pointing `main` directly to TypeScript source allows Metro to compile packages on the fly with instant Fast Refresh, eliminating repetitive build steps during development.

### Proving Multi-Tenant Theming in Real Time

In enterprise logistics, white-label partner applications (such as regional delivery partners and third-party fleet operators) need custom branding without duplicating code.

We prove this with:
1. **Mode Switcher (`light` | `dark` | `system`):** Re-resolves semantic tokens (e.g. `bg.canvas`, `text.primary`) instantly without page reload.
2. **Theme Customization via `createTheme()`:** Dynamically applies partial overrides generated via `createTheme(baseTheme, overrides)`. A custom theme swaps the primary action colors and focus borders to partner primitive scales (`color.partner.*`), verifying that the entire component system reacts to theme swaps using zero runtime CSS-in-JS.

### Interview Talking Point:

> "We built our documentation and interactive showcase as a production Expo Router app (`apps/gallery`) configured for iOS, Android, and Web. In Metro, we configure monorepo watch folders and node module paths to resolve `@shani/tokens` and `@shani/ui` directly from source with Fast Refresh. We support white-labeling in real time using deep token overrides via `createTheme()`, proving that components adapt to new brand guidelines without modifying a single component line."

---

## 11. Component Documentation & Dogfooding (ComponentPage)

### Why Dogfood the Design System in its Own Docs?

In poorly maintained design systems, documentation apps use HTML divs, third-party component libraries, or inline hardcoded styles to build their pages. This creates two problems:
1. The design system team misses usability gaps, missing props, or layout bugs in their own components.
2. The documentation codebase drifts away from the design system's tokens and guidelines.

In Shani DS, `apps/gallery` is built **100% using `@shani/ui` and tokens**:
- All layouts use `<Box>`, `<Stack>`, `<HStack>`, and `<VStack>`.
- All cards, status pills, and headers use `<Card>`, `<Badge>`, and `<Text>`.
- All controls use `<Button>`, `<IconButton>`, `<TextField>`, `<Checkbox>`, and `<Switch>`.
- Zero raw hex colors and zero magic numbers exist in the entire application.

### The 6-Section Component Documentation Pattern

Every component page implements a standardized 6-part layout via `<ComponentPage>`:

1. **Interactive Playground:** Lets engineers toggle variants, sizes, and states live before writing code.
2. **All-States Matrix:** Visually enumerates all permutations (default, pressed, loading, disabled, error) in one place.
3. **Props Table:** Provides clear TypeScript types, defaults, and usage descriptions.
4. **Do's & Don'ts:** Explicit logistics-focused dos and don'ts (e.g. keeping buttons $\ge 44\text{pt}$ for industrial gloves).
5. **Accessibility Notes:** Documents screen reader announcements, VoiceOver/TalkBack roles, and reduced-motion behavior.
6. **Copy-Paste Snippet:** Ready-to-use production code snippet using real logistics domain examples (Waybills, Pallets, Courier Routes).

### Interview Talking Point:

> "Our interactive gallery dogfoods `@shani/ui` exclusively. Every single component page follows a strict 6-section template (`ComponentPage`): live interactive playground, all-states matrix, props table, do/don't guidelines, accessibility specs, and copy-paste logistics code snippets. By building the entire documentation app using only our own components and tokens, we prove that the system is ergonomic, flexible, and truly production-ready."

---

## 12. Cross-Platform Web Preview & Responsive Phone Frame

### The Problem with Mobile Design Systems on Web

When mobile React Native apps run in a desktop web browser (e.g. Chrome on macOS), the browser viewport is typically $1440\times900$ or wider. A mobile button or waybill card designed for a $375\text{pt}$ iPhone screen stretches across the full display, looking awkward and misrepresenting the true user experience.

### The Solution: Responsive Phone Frame Mockup

In `apps/gallery/app/_layout.tsx`, we implement a conditional viewport wrapper:

```tsx
const { width } = useWindowDimensions();
const isWideWeb = Platform.OS === 'web' && width > 768;
```

1. **On Wide Desktop Browsers (`width > 768`):**
   - The application renders inside a centered phone frame with a maximum width of `480pt`, surrounded by the canvas background.
   - The frame uses `theme.radius['2xl']` for device corners and `theme.shadow.lg` for realistic elevation.
   - An interviewer testing the app on a laptop sees a realistic, authentic mobile device simulator.
2. **On Native Devices and Mobile Browsers (`width <= 768`):**
   - The layout expands to 100% full screen width, seamlessly behaving as a native iOS/Android application.

### Interview Talking Point:

> "To make our mobile design system shine during desktop reviews and portfolio demonstrations, we built a responsive phone frame in our root layout. On desktop browsers, it wraps the entire app inside a centered mobile device frame using our tokenized shadow and radius tokens, while automatically adapting to full-width native presentation on mobile devices. This gives reviewers the authentic mobile experience regardless of what screen they use to view the app."

---

## 13. Cross-Platform Web Gotchas & Visual Polish

### 1. The React Native Web "Serif Font" Inheritance Trap

- **The Problem:** In React Native Web, when JSX renders composite string interpolations (e.g. `<Badge>Mode: {mode} ({resolvedMode})</Badge>`), `children` is an array: `["Mode: ", mode, " (", resolvedMode, ")"]`. Naive code checking `typeof children === 'string'` evaluates to `false` and bypasses `<RNText>`, dumping bare text nodes into an unstyled HTML `<div>`.
- **The Browser Consequence:** On web browsers, text inside a `<div>` without explicit `font-family` falls back to the browser default: Times New Roman (a serif font).
- **The Design System Solution:** Components like `Badge` and `Button` must always normalize children by checking `typeof children === 'string' || typeof children === 'number' || Array.isArray(children)` and wrapping them in `<Text>` with `fontFamily: theme.typography.fontFamily.sans`.

### 2. Icon Normalization in Action Buttons

- **The Problem:** If `ButtonProps` defines `leftIcon?: React.ReactNode` and renders `{leftIcon}` directly, developers passing string names (`rightIcon="ChevronRight"` or `leftIcon="Sun"`) will cause React to render the literal text string `"ChevronRight"` next to the button label.
- **The Solution:** The design system normalizes `leftIcon` and `rightIcon` across types:
  ```tsx
  if (typeof iconNode === 'string') {
    return <Icon name={iconNode} size={sizeTokens.iconSize} color={textColor} />;
  }
  if (typeof iconNode === 'function') {
    const IconComponent = iconNode as LucideIcon;
    return <IconComponent size={sizeTokens.iconSize} color={textColor} />;
  }
  return iconNode;
  ```
  This automatically maps icon names to Lucide SVG components bounded to theme colors and size tokens.

### 3. Header Viewport Clipping & Narrow Screen Wrap

- **The Problem:** Single-row headers containing title, back button, badge, 3 mode switchers, and 2 brand switchers require $> 550\text{pt}$ width, causing severe right-side clipping on phone viewports ($390\text{pt}$ – $480\text{pt}$).
- **The Solution:** Separate into a clean two-row hierarchy: Row 1 handles primary navigation and tenant branding; Row 2 houses a horizontal, non-clipping scrollable/wrapping control bar with WCAG AA ghost buttons.

### 4. Responsive Wrapping & Mobile Overflow Protection

- **The Problem:** In mobile design system documentation, long type unions (e.g. `'display' | 'heading' | 'title' | 'body' | 'label' | 'caption'`) push adjacent default values off-screen when placed in fixed horizontal rows without `flexWrap`. Similarly, button groups with 5–6 options (variants, sizes, colors) extend past device boundaries.
- **The Solution:** 
  1. Set `flexWrap: 'wrap'` and `flexShrink: 1` across all control rows and metadata columns.
  2. In `<ComponentPage>`, prop definitions wrap naturally, allowing default values to drop onto their own line below long type badges when space is tight.
  3. Form controls (`<Checkbox>`, `<Switch>`) apply `flexShrink: 1` to text labels so multi-line text wraps gracefully without expanding the parent container.
  4. In `<Timeline>`, milestone headers use `flexWrap: 'wrap'`, ensuring timestamps drop below long step titles on narrow mobile screens.

### 5. Multi-Tenant White-Labeling (Component Token Overrides)

- **The Problem:** Merging semantic color overrides (`colors.action.primary.default`) is insufficient if components read pre-compiled component tokens (`theme.components.button.primary.bg`). Primary buttons and badges would remain stuck in the default corporate theme.
- **The Solution:** Deep theme mergers (`createTheme()`) must override component-tier tokens (`components.button.primary`, `components.badge.brand`) in addition to semantic palettes, ensuring white-labeled themes cascade down to all component states.

### Interview Talking Point:

> "To guarantee seamless mobile usability across all 15+ logistics apps and our documentation showcase, we hardened all layouts against horizontal overflow: long type unions and playground controls wrap gracefully with `flexShrink: 1` and `wrap={true}`, while `<Timeline>` timestamps drop below long titles on phone viewports. Furthermore, to support white-labeling, our `createTheme()` merger updates both semantic and component-tier tokens (`button.primary`, `badge.brand`), making custom theme transitions seamless."

---

## 14. Web Focus Outlines, Shared Playground Isolation & Props API Normalization

### 1. The React Native Web Double Focus Border Trap

- **The Problem:** In React Native Web, a `<TextInput>` renders as an HTML `<input>` inside an enclosing container `<View>`. When focused in a browser:
  1. The browser's user-agent CSS applies a default outline (`outline: 2px solid -webkit-focus-ring-color`) to the inner `<input>`.
  2. The DS design system applies its own 2px focus border (`inputTokens.border.focus`) to the container `<View>`.
  This creates two nested, clashing focus borders on web.
- **The Solution:** Apply platform-safe styles on web to suppress the inner input outline:
  ```tsx
  const nativeInputStyle: TextStyle = {
    flex: 1,
    height: '100%',
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: sizeTokens.fontSize,
    color: textColor,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none' as never,
      outlineWidth: 0 as never,
    }),
  };
  ```
  This preserves exactly ONE clear, prominent focus border on the container wrapper using `inputTokens.border.focus` (`#1D4ED8` light, `#60A5FA` dark).
- **Focus States on Checkbox and Switch:**
  Enhanced `useToggle` headless hook with `isFocused`, `onFocus`, and `onBlur`. Checkbox resolves `boxBorder = state.isFocused ? checkboxTokens.border.focus : ...`, and Switch adds a 2px `theme.colors.border.focus` border when focused, while suppressing outer pressable browser outlines on web.
- **Non-Text Focus Contrast (WCAG 2.1 SC 1.4.11):**
  Focus indicators must meet at least $3.0:1$ contrast against adjacent background colors. Both light mode ($6.7:1$ on surface, $6.4:1$ on canvas) and dark mode ($7.0:1$ on surface, $7.9:1$ on canvas) easily surpass this standard in automated CI tests (`scripts/contrast.ts`).

### 2. Playground Preview Container Isolation

- **The Problem:** In component playgrounds where horizontal space is constrained (e.g. `Box & Stack` showing 3 parcels side-by-side with 32pt spacing), elements pushed past card boundaries and clipped on phone viewports.
- **The Solution:** In the shared `<ComponentPage>` component, wrap `{playground}` in a horizontal `<ScrollView>` with `minWidth: '100%'`. This ensures wide component previews scroll smoothly within the card without breaking layout boundaries, while playground items use `minWidth: 0, flexShrink: 1` to shrink when appropriate.

### 3. Component Props API Normalization

- **The Problem:** Showing `"Default: undefined"` for optional props looks sloppy, while displaying `"Default: required"` obscures mandatory props.
- **The Solution:** Centrally in `<ComponentPage>`:
  - Required props render a prominent red `<Badge variant="danger" size="sm">Required</Badge>`.
  - Optional props with no default render `"Default: None"` in muted secondary text.
  - Defined defaults render `"Default: <value>"` with monospace code styling.

### 4. White-Labeling Multi-Tenant Communication

- **Talking Point:**
  > "When presenting custom themes, clarity is key: `createTheme()` allows partner applications to consume custom token scales with zero-runtime overhead—the exact same component code consuming a custom brand token scale via `createTheme()`."

---

## 15. Timeline Content Flow, Timestamp Wrapping & Overflow Anti-Patterns

### 1. The Column Flex Constraint Rule

- **The Problem:** In UI patterns where a fixed-width element (an icon, avatar, or timeline indicator dot) sits next to a text column, naive code omits `minWidth: 0` on the text column or sets an arbitrary `minWidth` on the title. In flexbox, flex children default to `min-width: auto` (their content size). When titles or descriptions are long, the text column refuses to shrink below its content width, pushing the entire row wider than its parent and clipping text at the container's right edge.
- **The Solution:**
  1. The fixed column (indicator/connector) must have `flexShrink: 0` and a tokenized fixed width (`timelineTokens.indicator.size`).
  2. The content column must explicitly specify `flex: 1`, `minWidth: 0`, and `maxWidth: '100%'`. This enforces that the content takes strictly the *remaining* width and never exceeds it.
  3. Text elements inside must set `flexShrink: 1, minWidth: 0, maxWidth: '100%'` with no artificial `numberOfLines` clamping unless an explicit truncation design is intended.

### 2. Timestamp Wrapping vs. Clipping

- **The Problem:** When placing a title on the left and a timestamp on the right using `justifyContent: 'space-between'`, setting `flexShrink: 0` on the timestamp and `minWidth: 140` on the title forces both items to remain on line 1 even when the container width drops to 200px. The row width exceeds the parent, truncating the timestamp ("Exp...").
- **The Solution:** Use a flexWrap row (`flexWrap: 'wrap'`, `alignItems: 'flex-start'`, `gap: theme.spacing[1]`) with `flexShrink: 1, minWidth: 0, maxWidth: '100%'` on both title and timestamp.
  - When the container is wide: title sits on the left, timestamp sits on the right.
  - When the container is narrow: the timestamp wraps naturally onto the line immediately below the title, maintaining full legibility with zero clipping.

### 3. The Anti-Pattern of Masking Containers

- **The Anti-Pattern:** When components overflow on narrow screens, a common anti-pattern is wrapping the preview in a horizontal `<ScrollView>` or applying `overflow: 'hidden'` to the parent container. This conceals the underlying flex deficit: inside a horizontal scroll container, `width: '100%'` no longer constrains to the viewport width, and `overflow: 'hidden'` silently clips the right side of cards.
- **The Best Practice:** A vertical milestone stepper or card must always adapt to its container width naturally. Remove horizontal scroll views and overflow clipping from parent containers so that flex wrapping and shrinking issues are surfaced and corrected directly in component styles.

### Interview Talking Point:

> "In mobile logistics apps, drivers and warehouse operators routinely use 320px–375px screens under maximum Dynamic Type font scaling. To prevent text clipping in our vertical Timeline stepper, each step's content column uses `flex: 1` and `minWidth: 0` alongside fixed `flexShrink: 0` indicators. When milestone titles are long, timestamps wrap cleanly onto the line below via `flexWrap: 'wrap'`, ensuring zero horizontal scrolling or truncated information on rugged mobile devices."

---

## 16. AI-Readiness, Multi-Agent Rules & Zero-Drift Synchronization (Step 5.1)

### 1. The LLM Design System Hallucination Problem

- **The Problem:** AI coding assistants (Gemini, Claude, Cursor, GitHub Copilot) are trained on millions of generic React and React Native repositories. When asked to "create a shipment tracking screen," an AI tool will naturally:
  - Invent arbitrary hex codes (`#1D4ED8`, `#F3F4F6`, `#333`).
  - Introduce magic pixel margins and paddings (`style={{ marginTop: 15, padding: 12 }}`).
  - Import raw `<Text>`, `<TextInput>`, `<TouchableOpacity>`, and `<Button>` directly from `'react-native'`.
  - Violate WCAG touch target constraints (< 44pt) and omit screen reader labels.
- **The Solution:** Make the design system machine-readable by authoring an explicit system constraints contract:
  1. **Canonical Source (`docs/ai/rules.md`):** A single comprehensive specification covering what the design system is, allowed import paths (`@shani/ui`, `@shani/tokens`), prohibitions against raw styling, component prop scales, accessibility mandates, typographic hierarchies, card action placement rules, and verified Do/Don't code examples.
  2. **Multi-Agent Sync Tooling (`scripts/sync-rules.ts`):** `pnpm sync:rules` generates byte-for-byte identical copies to the project root for every major AI coding assistant:
     - `GEMINI.md` for Google Gemini CLI & Antigravity agents.
     - `AGENTS.md` for autonomous agentic developer tools.
     - `CLAUDE.md` for Anthropic Claude Code and desktop workflows.
     - `.cursorrules` for Cursor IDE developers.
  3. **Zero-Drift CI Guardrails (`pnpm rules:check` & `scripts/rules.test.ts`):** An automated Jest test verifies that none of the assistant configuration files drift from the canonical source in `docs/ai/rules.md`.

### 2. Interview Talking Point

> "Design systems fail in the AI era when LLMs don't know the rules and invent ad-hoc hex colors, magic numbers, and raw React Native primitives. In Shani DS, we treated AI agents as first-class consumers: we established a canonical machine-readable rules contract (`docs/ai/rules.md`) that defines strict import whitelists, component token scales, and card action hierarchy rules. Using `scripts/sync-rules.ts` and automated CI drift tests (`pnpm rules:check`), we keep rules identical across Gemini, Claude, Cursor, and custom agents, ensuring AI-generated screens match our design system on the very first prompt."

---

## 17. Machine-Readable Component Manifest & Gallery Documentation Unification (Step 5.2)

### 1. Eliminating the "Two Copies of Truth" Drift Problem

- **The Problem:** In many component libraries, human documentation (gallery props tables, websites) and AI context files (JSON manifests, markdown cheat sheets) are maintained independently. Inevitably, someone adds a prop, changes a default, or adjusts a variant in TypeScript, updates the human doc, and forgets the AI manifest—or vice versa. Over time, AI prompts feed on stale metadata and hallucinate incorrect props.
- **The Architectural Solution:**
  1. **Automated AST Extraction (`scripts/generate-manifest.ts`):** We use `react-docgen-typescript` configured against `packages/ui/tsconfig.json` to inspect the real TypeScript component source code. It parses all 19 exported components, extracting exact prop names, JSDoc descriptions, required flags, default values, and literal union values (e.g. `'primary' | 'secondary' | 'danger'` rather than just generic `string`).
  2. **Unified Manifest (`packages/ui/components.json`):** Generates a comprehensive JSON schema with descriptions, categories, variants, sizes, when to use (dos), when not to use (donts), accessibility notes, compiling usage examples, and real prop types.
  3. **Direct Gallery Consumption:** In `apps/gallery`, all 12 component pages import directly from `components.json` via `apps/gallery/src/componentsMeta.ts` (`getComponentDoc` and `formatPropsForGallery`). There are no hardcoded props tables or duplicated guideline strings in gallery pages.
  4. **Snippet Compilation Guardrails:** In `scripts/check-snippets.ts`, every code snippet in `components.json` is fed to the TypeScript compiler host and typechecked against real library exports. `pnpm snippets:check` guarantees that 100% of code snippets compile without errors.
  5. **Continuous Drift Detection:** Running `pnpm manifest:check` in CI verifies that `packages/ui/components.json` matches the actual component source code and fails the build if someone forgets to regenerate it.

### 2. Interview Talking Point

> "To make our design system reliable for AI screen generation and human developers alike, we eliminated documentation drift at the root. We built an automated TypeScript AST extractor that parses all 19 components into `packages/ui/components.json` with real union types, default values, accessibility guidelines, and compiling code examples. Both our live gallery documentation and AI tools consume this single manifest. We enforce zero-drift in CI with `pnpm manifest:check` and compile every code snippet with TypeScript using `pnpm snippets:check`."

---

## 18. AI Screen Construction, Figma MCP Integration & Prompt Engineering (Step 5.3)

### 1. Bridging the Gap from Figma to Code with MCP & Code Connect

- **The Problem:** Handing an AI agent a screenshot or a vague verbal prompt produces inconsistent React Native layouts. Even when using a component library, LLMs struggle to infer whether a design frame is an `outlined` or `elevated` Card, which spacing token to apply, and how component variants map to Figma components.
- **The Architectural Solution:**
  1. **Figma Dev Mode MCP Server:** By configuring the Model Context Protocol (MCP) server for Figma, AI coding agents can read raw node trees, inspect layer properties, and extract bound variable collections (`color/action/primary/default`, `spacing/4`) directly from Figma's API.
  2. **Formal Variable Mapping (`docs/ai/figma-mapping.md`):** We mapped Figma 3-tier variables directly to `@shani/tokens` (primitive, semantic, component), providing a deterministic translation dictionary for AI tools.
  3. **Figma Code Connect:** Documented Code Connect configurations (`figma.connect`) that embed production `@shani/ui` TypeScript snippets directly inside Figma Dev Mode, so developers see true React Native code in the Figma canvas.
  4. **Strict Compositional Guidelines (`docs/ai/guidelines.md`):** Codified the 4-layer screen anatomy, layout patterns (`VStack` of cards, `HStack` headers, sticky bottom action bar), typographic hierarchy rules (hero ETA is the only display, section titles use title), and 44pt touch target mandates.
  5. **Battle-Tested Prompt Templates (`docs/ai/prompt-templates.md`):** Provided ready-to-use prompt templates for building logistics screens from scratch, building from Figma Dev Mode specs, refactoring legacy screens, and extending compound components.

### 2. Interview Talking Point

> "To make Shani DS truly AI-ready, we didn't just write a component library—we built the translation layer between design and code. In `docs/ai/`, we documented our layout patterns, typographic hierarchy rules, and 44pt industrial touch target standards. We mapped our 3-tier tokens directly to Figma variables and established setup specifications for the Figma Dev Mode MCP Server and Figma Code Connect. Using our structured prompt templates, autonomous AI agents and engineers can query Figma nodes and generate production-grade, accessible React Native screens on the first attempt."





