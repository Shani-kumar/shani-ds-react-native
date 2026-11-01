# Shani Design System

A React Native design system for logistics mobile applications, engineered with W3C DTCG design tokens, headless accessibility primitives, zero-runtime styling, and built-in AI agent integration.

[Live Demo Placeholder](https://shani-ds.vercel.app) • [Architecture Guide](docs/ARCHITECTURE.md) • [Empirical AI Demo](ai-demo/README.md)

Screenshots: coming soon

---

## What's Inside

- **`@shani/tokens`**: 3-tier W3C DTCG token architecture with light/dark semantic mapping and automated WCAG 2.1 AA audits.
- **`@shani/ui`**: 22 production-grade React Native components and 6 headless behavioral hooks.
- **`apps/gallery`**: Responsive Expo Router gallery featuring component playgrounds, token inspector, and live shipment fleet run-sheet demos.
- **Embedded AI Context**: Packaged `components.json`, canonical `AGENTS.md` guidelines, and an AST validator CLI (`shani-ds`).

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start gallery web application
pnpm build:web && npx serve apps/gallery/dist -s

# Run mobile development server
pnpm dev:gallery
```

---

## 3-Tier Token Architecture

1. **Primitive Tokens (Tier 1):** Raw palette constants, 4pt spacing scale, radius, and timing scales.
2. **Semantic Tokens (Tier 2):** Contextual aliases resolving intent (`bg.surface`, `text.primary`, `border.focus`) across light and dark modes.
3. **Component Tokens (Tier 3):** Scoped component overrides (`button.primary.bg`, `chip.selected.bg`) enabling targeted theming without global side effects.

---

## Components & Primitives (22 Components, 6 Hooks)

- **Foundation & Layout:** `Box`, `Stack`, `HStack`, `VStack`, `Divider`, `Text`, `Icon`
- **Actions & Selection:** `Button`, `IconButton`, `Chip`, `ChipGroup`
- **Forms & Inputs:** `TextField`, `Checkbox`, `Switch`, `QuantityStepper`
- **Display & Feedback:** `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Badge`, `Skeleton`, `Timeline`
- **Headless Hooks:** `useSelection`, `useCounter`, `usePressable`, `useToggle`, `useTextField`, `useDisclosure`

---

## Accessibility Approach

- **44×44pt Minimum Touch Target:** Built into `Button`, `IconButton`, `Chip`, and `QuantityStepper`.
- **Screen Reader Support:** Compile-time `accessibilityLabel` enforcement on icon controls; ARIA `radio`, `checkbox`, `adjustable`, and `list` role mapping.
- **Dynamic Type & Motion:** Scales fonts gracefully with maximum font size multipliers; respects system reduced-motion preferences via `useReducedMotion()`.
- **WCAG 2.1 AA Contrast:** Automated mathematical verification of 66 color pairs across light and dark themes.

---

## AI Layer & Developer Tooling

- **Packaged AI Metadata:** Ships `components.json` schemas and canonical rules inside `@shani/ui` for external repositories.
- **One-Command Setup:** `npx shani-ds init-ai` provisions `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `.cursorrules` in consumer apps without overwriting existing instructions.
- **AST Screen Validator:** `npx shani-ds validate <path>` parses the TypeScript AST to block raw hex colors, magic numbers, and forbidden primitives before commit.
- **Design Handoff:** Figma MCP integration and Code Connect workflows are documented for agent-driven component mapping.

---

## Verification & Quality Gates

```bash
pnpm typecheck        # 0 TypeScript diagnostic errors
pnpm lint             # 0 ESLint warnings or errors
pnpm test             # 33 Jest test suites, 184 tests passing
pnpm contrast         # 66 WCAG 2.1 AA mathematical checks passing
pnpm tokens:drift     # 0 token compiler drift
pnpm snippets:check   # 22/22 component manifest code snippets typechecked
pnpm rules:check      # 10 rules files synchronized with docs/ai
pnpm manifest:check   # 22 components verified in sync with source
pnpm validate:screen  # AST design system screen validation
```

---

## Next on Roadmap

- **Form Controls:** `Radio` and `RadioGroup` primitives
- **Overlays & Feedback:** `Toast` notification queue and modal `BottomSheet`
- **Distribution:** Public npm registry publishing and bi-directional Figma sync
