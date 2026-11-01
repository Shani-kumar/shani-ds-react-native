# Shani Design System

A React Native design system for logistics mobile applications, built with a 3-tier token architecture, headless accessibility primitives, and zero-runtime styling.

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
│   ├── DECISIONS.md     # Architecture Decision Records (ADR-001 through ADR-030)
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

# Jest unit test suite (28 suites, 161 tests)
pnpm test

# WCAG 2.1 AA contrast audit (all 62 checks pass across Light and Dark themes)
pnpm contrast

# Token drift check (enforces compiled outputs match token sources)
pnpm tokens:drift

# Validate all component code snippets against TypeScript (19/19 pass)
pnpm snippets:check

# Synchronize and verify AI rules across agents
pnpm rules:check

# Verify machine-readable component manifest against code
pnpm manifest:check

# AST validation of screens against Shani DS rules and component manifest
pnpm validate:screen <file or folder>
```

---

## Using Shani DS in an App Repo

To use `@shani/ui` in a standalone React Native or Expo application:

### 1. Installation
Install `@shani/ui` (and required peer dependencies):
```bash
npm install @shani/ui lucide-react-native react-native-reanimated react-native-svg
```

### 2. Wrap Root in ThemeProvider
```tsx
import React from 'react';
import { ThemeProvider, Box, Text, Button } from '@shani/ui';

export default function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Box flex={1} bg="canvas" p="4" justify="center" align="center">
        <Text variant="heading">Hello Shani DS</Text>
        <Button variant="primary" size="md" onPress={() => alert('Confirmed')}>
          Get Started
        </Button>
      </Box>
    </ThemeProvider>
  );
}
```

### 3. Initialize AI Agent Context
Run the Shani DS initialization CLI inside your application repository:
```bash
npx shani-ds init-ai
```
This automatically configures `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` pointing to the installed `node_modules/@shani/ui/components.json` and canonical guidelines without overwriting your existing instructions.

### 4. Validate Screens Locally and in CI
Check any screen file or directory against Shani DS design tokens, prohibited imports, and valid component schemas:
```bash
# Validate a single screen
npx shani-ds validate src/screens/PickupScreen.tsx

# Validate all screens in a directory
npx shani-ds validate src/screens/
```
The command parses the TypeScript AST and exits with code 1 if raw hex colors, raw pixel spacings, or forbidden primitives are found.

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

## Roadmap

Next:
- Form controls & chips: `Radio` / `RadioGroup`, `Chip` / `FilterChip`
- Overlays & feedback: `Toast`, `BottomSheet`
- Distribution: npm registry publishing and bi-directional Figma sync
