# Architecture Decision Records (ADRs)

## ADR-001: Monorepo Tooling & Structure

- **Context:** Shani DS needs to support multi-package distribution (@shani/tokens, @shani/ui, apps/gallery) with shared dependencies and strict type safety across packages.
- **Decision:** Use pnpm workspaces with `node-linker=hoisted` and TypeScript project references.
- **Why:** pnpm offers lightning-fast disk-efficient installations, strict workspace boundaries, and the hoisted linker ensures seamless Metro bundler resolution for React Native and Expo.
- **Alternatives Considered:**
  - npm/yarn workspaces: Slower resolution, looser peer dependency isolation.
  - Turborepo / Nx: Added orchestration overhead for the initial foundation phase; can be layered on if build caching requires scaling across remote CI workers.

## ADR-002: Three-Tier Token Architecture & W3C Format

- **Context:** A logistics enterprise with 15+ mobile apps requires consistent branding while allowing white-label customizations, dark mode, high contrast, and component-specific token overrides.
- **Decision:** Adopt a 3-tier token hierarchy formatted according to the W3C Design Tokens Community Group specification (`$value`, `$type`, `$description`):
  1. **Primitives**: Raw palette scales (50–900), spacing (4pt grid), radius, typography, shadows, motion, breakpoints.
  2. **Semantic**: Intent-based aliases (`bg.canvas`, `text.primary`, `action.primary.default`) referencing primitives for Light and Dark modes.
  3. **Component**: Scoped component tokens (`button.primary.bg`, `input.border.error`) referencing semantic tokens.
- **Why:** Separates raw design choices from brand decisions and component implementations. Allows dark mode and white-labeling to change semantic mappings without modifying component code.
- **Alternatives Considered:**
  - Single-tier flat tokens: Hardcodes light/dark colors into components, breaks white-labeling.
  - 2-tier (Primitive + Semantic only): Lacks isolation for fine-grained component customization when a button needs a subtle variation from default action colors.

## ADR-003: Zero-Dependency Token Build Pipeline & Drift Enforcement

- **Context:** Generated TypeScript types and token dictionaries need to stay strictly synchronized with JSON token source files.
- **Decision:** Build a fast, lightweight TypeScript compiler (`scripts/build-tokens.ts`) using Node.js/tsx that resolves token alias paths, generates strongly typed TypeScript objects (`light.ts`, `dark.ts`, `types.ts`), and exports flat/nested JSON with a `--check` drift prevention flag.
- **Why:** Avoids heavy external token build tools (like Style Dictionary) that add arbitrary config bloat; guarantees 100% strict TypeScript types matching the exact React Native style object signatures.
- **Alternatives Considered:**
  - Style Dictionary: Mature but heavy, requires complex custom formatters for idiomatic React Native StyleSheet types.

## ADR-004: WCAG 2.1 AA Contrast Threshold Enforcement

- **Context:** Mobile logistics applications are operated in unpredictable outdoor lighting and warehouse environments by users with diverse visual abilities. Certain text tokens (such as `text.tertiary`) represent small text (captions, form field helpers, timestamps, tracking notes).
- **Decision:** Strictly enforce a 4.5:1 minimum contrast ratio across all normal-sized text tokens (`text.primary`, `text.secondary`, `text.tertiary`, `text.brand`, `text.danger`, etc.) against all applicable backgrounds (`bg.canvas`, `bg.surface`, `bg.surfaceRaised`). The relaxed 3:1 threshold is reserved exclusively for large text (≥18pt or ≥14pt bold) and non-text graphical UI components (e.g. feedback icons, active control borders).
- **Why:** WCAG 2.1 Success Criterion 1.4.3 requires 4.5:1 for normal text (<18pt regular). Since tertiary text is frequently rendered at 12pt (`fontSize.xs`) or 14pt (`fontSize.sm`), treating it under the 3:1 graphical component threshold produces illegible UI on glare-prone mobile screens.
- **Alternatives Considered:**
  - Permitting 3:1 for tertiary text: Leads to accessibility failures and illegibility for warehouse drivers in sunlight.

## ADR-005: Zero-Runtime Styling & Context-Driven Theme Engine

- **Context:** Mobile apps running on warehouse handheld scanners and lower-end Android devices cannot afford the JS-thread runtime overhead, GC pauses, or bundle weight of heavy CSS-in-JS libraries (e.g., styled-components, Emotion, or Tamagui compiler plugins).
- **Decision:** Build a zero-runtime typed styling pipeline using React Native's native `StyleSheet.create` wrapped in memoized helpers (`useStyles`, `createStyles`) and a React Context `<ThemeProvider>` supporting `system | light | dark` modes and deep brand overrides via `createTheme()`.
- **Why:** `StyleSheet.create` sends styles through the React Native bridge once and registers integer IDs in native memory, achieving 60/120 FPS performance while enforcing 100% type-safe token consumption.
- **Alternatives Considered:**
  - Tamagui / NativeWind: Added build tool dependencies and configuration complexity for cross-platform Expo Web/Native pipelines.
  - Emotion / styled-components: Heavy runtime recalculations on every render frame causing dropped animations.

## ADR-006: Headless Behavior & Accessibility Primitives

- **Context:** Design systems often intertwine visual styling with interaction handling (press states, accessibility attributes, focus states). This creates duplicated logic, fragile a11y support, and hard-to-maintain components.
- **Decision:** Separate all behavior, state, and ARIA attributes into pure headless hooks (`usePressable`, `useToggle`, `useTextField`, `useDisclosure`) that return spreadable props and state with ZERO styling opinions.
- **Why:** Enables 100% unit-testable accessibility and interaction state machines independent of UI rendering. Ensures all 15+ logistics apps remain accessible out of the box without requiring engineers to manually configure accessibility roles or states.
- **Alternatives Considered:**
  - Monolithic component-bound logic: Results in copy-pasted touch handlers and inconsistent accessibility labels across custom controls.

## ADR-007: Base & Layout Primitives (Group A)

- **Context:** Mobile developers often scatter arbitrary flexbox rules, hardcoded pixel margins, and unconstrained font sizes throughout screens, creating visual drift, broken layouts under Dynamic Type, and accessibility flaws.
- **Decision:** Build a foundational layout and typography tier consisting of `Box`, `Stack` (`HStack`, `VStack`), `Divider`, `Text`, and `Icon`:
  - `Box`: Token-constrained style props for padding, margin, background, border, radius, shadow, and opacity.
  - `Stack`: Linear child distribution using strict 4pt spacing tokens for `gap`, supporting custom alignment and divider injection.
  - `Text`: 6 semantic variants (`display`, `heading`, `title`, `body`, `label`, `caption`) with automatic header accessibility roles and `maxFontSizeMultiplier={2.0}` to guard against layout clipping during large font scaling.
  - `Divider`: Accessible separator rule with tokenized thickness, semantic border color, and inset spacing.
  - `Icon`: Strict token wrapping of Lucide icons, mapping size and semantic text colors, automatically marking icons decorative (`accessible={false}`) unless an `accessibilityLabel` is provided.
- **Why:** Enforces zero magic numbers at the layout level, prevents font clipping during Dynamic Type scaling, and ensures screen readers don't stutter over decorative SVG icons.
- **Alternatives Considered:**
  - Unconstrained native `<View>` and `<Text>`: Allows developer drift and breaks design system consistency across 15+ logistics applications.

## ADR-008: Action Primitives (Group B: Button & IconButton)

- **Context:** Action components in logistics applications (e.g. driver delivery confirmation, warehouse scanner pick-confirm) require strict touch targets for operators wearing industrial gloves, tactile responsiveness, guaranteed screen reader labels, and non-blocking loading states.
- **Decision:**
  - Build `Button` and `IconButton` on the `usePressable` headless hook and React Native Reanimated micro-interactions (press scale to 0.97 with `snappy` spring tokens).
  - Automatically honor system reduced-motion preferences via `useReducedMotion()`.
  - Enforce minimum 44x44pt touch targets across all sizes (sm: 44, md: 48, lg: 56).
  - For `IconButton`, require `accessibilityLabel: string` as a mandatory, non-optional TypeScript prop, preventing unlabeled icon buttons from ever compiling.
  - Protect typography against layout clipping with `maxFontSizeMultiplier={2.0}`, `allowFontScaling={true}`, and `numberOfLines={1}`.
- **Why:** Guarantees 100% WCAG AA compliance (Target Size 2.5.5, Non-text Contrast 1.4.11, Name/Role/Value 4.1.2) while maintaining 60/120 FPS native UI thread animations.
- **Alternatives Considered:**
  - Native `TouchableOpacity`: Deprecated in modern React Native, lacks accessibility state synchronization, and cannot leverage Reanimated UI-thread transforms.
  - Optional `accessibilityLabel` on `IconButton`: Causes silent accessibility regressions where screen readers announce "button" with no contextual meaning.

## ADR-009: Form Primitives (Group C: TextField, Checkbox, Switch)

- **Context:** Mobile form inputs in logistics (e.g., package dimensions, address entry, hazardous cargo checklists, automated dispatch toggles) frequently suffer from poor error association for screen readers, undersized touch targets, and laggy JS-thread switch transitions.
- **Decision:**
  - `TextField`: Built on `useTextField` headless hook. Enforces tokenized border states (focus, error, disabled) and sizing (min 44pt). Supports prefix/suffix adornments, secure text entry with an accessible eye toggle button, and links error messages to `accessibilityHint`.
  - `Checkbox`: Built on `useToggle` (`role="checkbox"`). Supports ternary states (unchecked, checked, indeterminate/mixed) with Reanimated checkmark scale animations. Enforces a 44x44pt touch area.
  - `Switch`: Built on `useToggle` (`role="switch"`). Uses Reanimated `translateX` spring physics (`motion.spring.snappy`) running on the native UI thread, respecting `useReducedMotion()`. Enforces a 44x44pt minimum touch area.
- **Why:** Delivers fluid 60/120 FPS form controls that strictly adhere to WCAG AA accessibility criteria, preventing input errors and ensuring warehouse staff can reliably tap controls with work gloves.
- **Alternatives Considered:**
  - Native platform `<Switch>` component: Inconsistent styling across iOS and Android, cannot consume multi-brand token palettes, and cannot be customized for white-label partner apps.

## ADR-010: Display Primitives (Group D: Card, Badge, Skeleton, Timeline)

- **Context:** Logistics applications require structured parcel detail cards, high-contrast status tags, accessible skeleton loading states that respect motion sensitivity, and vertical stepper timelines for multi-stop courier routes and package milestones.
- **Decision:**
  - `Card`: Surface container offering `outlined`, `elevated` (using shadow tokens), and `filled` variants with composable sections (`CardHeader`, `CardContent`, `CardFooter`).
  - `Badge`: Status pill utilizing semantic feedback pairs with 100% WCAG AA contrast, optional status dot, and leading icon.
  - `Skeleton`: Content placeholder using Reanimated pulse micro-interactions on the UI thread, falling back to a static low-contrast shape when `useReducedMotion()` is active.
  - `Timeline`: Vertical tracking stepper with states (`completed`, `current`, `upcoming`), custom connecting lines, active focus dots, and semantic `accessibilityRole="list"` with spoken milestone descriptions.
- **Why:** Enforces consistent, accessible data display across complex logistics workflows without inline styles or unannounced layout shifts.
- **Alternatives Considered:**
  - Third-party stepper/timeline packages: Introduce bloat, fail dark mode token synchronization, and lack custom screen reader accessibility announcements for shipment milestones.

## ADR-011: Expo Router Monorepo & Cross-Platform Web Bundling (apps/gallery)

- **Context:** The design system needs an interactive showcase app (`apps/gallery`) running on Expo (iOS, Android, and Web) to demonstrate components, tokens, and multi-brand theming. Metro bundler in a pnpm monorepo must resolve local workspace packages (`@shani/tokens`, `@shani/ui`) and their dependencies without hoisting conflicts or bundler resolution failures.
- **Decision:**
  - Configure `apps/gallery/metro.config.js` to watch the monorepo root and resolve node modules from both `apps/gallery/node_modules` and root `node_modules`.
  - Configure `packages/tokens` and `packages/ui` `package.json` entry points to point to TypeScript source (`./src/index.ts`) for seamless hot reloading and unified compilation during Metro web and native runs.
  - Implement a tenant brand switcher using `createTheme()` (e.g. Apex Fleet Partner Theme) extending the base token set with partner primitive scales (`color.partner.*`), demonstrating white-label multi-branding with zero raw hex codes.
- **Why:** Enables instant, zero-build developer feedback across web and mobile platforms while preserving strict workspace boundaries and token inheritance.
- **Alternatives Considered:**
  - Separate standalone repository for the gallery: Disconnects component changes from testing and introduces package publication friction.
  - Storybook React Native on Web: Heavy setup, often falls behind Expo SDK releases, and diverges from production Expo Router mobile architecture.

## ADR-012: Live WCAG Contrast & Token Exploration in Gallery (Step 4.2)

- **Context:** Design tokens can feel abstract when defined purely as JSON files or static documentation tables. Developers building logistics applications need to see actual token values, visual scale bars, and dynamically verified contrast ratios across both light/dark modes and multi-brand tenant themes.
- **Decision:**
  - Build a comprehensive Tokens Explorer (`/tokens`) featuring 6 categorized tabs: Colors & Contrast, Spacing, Typography, Radius, Shadows, and Motion.
  - Compute contrast ratios in real time using client-side relative luminance math (`getContrastRatio`) mapped to the active theme context (`useTheme()`), confirming that all 58 WCAG AA pairs maintain $\ge 4.5:1$ compliance during theme swaps.
- **Why:** Reassures engineering and accessibility auditors that token pairs meet compliance under all active themes and prevents contrast regressions during white-label customization.
- **Alternatives Considered:**
  - Static markdown contrast tables: Do not react to live theme or tenant brand switches.

## ADR-013: Uniform Component Documentation Architecture (Step 4.3)

- **Context:** In large mobile design systems, component documentation often suffers from fragmented layouts, missing accessibility notes, or out-of-date usage snippets.
- **Decision:**
  - Create a reusable `<ComponentPage>` template layout structuring every component into 6 standard sections:
    1. Live Interactive Playground with state/variant toggle buttons.
    2. All-States Matrix displaying every visual permutation.
    3. Component Props API table (name, type, default, description).
    4. Practical Do's & Don'ts tailored to warehouse and courier workflows.
    5. Assistive Technology & WCAG Accessibility specifications.
    6. Copy-Paste Code Snippet using real-world logistics examples.
  - Build the gallery UI exclusively with `@shani/ui` components (`Box`, `Stack`, `Text`, `Badge`, `Card`, `Button`, `IconButton`, `Divider`, `Icon`).
- **Why:** Enforces consistent documentation quality across all 12 component pages and dogfoods `@shani/ui` primitives to verify production usability.
- **Alternatives Considered:**
  - Ad-hoc custom page layouts for each component: Increases maintenance burden and results in inconsistent documentation standards.

## ADR-014: Responsive Phone-Frame Layout & Web Deployment (Step 4.6)

- **Context:** When mobile-first React Native components are previewed in desktop web browsers, unconstrained viewports cause layout stretching and uncharacteristic wide screens that do not reflect mobile ergonomics.
- **Decision:**
  - In `apps/gallery/app/_layout.tsx`, detect wide web viewports (`Platform.OS === 'web' && width > 768`) and constrain the root application inside an authentic, centered mobile phone frame (max width 480pt, rounded corners via `theme.radius['2xl']`, elevation via `theme.shadow.lg`, and subtle borders) while retaining native full-screen presentation on mobile devices.
  - Provide a standalone `vercel.json` and export script (`expo export -p web`) so the gallery can be continuously deployed to static web hosting without a Node.js server runtime.
- **Why:** Delivers an authentic mobile app presentation to interviewers, stakeholders, and developers on desktop web browsers without breaking mobile device responsiveness.
- **Alternatives Considered:**
  - Full-width desktop responsive grid: Distorts mobile-specific logistics navigation patterns and misrepresents touch ergonomics.

## ADR-015: Gallery Theme Defaults, Icon Normalization & Mobile Layout Wrap (Step 4 Fixes)

- **Context:** Visual inspection of the exported web gallery revealed 6 ergonomic and cross-platform issues: default system mode caused dark mode by default on dark OS environments, header controls clipped on narrow phone viewports ($\le 480\text{pt}$), unselected switcher buttons and bare string icons rendered unstyled or invisible, "Explore" buttons rendered string names instead of Lucide SVG icons, array-based children in badges rendered in browser default serif fonts, and badge containers lacked wrapping.
- **Decision:**
  - **Default Theme Mode:** Set `initialMode="light"` in `GalleryContext.tsx` while keeping manual `dark` and `system` options available.
  - **Header Structure:** Reorganized `GalleryHeader` into a two-row hierarchy: navigation & tenant badge in Row 1; horizontally scrollable / wrapping controls in Row 2, eliminating clipping on any viewport width.
  - **Button & Badge Icon Normalization:** Updated `Button` and `Badge` to accept icon names as strings (e.g. `rightIcon="ChevronRight"`, `leftIcon="Sun"`), `LucideIcon` components, or React elements. When an icon string is passed, it is resolved and rendered through `<Icon name={...} />` bounded to design system color and size tokens.
  - **Font Consistency on Composite Children:** Normalized `Button` and `Badge` to wrap composite array children (`Mode: {mode}`) in `<Text>` / `<RNText>` with explicit `fontFamily: theme.typography.fontFamily.sans`, preventing browser default serif fallback on web.
  - **Dark Mode Contrast:** Standardized unselected switcher buttons to use the `ghost` variant, resolving text and icons to `theme.colors.text.primary` ($16.5:1$ contrast against dark surfaces), satisfying WCAG 2.1 AA.
  - **Flexible Wrapping:** Added `wrap={true}` to badge rows and directory cards to ensure clean multiline flow without truncation on narrow mobile screens.
- **Why:** Delivers a polished, accessible, and bug-free cross-platform showcase for desktop and mobile preview environments.
- **Alternatives Considered:**
  - Requiring callers to always wrap icons in `<Icon>` explicitly: Fragile and counter-intuitive; automated normalization within `Button` and `Badge` provides ergonomic DX and prevents unstyled text rendering.

## ADR-016: Universal Layout Overflow Hardening & Multi-Brand Preview Strip

- **Context:** Component documentation pages suffered from horizontal layout overflow when viewed inside narrow mobile viewports ($\le 480\text{pt}$). Long TypeScript type union badges (e.g. `'display' | 'heading' | 'title' | 'body' | 'label' | 'caption'`) in the Props API table pushed default values outside card boundaries. Additionally, switching brands between Shani Core and Apex Fleet was not immediately obvious on the home page because primary button component tokens were not overridden in the theme merger.
- **Decision:**
  - **Component Props Table Wrapping:** In `<ComponentPage>`, wrapped the prop definition in a responsive layout (`wrap={true}`, `align="start"`), with `maxWidth: '100%'` and `flexShrink: 1` on type badges. When horizontal space is tight, default values drop gracefully onto their own line below the type badge.
  - **Primitive Text Shrinking:** Updated `<Badge>`, `<Checkbox>`, and `<Switch>` to include `flexShrink: 1` on text labels and `maxWidth: '100%'` on containers so long status strings and labels wrap without pushing parent containers.
  - **Timeline Header Wrapping:** In `<Timeline>`, added `flexWrap: 'wrap'` and `gap` to milestone headers, with `minWidth: 140` and `flexShrink: 1` on step titles, allowing timestamps to drop below on small mobile devices.
  - **Component Page Playground Controls:** Audited and applied `wrap={true}` across all 12 component pages' interactive playground controls (size tiers, variant buttons, color palettes, alignment, spacing) to eliminate horizontal scrolling.
  - **Comprehensive Brand Theme Overrides:** Updated `partnerThemeOverrides` to override `components.button.primary` and `components.badge.brand` so primary action buttons and brand badges immediately reflect the active white-label palette.
  - **Live Brand Preview Strip:** Added a dedicated brand preview strip to the Home page displaying the active tenant name, primary Button, brand Badge, link text, and themed card accent, making brand swaps immediately perceptible.
- **Why:** Eliminates all horizontal scrolling and clipped text across mobile viewports while proving white-label multi-brand support with zero runtime overhead.
- **Alternatives Considered:**
  - Truncating long types with ellipses (`numberOfLines={1}`): Hides essential API details from developers reading documentation on mobile devices. Wrapping preserves full type readability.

## ADR-017: Playground Overflow Isolation, Single Web Focus Border & Props API Normalization

- **Context:** Visual inspection across mobile browsers and screenshots revealed 4 polish and accessibility issues:
  1. In the Box & Stack live playground, horizontal stack items overflowed the preview container on narrow viewports.
  2. On web, the inner `<TextInput>` in `TextField` displayed the browser's default CSS focus outline in addition to the wrapper's 2px token focus border, producing two nested borders.
  3. The Component Props API table rendered literal `"Default: undefined"` for optional props and `"Default: required"` instead of a distinct visual indicator.
  4. The brand switcher's "Apex Fleet" tenant lacked explicit labeling clarifying that it is a white-label partner demo.
- **Decision:**
  - **Shared Playground Preview Container:** In `ComponentPage.tsx`, wrapped `{playground}` inside a horizontal `<ScrollView>` with `minWidth: '100%'`, allowing any wide preview to scroll smoothly without breaking the parent container boundary. Added `minWidth: 0, flexShrink: 1` and `numberOfLines={1}` to Box & Stack playground items.
  - **Single Web Focus Border:** In `packages/ui/src/components/TextField/TextField.tsx`, applied platform-safe styles `Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0, borderWidth: 0 }` to the inner `<TextInput>`. Preserved exactly one prominent 2px focus border on the outer container using `inputTokens.border.focus` (`#1D4ED8` light, `#60A5FA` dark).
  - **Checkbox & Switch Focus States:** Enhanced `useToggle` headless hook with `isFocused`, `onFocus`, and `onBlur`. In `Checkbox`, focused states trigger `checkboxTokens.border.focus`. In `Switch`, focused states trigger `theme.colors.border.focus` with a 2px border. Suppressed outer browser outlines on web via `outlineStyle: 'none'`.
  - **Non-Text Focus Contrast Audit:** Added `border.focus` against `bg.surface` and `bg.canvas` checks to `scripts/contrast.ts` and `contrastAudit.ts` ensuring $\ge 3.0:1$ non-text contrast under WCAG 2.1 SC 1.4.11 (measured 6.4:1–7.9:1, passing AA).
  - **Props API Normalization:** Centralized default value rendering in `ComponentPage.tsx`:
    - If required (`prop.default === 'required'` or mandatory): renders `<Badge variant="danger" size="sm">Required</Badge>`.
    - If undefined / missing: renders `"Default: None"` in secondary caption text.
    - If defined value: renders `"Default: <value>"` with monospace formatting.
  - **Brand Switcher Copy Clarification:** Updated `partnerTheme.ts`, `GalleryHeader.tsx`, and the Home screen (`index.tsx`) to clearly state: `"Partner brand demo: same components, different tokens"`.
- **Why:** Eliminates visual glitches on web browsers, guarantees non-text focus contrast compliance, presents a clean props reference, and clearly explains white-label architecture to evaluators.
- **Alternatives Considered:**
  - Allowing browser outline on web: Clashes with design system border tokens and creates inconsistent appearance across different browser engines (Chrome vs Safari vs Firefox).

## ADR-018: Timeline Content Column Flex Layout & Cross-Component Text Wrapping

- **Context:** In narrow mobile phone viewports ($\le 390\text{pt}$, down to $320\text{pt}$) and in large font scaling modes, the Timeline component exhibited text clipping at the right edge: milestone titles, descriptions, and right-aligned timestamps ("Exp...") overflowed or got cut off. This was exacerbated by parent container styling (e.g. horizontal scroll containers with `overflow: 'hidden'` or fixed `maxWidth` attributes) that masked underlying flex shrinking and wrapping deficits.
- **Decision:**
  - **Timeline Content Column Geometry:** In `packages/ui/src/components/Timeline/Timeline.tsx`, configured the step container with `width: '100%', maxWidth: '100%'`. Clamped the indicator dot/connector column with `flexShrink: 0` to preserve its fixed token size. Configured the content column with `flex: 1, minWidth: 0, maxWidth: '100%'` so it fills all remaining horizontal space without expanding past the container.
  - **Timestamp Wrapping Logic:** Structured the title + timestamp label row with `flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: theme.spacing[1]`. Removed fixed `minWidth: 140` from the title and set `flexShrink: 1, minWidth: 0, maxWidth: '100%'` on both title and timestamp. When horizontal space is tight, the timestamp wraps naturally onto the line directly below the title rather than forcing row overflow.
  - **Description Text Flow:** Ensured step descriptions use `flexShrink: 1, minWidth: 0, maxWidth: '100%'` without `numberOfLines` clamping, allowing natural multi-line text flow.
  - **Removal of Masking Containers:** In `ComponentPage.tsx`, removed the inner `<ScrollView horizontal>` and `overflow: 'hidden'` from the live playground preview card, ensuring the preview container is standard non-scrolling flex (`width: '100%', maxWidth: '100%'`). Removed arbitrary fixed `maxWidth: 440` from the Timeline playground card.
  - **Monorepo-Wide Row Layout Audit:** Audited and applied `wrap={true}`, `flexShrink: 1`, `minWidth: 0`, and `maxWidth: '100%'` across Card headers, shipment result cards, consignment detail rows, and TextField input/adornment rows to prevent text truncation under extreme Dynamic Type scaling.
- **Why:** Delivers 100% responsive, unclipped layout presentation on all phone sizes down to 320px and under accessibility font scaling without hiding layout bugs behind artificial scroll containers.
- **Alternatives Considered:**
  - Wrapping Timeline in a horizontal scroll view: Causes awkward horizontal panning for users reading vertical milestone updates. A vertical stepper must always fit its container width.

## ADR-019: Mobile Typography Density Tuning & 4pt Line-Height Alignment

- **Context:** Mobile logistics applications require dense, legible typography for handheld operation. Review of the primitive type scale tokens revealed oversized values for `display` (36pt) and `title` (20pt) that pushed screen layouts wider and caused aggressive text wrapping on narrow phone viewports ($\le 390\text{pt}$). Additionally, several line heights (`lineHeight['3xl'] = 38`, `lineHeight.lg = 28`) were not optimal multiples of the 4pt grid.
- **Decision:**
  - Adjusted `fontSize['4xl']` (`display`) from 36pt to 32pt with 40pt line height (strictly 4pt-aligned).
  - Adjusted `fontSize.xl` (`title`) from 20pt to 18pt with 24pt line height (strictly 4pt-aligned).
  - Adjusted `fontSize['3xl']` from 30pt to 28pt with 36pt line height (strictly 4pt-aligned).
  - Adjusted `lineHeight.lg` from 28pt to 24pt to establish 4pt alignment for 18pt font sizes.
  - Maintained `body` (16pt / 24pt), `label` (14pt / 20pt), and `caption` (12pt / 16pt), which align with mobile app industry standards.
- **Why:** Matches standard mobile ergonomics (body 14–16, label 12–14, caption 11–12, title 16–18, heading 20–24, display 28–32), eliminates layout crowding on 320px–390px screens, and ensures 100% of line heights are multiples of 4.
- **Alternatives Considered:**
  - Keeping 36pt display: Caused waybill tracking numbers and timestamps to wrap across 3–4 lines on compact mobile screens.

## ADR-020: Demo Screen Visual Hierarchy & Standard 390px Mobile Viewport Frame

- **Context:** On the Shipment Tracking and Shipments List demo screens, visual hierarchy had multiple competing `display` and `heading` variants (e.g. tracking number, ETA, and section titles all using oversized text). Additionally, the web preview container was clamped at 480px, masking standard mobile phone viewport constraints (such as the standard 390px iPhone width).
- **Decision:**
  - **Phone Frame Clamping:** Updated `apps/gallery/app/_layout.tsx` so the responsive phone frame on wide screens is constrained to `maxWidth: 390` (previously 480), centered at 100% zoom.
  - **Single Screen Hero:** Enforced that only ONE hero value per screen uses `variant="display"` (specifically the ETA time `"Today, 04:30 PM"` on Shipment Tracking).
  - **Section and Identifier Hierarchy:** Card section titles (`Estimated Delivery`, `Shipment Progress`, `Consignment & Cargo Details`, `Active Waybills`, `Waybill Results`) use `variant="title"`. Primary entity identifiers (`#SHN-849102-US`) use `variant="heading"`. Timeline step titles use `variant="title"` for current and `variant="label"` for completed/upcoming. Timestamps and metadata use `variant="caption"` or `variant="body"`.
  - **Rule Enforcement:** No text is rendered larger than the entity or section it labels.
- **Why:** Establishes unambiguous typographic hierarchy across complex logistics workflows and guarantees that components are verified under realistic 390px mobile phone constraints.
- **Alternatives Considered:**
  - Retaining 480px web container: Failed to reveal mobile text wrapping and spacing constraints representative of handheld mobile devices.

## ADR-021: Card Action Architecture & Utility Placement Rules

- **Context:** Action buttons on cards (e.g. Waybill records in Shipments list, Cargo details in Shipment tracking) suffered from inconsistent positioning and visual competition: primary actions, secondary buttons, and icon buttons were mixed in the same rows, leading to horizontal clipping on narrow viewports ($\le 390\text{pt}$) and ambiguous visual hierarchy for couriers.
- **Decision:**
  - **Single Main Action Bottom-Right:** Each card may contain at most ONE primary or secondary main action, positioned in the bottom-right footer row (e.g., `"Track Live"` with a chevron, or `"Download Waybill"`). On compact screens ($\le 390\text{pt}$), the footer row allows wrapping, and the main action expands to full width (`flexGrow: 1, flexBasis: 120, maxWidth: '100%'`).
  - **Icon-Only Utility Actions Top-Right:** Secondary or utility actions (such as `Print`, `Share2`, `Bell`, `QrCode`) must be placed in the card header at the top-right as ghost `IconButton` elements with mandatory `accessibilityLabel` attributes.
  - **Waybill Card Information Flow:** Ordered as:
    1. Top row: tracking number (`heading`, `flex: 1, minWidth: 0, wraps`) on the left; icon-only utility actions (`Printer`) top-right.
    2. Body: status `Badge`, followed by destination and package info (`wraps`).
    3. Divider.
    4. Footer: ETA timestamp (`Clock` icon + time) on the left, single main action (`Track Live`) on the right.
- **Why:** Eliminates action crowding, standardizes interaction affordances across 15+ logistics apps, ensures full touch target compliance (44x44pt), and guarantees unclipped responsiveness at 320px–390px.
- **Alternatives Considered:**
  - Multiple buttons in card footers: Causes horizontal truncation and button overlapping on 320px devices.

## ADR-022: Gallery Header Simplification & Removal of Brand-Switcher UI

- **Context:** The gallery previously included an interactive tenant brand switcher demonstrating white-label theme swapping (e.g., Apex Fleet). This introduced visual clutter in the gallery header (causing wrapping issues at 320px), confusing tenant badges, and a large preview card on the home screen that competed with primary component documentation.
- **Decision:**
  - **Remove Brand Switcher UI from Gallery:** Removed the Shani/Apex brand switcher, the "Shani Core" / "Apex Fleet" header badge, the "Tenant: ..." chip, and the blue "Active Brand Theme" preview strip from the gallery application.
  - **Preserve `createTheme()` in UI Core:** Retained `createTheme()` in `packages/ui` with its full test suite and architectural documentation in `docs/LEARNING.md`, stripped of competitor brand names.
  - **Streamlined Gallery Header:** Simplified `GalleryHeader` to contain strictly the logo/back button, page title, unclipped subtitle, and the Light/Dark/System theme switcher.
  - **Unified Mode Label:** Replaced verbose status text like `"Mode: light (light)"` with clean single-status labels: `"Mode: Light"`, `"Mode: Dark"`, or `"System (Dark)"` / `"System (Light)"`.
- **Why:** Delivers a focused, unclipped 320px-compliant design system documentation app while preserving the underlying multi-tenant white-labeling engine in the design system foundation.
- **Alternatives Considered:**
  - Retaining the brand switcher in a drawer: Still imposed UI maintenance overhead without adding value to core component documentation.

## ADR-023: Automated Typechecking for Documentation Code Snippets

- **Context:** Component documentation pages in `apps/gallery` provide copy-pasteable TypeScript code snippets for logistics application developers. Manual drift between exported component prop interfaces and documentation strings risks broken snippets, invalid prop usage, or confusing TypeScript errors in consuming projects.
- **Decision:**
  - **Documentation Snippet Audit:** Audited all 12 component pages' `codeSnippet` properties against `@shani/ui` and `@shani/tokens` prop definitions. Restructured the `Text` component snippet to demonstrate plain `Text` usage first, followed by composing with layout via `VStack`. Explicitly typed milestone arrays in `Timeline`.
  - **Automated Typecheck Engine (`scripts/check-snippets.ts`):** Implemented a TypeScript Compiler API runner that extracts `codeSnippet` strings from all gallery component screens, loads `apps/gallery/tsconfig.json`, creates in-memory virtual source files, and runs semantic diagnostic checks (`ts.getPreEmitDiagnostics`).
  - **CI Integration (`scripts/snippets.test.ts` & `package.json`):** Integrated snippet typechecks into the Jest test suite under `scripts/snippets.test.ts` and added `"snippets:check": "tsx scripts/check-snippets.ts"` in `package.json`. Any invalid prop, wrong variant, or broken type annotation immediately fails CI (`pnpm test` and `pnpm snippets:check`).
- **Why:** Eliminates documentation drift and guarantees 100% type-safe, runnable code snippets for developers integrating Shani DS into production logistics applications.
- **Alternatives Considered:**
  - `ts.transpileModule`: Only checks isolated syntax, unable to perform semantic typechecking or validate prop existence against actual component definitions.

## ADR-024: Button & Control Vertical Stretch Prevention via Component alignSelf

- **Context:** In React Native flexbox, containers default to `alignItems: 'stretch'`. When interactive action controls (`Button`, `IconButton`) or indicators (`Badge`, `Switch`, `Checkbox`) were placed inside flex rows or card footers (such as the Shipments list waybill card footer), the controls inherited `alignItems: 'stretch'`, stretching vertically to match the height of adjacent multi-line text or the row container.
- **Decision:**
  - **Component-Level `alignSelf` Protection:** Configured `Button` and `IconButton` with default `alignSelf: 'center'` on both the root `<Pressable>` touch wrapper and the inner animated container. Configured `Badge`, `Switch`, and `Checkbox` with default `alignSelf: 'flex-start'`.
  - **Horizontal-Only Full-Width Expansion:** For `fullWidth` buttons, expansion is applied strictly horizontally (`width: '100%'`) rather than setting cross-axis `alignSelf: 'stretch'`. In rows and columns, heights are strictly bounded by size tokens (`sm`: 44pt, `md`: 48pt, `lg`: 56pt), with the 44pt minimum touch target enforced.
  - **Card Footer Layout:** Normalized card action footer rows to `alignItems: 'center'`, with metadata (e.g., ETA) on the left (`flex: 1, minWidth: 140, wrap={true}`) and the main action on the right (`flexGrow: 1, flexBasis: 120, maxWidth: '100%'`), gracefully wrapping to full width on narrow viewports without vertical stretching.
  - **Automated Regression Tests:** Added unit tests in `Button.test.tsx` and `IconButton.test.tsx` verifying that controls inside parent rows with `alignItems: 'stretch'` and fixed heights maintain exact token-based dimensions.
- **Why:** Eliminates visual deformation of buttons and form controls across all flexbox parents while preserving touch target compliance.
- **Alternatives Considered:**
  - Requiring every parent container to set `alignItems: 'center'`: Fragile and error-prone; defensive defaults at the component root guarantee resilient layouts regardless of parent composition.

## ADR-025: Responsive Documentation Shell, Sidebar Navigation & Preview Viewport Switcher

- **Context:** Clamping the gallery web application to a fixed 390px mobile frame on wide screens impeded desktop documentation workflows, cramped API reference tables, and prevented developers from evaluating component responsiveness across tablets and desktop viewports.
- **Decision:**
  - **Responsive Breakpoint Scale:** Introduced the `compact: 600` breakpoint token in `@shani/tokens` representing the documentation shell threshold without using hardcoded magic numbers.
  - **Adaptive Documentation Shell (`_layout.tsx`):**
    - Below 600px (phones, Expo Go): Renders full width with native mobile navigation (`SafeAreaView`, no frame).
    - 600px and above: Renders a documentation layout featuring `DocsTopBar` (global branding, breadcrumbs, and Light/Dark/System theme switcher), `DocsSidebar` (grouped navigation across Foundations, Components, Demos, and Accessibility with active route highlighting), and a centered `maxWidth: 960` content canvas.
  - **Playground Viewport Switcher (`ComponentPage.tsx`):** Added a responsive viewport selector above interactive component previews with `Fill (100%)`, `Tablet (768)`, and `Phone (390)` presets (default: `Fill`), enabling developers to evaluate responsive wrapping on `Card`, `TextField`, `Timeline`, and `Button` live.
  - **Realistic Demo Screen Framing (`DemoContainer.tsx`):** On wide screens, the Shipment Tracking and Shipments List demo screens are framed inside a centered 390px phone container with a header toggle to view Full Width; on mobile devices they render full screen.
  - **Comfortable Typography at Scale:** Capped paragraph line length (`maxWidth: 720`) across documentation cards to prevent stretched text on high-resolution widescreen monitors.
- **Why:** Delivers an authentic documentation experience for desktop evaluators while preserving realistic handheld mobile views for logistics operators.
- **Alternatives Considered:**
  - Keeping a fixed phone frame across the entire web application: Unnecessarily constricted wide desktop displays and made multi-stop timeline steppers and API tables difficult to read.

## ADR-026: Button Height Token Enforcement & Inner Container Flex Isolation

- **Context:** In the Shipments list waybill card footer, the "Track Live" Button rendered at approximately 130px tall and square-looking next to the ETA when flex styling was applied.
- **Root Cause Identified:**
  1. `Button` applied caller-provided `style` to both the outer `Pressable` touch target and the inner `Animated.View` container.
  2. In React Native Web, `Pressable` defaults to `flexDirection: 'column'`. When `{ flexGrow: 1, flexBasis: 120 }` was passed to enable horizontal wrapping in the card row, the inner `Animated.View` interpreted `flexBasis: 120` along the column main axis, expanding its height to 120px (plus padding and border, yielding ~130px total height).
  3. `Button` only declared `minHeight`, leaving `height` and `maxHeight` unbounded against parent flex stretch or `flex: 1` wrappers.
- **Decision:**
  - **Style Partitioning:** In `Button` and `IconButton`, caller `style` is cleanly split: outer layout styles (`flexGrow`, `flexBasis`, `flexShrink`, `margin`, `position`, `alignSelf`) apply strictly to the outer `Pressable`, while visual styles (`backgroundColor`, `borderColor`, etc.) apply to the inner `Animated.View`.
  - **Height Token Enforcement:** Both `Pressable` and `Animated.View` strictly enforce `height`, `minHeight`, and `maxHeight` set to `sizeTokens.minHeight` (`sm`: 44pt, `md`: 48pt, `lg`: 56pt), ignoring any external height overrides.
  - **Automated Regression Suite:** Added unit tests in `Button.test.tsx` and `IconButton.test.tsx` verifying exact token heights when rendered inside `alignItems: 'stretch'` parent rows, `flex: 1` wrappers, and when supplied with `flexBasis` / `height` overrides.
- **Why:** Guarantees buttons and icon buttons maintain exact token heights across any parent layout structure without visual deformation.
- **Alternatives Considered:**
  - Applying styles only to the inner View: Leaves the outer Pressable touch area unstyled and unable to position within flex parents.

## ADR-027: True 1:1 Scale Spacing Token Visualization

- **Context:** In the Tokens Explorer (`/tokens`), spacing bars were scaled relative to the container width ($(\text{value} / 96) \times 100\%$), which made a small 4pt token render at approximately 58px wide, misrepresenting actual physical dimensions. Furthermore, `spacing[0]` showed a visible bar, and rows stretched across wide desktop viewports.
- **Decision:**
  - **1:1 True Scale Rendering:** Rendered spacing bars with `width: numValue` directly matching the token's pt/dp value. Fixed bar height to token `theme.spacing[4]` (16pt).
  - **Zero Spacing Marker:** Rendered `spacing[0]` with a hairline 1px indicator line and `"none (0pt)"` label rather than a colored bar.
  - **Aligned Layout & Max Width Cap:** Constrained the spacing card to `maxWidth: 720` on widescreen displays to prevent excessive stretching, and widened the label column to 140px fixed width for uniform bar alignment.
  - **Documentation Note:** Added subtitle note: `"Shown at 1:1 scale (1pt = 1 dp)"`.
- **Why:** Delivers an accurate physical reference for designers and engineers assessing mobile spacing values.

## ADR-028: Stack Wrap Interactive Playground & Concise Item Labeling

- **Context:** In the Box & Stack component playground, items rendered with long text (e.g. `"Parcel B (Standard)"`) which truncated with ellipsis (`"..."`) when oriented horizontally on narrow mobile screens, and the playground lacked a live toggle to demonstrate the component's `wrap` prop.
- **Decision:**
  - **Concise Item Labels:** Shortened playground child badges to clean concise identifiers (`"Parcel A"`, `"Parcel B"`, `"Parcel C"`), ensuring complete visibility without truncation across all screen sizes.
  - **Interactive Wrap Controller:** Added an interactive `Wrap` control (`On` / `Off`) to the playground, defaulting to enabled in horizontal mode to demonstrate multi-row wrapping without horizontal scrollbars.
  - **Unit Regression Coverage:** Added explicit tests in `Stack.test.tsx` verifying that `Stack`, `HStack`, and `VStack` propagate the `wrap` prop to `flexWrap: 'wrap'` / `'nowrap'`.
- **Why:** Delivers an unclipped, scrollbar-free demonstration of responsive layout primitives on mobile and desktop viewports.

## ADR-029: Compact Input Placeholder Length on Narrow Viewports

- **Context:** On the Shipments list demo screen, the search input placeholder was `"Search by tracking number, consignee, or hub..."`, which truncated with ellipsis (`"..."`) on 320px–390px mobile viewports alongside the search prefix icon.
- **Decision:**
  - **Concise Placeholder:** Shortened search placeholder to `"Search shipments"` across all screen widths.
  - **Context in Helper Text:** Retained detailed search scope explanation in the associated `helperText` (`Displaying X matching waybills`), maintaining complete clarity without text clipping.
- **Why:** Ensures clean, unclipped input rendering on compact mobile screens while preserving search context.

## ADR-030: Unified SegmentedOption & Filter Chip Component Pattern

- **Context:** Filter options (e.g. status chips on the Shipments demo screen) and component playground controls (alignment, variant, size toggles) rendered unselected items using ghost button variants (`bg="transparent"`, `borderWidth=0`). This rendered unselected options looking like unstyled plain text rather than interactive tappable controls, creating ambiguity for users and inconsistent control appearances across documentation pages.
- **Decision:**
  - **Shared `SegmentedOption` Component:** Created `apps/gallery/src/components/SegmentedOption.tsx` standardizing the toggle button and filter chip pattern across the entire gallery app:
    - **Unselected State:** Explicit `borderWidth: thin` with `borderColor: theme.colors.border.default` on `backgroundColor: theme.colors.bg.surface`, rendering a clean, visible tappable outline with `text.primary` font color.
    - **Selected State:** Filled brand style with `backgroundColor: theme.colors.action.primary.default` and `color: theme.colors.action.primary.text`.
    - **Uniform Geometry:** Standardized `minHeight: 36` (with `hitSlop` to guarantee 44pt touch targets), `borderRadius: theme.radius.md`, and tokenized padding.
    - **Accessibility States:** Declares `accessibilityRole="button"` and `accessibilityState={{ selected }}` for assistive screen reader navigation.
  - **Universal Application:** Applied `SegmentedOption` to all 12 component playground control bars, the Shipments list status filter chips, the Tokens Explorer category selector, the ComponentPage viewport switcher, and the GalleryHeader/DocsTopBar theme switchers.
- **Why:** Eliminates the "plain text" ambiguity on unselected options, standardizing affordances and ensuring 100% WCAG contrast across Light and Dark themes.

## ADR-031: AI Rules Architecture & Multi-Agent Synchronization (Step 5.1)

- **Context:** Large Language Models and AI coding assistants do not inherently understand the internal architectural constraints of `@shani/ui`, frequently hallucinating raw CSS styles, unconstrained pixel margins, arbitrary hex colors, and unstyled React Native primitives (`<Text>`, `<TextInput>`, `<Pressable>`).
- **Decision:**
  - **Single Source of Truth (`docs/ai/rules.md`):** Established a comprehensive rules document detailing:
    - What Shani DS is and its 3-tier token architecture.
    - Explicit whitelist of allowed imports (`@shani/ui`, `@shani/tokens`, `Icon` component).
    - Strict prohibitions against raw hex colors, raw numbers for spacing/size/radius, and raw React Native text/inputs/buttons.
    - Component prop scales (`spacing="1"` through `'16'`, size tiers `'sm'`/`'md'`/`'lg'`).
    - Accessibility mandates (44pt touch targets, mandatory `accessibilityLabel` on `IconButton`).
    - Screen layout patterns, typography hierarchy rules (single display hero, section titles use title), and card action placement rules (top-right utility icons, bottom-right main action).
    - Typechecked Do/Don't code examples.
  - **Automated Synchronization Tooling (`scripts/sync-rules.ts`):** Implemented `pnpm sync:rules` which replicates the canonical rules file identically to the root of the repository for every major coding assistant: `GEMINI.md`, `AGENTS.md`, `CLAUDE.md`, and `.cursorrules`.
  - **Continuous Drift Detection:** Integrated `pnpm rules:check` into the test suite via `scripts/rules.test.ts`, causing CI to fail if any assistant rules file drifts from `docs/ai/rules.md`.
- **Why:** Guarantees that AI coding assistants generate compliant, accessible, token-bound React Native code on the first prompt across any development environment.






