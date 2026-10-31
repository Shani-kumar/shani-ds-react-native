# Shani DS Roadmap

This document outlines the scheduled development phases, completed components, and queued component backlog for the Shani Design System.

## Phase 3: Component Backlog (Upcoming Next)

The following components from Phase 3 groups C, D, and E were intentionally trimmed to prioritize high-value core flows (TextField, Checkbox, Switch, Card, Badge, Skeleton, Timeline) and are scheduled next:

### Form Controls (Group C extension)

- **`Radio` / `RadioGroup`:** Single-select option group for shipment priority and carrier selection. Built on `useToggle` with `role="radio"`.
- **`SegmentedControl`:** Pill toggle for switching views (e.g., Map vs List mode on operations dashboard).

### Interactive Filters & Chips

- **`Chip` / `FilterChip`:** Compact interactive chips for filtering shipment statuses (e.g. "Out for Delivery", "Delayed", "Customs Hold").

### User Representation & Progress

- **`Avatar`:** User initials and profile image representation for drivers, dispatchers, and customer service agents.
- **`Spinner`:** Standalone tokenized loading indicator supporting multiple sizes (`sm`, `md`, `lg`) and theme color mappings.
- **`ProgressBar`:** Determinate progress indicator for battery level, vehicle capacity, or batch order completion.

---

## Phase 4: AI-Readiness & Component Documentation (Scheduled)

- Comprehensive `components.json` metadata manifest for AI agents.
- Static AST/regex verification CLI (`pnpm validate:screen`) checking for token compliance and 44pt touch targets.
- Figma Code Connect integration mappings.

---

## Phase 5: Production Gallery App (Scheduled)

- Cross-platform Expo Router application (iOS, Android, Web).
- Interactive component playground with theme mode toggling and brand switcher.
- Real-world logistics demo screens:
  - Customer Shipment Tracker
  - Driver Run-Sheet and Delivery Confirmation
  - Warehouse Inventory Scanner
