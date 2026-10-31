# Shani Design System (Shani DS)

A production-grade, multi-brand React Native design system engineered for logistics companies operating 15+ mobile applications (customer tracking, courier run-sheets, and warehouse scanner apps).

Built with a **W3C DTCG 3-tier token architecture**, zero-runtime styling engine, headless accessibility primitives, and native UI-thread Reanimated micro-interactions.

---

## Workspace Architecture

```
shani-ds/
├── packages/
│   ├── tokens/          # @shani/tokens: 3-tier tokens, compiler, WCAG AA contrast audit
│   └── ui/              # @shani/ui: Accessible, zero-runtime React Native components
├── apps/
│   └── gallery/         # @shani/gallery: Expo Router showcase app (Web, iOS, Android)
├── docs/
│   ├── DECISIONS.md     # Architecture Decision Records (ADR-001 through ADR-014)
│   ├── LEARNING.md      # Plain-English technical explanations & interview guide
│   └── ROADMAP.md       # Component backlog and upcoming release milestones
└── scripts/
    ├── build-tokens.ts  # Zero-dependency token compiler with drift detection
    └── contrast.ts      # Automated WCAG 2.1 AA mathematical contrast audit
```

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the Interactive Gallery App

#### Run on Web (Browser)
```bash
pnpm dev --web
```
> Wide screens (desktop) automatically display a sleek, responsive mobile phone frame mockup. Mobile browsers expand to full viewport width.

#### Run on Mobile (iOS / Android / Expo Go)
```bash
pnpm dev
```

---

## Quality Gates & Verification

Every phase and commit is verified against five strict quality gates:

```bash
# 1. Typecheck all workspaces (root, tokens, ui, gallery)
pnpm typecheck

# 2. ESLint code quality & formatting check
pnpm lint

# 3. Jest unit test suite (22 suites, 121 tests)
pnpm test

# 4. WCAG 2.1 AA automated contrast audit (all 58 pairs pass ≥ 4.5:1 / ≥ 3.0:1)
pnpm contrast

# 5. Token drift prevention check
pnpm tokens:drift
```

---

## Production Build & Vercel Deployment

### Build Tokens & Packages
```bash
pnpm build
```

### Export Standalone Web Bundle
```bash
pnpm --filter @shani/gallery build --output-dir dist
```

### Vercel Deployment
The repository includes a ready-to-deploy [`vercel.json`](./vercel.json) configuration:
```json
{
  "buildCommand": "pnpm --filter @shani/gallery build --output-dir dist",
  "outputDirectory": "apps/gallery/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Showcase Features in `apps/gallery`

1. **Multi-Tenant Theming & Mode Switching:**
   - Real-time switching between `light`, `dark`, and `system` modes.
   - Real-time tenant brand switching between **Shani Core** and **Apex Fleet Partner Theme** (built via `createTheme()` with zero raw hex codes).
2. **Tokens Explorer (`/tokens`):**
   - Live visualizers for primitive and semantic colors, 4pt spacing scale, typography scales, border radius, elevation/shadows, and spring physics.
3. **Accessibility Audit Report (`/accessibility`):**
   - Live report showing all 58 contrast checks across Light and Dark themes with pass/fail ratios and WCAG criteria breakdown.
4. **12 Interactive Component Pages (`/components/*`):**
   - Each page features an interactive playground, all-states matrix, props table, do/don't guidelines, accessibility notes, and copy-paste code snippets.
5. **Real-World Logistics Demos:**
   - **Shipment Tracking (`/demos/tracking`):** Live waybill status, ETA card, vertical milestone Timeline stepper, and cargo consignment details.
   - **Shipments Fleet List (`/demos/shipments`):** Fast search input, status filter chips, interactive Skeleton loading states, and fleet parcel cards.

---

## Core Architectural Guarantees

- **Zero Magic Numbers:** Every spacing, margin, padding, border radius, and touch target value is bound to tokens.
- **Zero Raw Hex Colors:** All colors flow through semantic and component token aliases.
- **WCAG 2.5.5 Touch Targets:** All interactive action buttons, switches, checkboxes, and icon buttons strictly enforce a minimum 44x44pt touch area for operators with industrial work gloves.
- **Vestibular Safety:** Micro-interactions automatically honor `useReducedMotion()`.
- **Compile-Time Accessibility:** `IconButton` strictly mandates `accessibilityLabel: string` in TypeScript to prevent unlabeled icon buttons from ever compiling.

