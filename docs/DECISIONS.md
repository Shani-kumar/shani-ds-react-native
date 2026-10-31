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


