# Shani DS Architecture & Component Layering

Shani Design System follows a strict 3-tier layering model to keep foundation primitives reusable while scaling logistics applications.

```mermaid
flowchart TD
  subgraph L1["Layer 1: Design System Foundation (@shani/ui, @shani/tokens)"]
    T["Tokens: 3-Tier W3C DTCG"] --> P["Primitives: Headless Hooks"]
    P --> C["Components: Box, Button, TextField, Chip, etc."]
    AI["AI Context: components.json, AGENTS.md, AST Validator"]
  end
  subgraph L2["Layer 2: Shared Domain Library (Optional Patterns)"]
    W["WaybillCard, CourierTimeline, CargoStepper"]
  end
  subgraph L3["Layer 3: App-Specific Screens (Consumer Apps & Gallery)"]
    S["ShipmentsFleetScreen, PickupSchedulerScreen, ScannerView"]
  end
  L1 --> L2 --> L3
  L1 -.->|AI Context & Rules| L3
```

### The Three Architectural Layers

1. **Layer 1 — Design System Foundation (`@shani/tokens`, `@shani/ui`):** Zero domain logic. Provides W3C DTCG design tokens, headless accessibility primitives (`useSelection`, `useCounter`, `usePressable`), and core UI components. Ships packaged AI context (`components.json`, rules, validator CLI) directly inside the npm package.
2. **Layer 2 — Shared Domain Library (Optional Domain Composites):** Reusable logistics patterns combining Layer 1 primitives with supply-chain entities (e.g. Waybill cards, route summaries).
3. **Layer 3 — App-Specific Code (Mobile Screens & Features):** End-user applications (Driver App, Warehouse Scanner, Gallery Demos). Built exclusively by composing Layer 1/2 components.

### Placement Rule
If a component contains domain concepts (waybills, manifests, drivers), it belongs in Layer 2 or 3. If it is generic and domain-agnostic with headless accessibility contracts, it belongs in Layer 1. The demo screens in this repository (`apps/gallery/app/demos/`) serve as production Layer 3 references constructed entirely from Layer 1 foundation components.
