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
