# Shani Design System

A React Native design system for logistics mobile applications, built with a 3-tier token architecture, headless accessibility primitives, and zero-runtime styling.

Live demo: [Add link here](https://)

Deployed on Vercel (config in `vercel.json`).

<!-- Screenshot 1: Responsive Documentation Shell & Sidebar Navigation -->
<!-- Screenshot 2: Component Playground with Phone / Tablet / Fill Switcher -->
<!-- Screenshot 3: Tokens Explorer & Live Motion Demos -->
<!-- Screenshot 4: WCAG 2.1 AA Accessibility Contrast Report -->
<!-- Screenshot 5: Logistics Shipment Tracking Demo Screen -->

---

## Workspace Structure

```
shani-ds/
├── packages/
│   ├── tokens/          # 3-tier tokens, compiler, WCAG AA contrast audit
│   └── ui/              # Accessible React Native components
├── apps/
│   └── gallery/         # Expo Router showcase web and mobile app
├── docs/
│   ├── DECISIONS.md     # Architecture Decision Records (ADR-001 through ADR-025)
│   ├── LEARNING.md      # Technical explanations and architecture notes
│   └── ROADMAP.md       # Component backlog and release milestones
└── scripts/
    ├── build-tokens.ts   # Token compiler with drift detection
    ├── check-snippets.ts # Documentation code snippet typecheck
    └── contrast.ts       # Automated WCAG 2.1 AA contrast audit
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Run gallery web app
pnpm dev --web

# Run on mobile device (iOS / Android / Expo Go)
pnpm dev
```

---

## Quality Gates

Verified against automated checks across the monorepo:

```bash
# Typecheck all workspaces (root, tokens, ui, gallery)
pnpm typecheck

# ESLint code quality check
pnpm lint

# Jest unit test suite (23 suites, 137 tests)
pnpm test

# WCAG 2.1 AA contrast audit (all 62 checks pass across Light and Dark themes)
pnpm contrast

# Token drift check (enforces compiled outputs match token sources)
pnpm tokens:drift

# Validate gallery component code snippets against TypeScript (12/12 pass)
pnpm snippets:check
```

---

## Gallery Features

The gallery (`apps/gallery`) is responsive: full-width on mobile viewports, and a sidebar documentation layout on wide screens with a Phone / Tablet / Fill preview switcher.

1. **Theme Switcher:** Seamless switching between Light, Dark, and System modes. `createTheme()` supports white-label theming.
2. **Tokens Explorer (`/tokens`):** Visualizes color palettes, spacing, typography scales, border radius, elevation, and live spring motion demos.
3. **Accessibility Report (`/accessibility`):** Live report showing all 62 mathematical contrast checks across Light and Dark themes with WCAG ratios.
4. **12 Interactive Component Pages (`/components/*`):** Playgrounds with a Phone (390) / Tablet (768) / Fill viewport switcher, all-states matrices, props API tables, and type-checked code snippets.
5. **Logistics Demo Screens (`/demos/*`):** Realistic tracking and fleet shipment list flows demonstrating composed components in production layouts.

---

## Architecture & Design Rules

- **Design Tokens:** 3-tier token architecture (primitive, semantic, component) compiled from W3C DTCG sources. Token drift is prevented by `pnpm tokens:drift`.
- **Styling Rules:** Component styles use tokens rather than hardcoded hex values or arbitrary numbers.
- **Touch Targets:** Interactive action controls (`Button`, `IconButton`, `Checkbox`, `Switch`) provide a 44x44pt minimum touch area.
- **Screen Reader Labels:** `IconButton` requires `accessibilityLabel: string` at compile time.
- **Reduced Motion:** Animated components respect system accessibility preferences via `useReducedMotion()`.

---

## AI Layer

<!-- Coming in Phase 5: Agent guidelines (GEMINI.md, AGENTS.md, CLAUDE.md), components.json metadata manifest, screen validation tooling, and Figma Code Connect mappings. -->

The AI layer is scheduled for Phase 5.

---

## Roadmap

The following components and integrations are intentionally deferred:
- Form controls & chips: `Radio` / `RadioGroup`, `Chip` / `FilterChip`
- Overlays & feedback: `Toast`, `BottomSheet`
- Distribution: npm registry publishing and bi-directional Figma sync
