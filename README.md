# Shani Design System

A React Native design system engineered for logistics mobile workflows, featuring a 3-tier token architecture, headless accessibility primitives, and an AI-assisted development layer.

[Live Demo Placeholder](https://shani-ds.vercel.app)

<!-- Screenshot: Responsive Documentation Shell & Component Playground -->
<!-- Screenshot: Logistics Shipment Tracking Demo Screen -->

---

## What's Inside

- `packages/tokens`: 3-tier W3C DTCG design tokens, token compiler, and automated WCAG 2.1 AA contrast audit.
- `packages/ui`: 14 accessible React Native components built with zero-runtime styling and Reanimated micro-interactions.
- `apps/gallery`: Expo Router showcase web app featuring a responsive desktop shell with sidebar, phone demo framing, and interactive component playgrounds.
- `AI layer`: Machine-readable agent guidelines (`GEMINI.md`, `AGENTS.md`, `CLAUDE.md`), `components.json` metadata manifest, and screen validation tools.

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Run gallery web app (responsive desktop shell with sidebar)
pnpm dev --web

# 3. Run on mobile device (iOS / Android / Expo Go)
pnpm dev
```

---

## 3-Tier Token Architecture

1. **Primitive Tokens:** Raw design values (color hex codes, 4pt spacing scale, typographic sizes) without semantic context.
2. **Semantic Tokens:** Intent-based aliases (`text.primary`, `bg.surface`, `action.primary.default`) resolved for light and dark themes.
3. **Component Tokens:** Element-scoped bindings (`button.md.height`, `card.padding`) mapping semantics to component anatomy.
- Compiled by `scripts/build-tokens.ts` adhering to W3C Design Token Community Group (DTCG) specifications.
- White-label theming is supported through the runtime `createTheme()` factory.

---

## Components

The `@shani/ui` package exports 14 core components:

- **Layout & Structure:** `Box`, `Stack` (`VStack`, `HStack`), `Divider`
- **Typography & Iconography:** `Text`, `Icon` (Lucide React Native)
- **Actions:** `Button`, `IconButton`
- **Forms & Inputs:** `TextField`, `Checkbox`, `Switch`
- **Display & Status:** `Card`, `Badge`, `Skeleton`, `Timeline`

---

## Accessibility Approach

- **Mathematical Contrast Audit:** Automated WCAG 2.1 AA checks evaluate foreground and background pairs across light and dark palettes.
- **Minimum Touch Targets:** Interactive controls (`Button`, `IconButton`, `Checkbox`, `Switch`) provide a minimum 44×44pt touchable area.
- **Vestibular Safety:** Motion-sensitive components and animations check `useReducedMotion()` to respect system accessibility preferences.
- **Compile-Time Screen-Reader Labels:** `IconButton` requires `accessibilityLabel: string` at the TypeScript level to prevent unlabelled icon actions.

---

## AI-Assisted Development Layer

- **Agent Rule Files:** `GEMINI.md`, `AGENTS.md`, and `CLAUDE.md` define system constraints, token usage boundaries, and component composition rules.
- **Component Manifest (`components.json`):** Machine-readable JSON metadata describing component interfaces, prop requirements, tokens, and accessibility contracts.
- **Screen Validation (`validate-screen`):** AST and regex validation script checking UI screens for token violations, raw colors, and touch target rules.
- **AI Demo Transformations:** Before-and-after conversion examples illustrating automated refactoring of raw React Native primitives into design system components.
- **Figma Integration:** Figma MCP and Code Connect architectural mapping specifications are documented for design-to-code synchronization (documented, not currently live-connected).

---

## Quality Commands

```bash
# Typecheck root, packages, and apps
pnpm typecheck

# ESLint code quality check
pnpm lint

# Unit test suite (23 suites, 137 tests passing)
pnpm test

# WCAG 2.1 AA contrast audit (all 62 checks passing across Light and Dark themes)
pnpm contrast

# Token drift check (enforces compiled outputs match token source files)
pnpm tokens:drift

# Validate gallery component documentation snippets against TypeScript compiler (12/12 passing)
pnpm snippets:check

# Validate components.json manifest against exported components (AI layer)
pnpm manifest:check
```

---

## Vercel Deployment

The web gallery is deployed using the following configuration (`vercel.json`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm --filter @shani/gallery build --output-dir dist",
  "outputDirectory": "apps/gallery/dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Roadmap

The following features and components are intentionally deferred from the current scope:

- **Backlog Components:** `Radio` / `RadioGroup`, `Chip` / `FilterChip`, `Toast`, `BottomSheet`.
- **Tooling & Infrastructure:** Live bi-directional Figma sync integration and public npm registry distribution.
