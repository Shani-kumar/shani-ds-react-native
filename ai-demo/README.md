# Shani Design System — AI Screen Generation Experiment

This directory documents a controlled experiment evaluating how AI coding assistants perform when building mobile logistics screens **with** vs **without** the Shani Design System AI layer.

---

## 1. The Experiment

AI coding assistants (Claude, Gemini, Cursor, Copilot) are trained on vast corpora of generic web and React Native code. Left unconstrained, they typically:
- Invent arbitrary hex codes (`#1D4ED8`, `#F3F4F6`, `#333333`).
- Use magic pixel values for spacing and sizing (`style={{ padding: 15, marginTop: 12, borderRadius: 8 }}`).
- Import raw React Native primitives (`<Text>`, `<TextInput>`, `<TouchableOpacity>`, `<Button>`).
- Ignore minimum touch target requirements (< 44pt) and omit mandatory accessibility attributes.
- Fail to follow screen-level visual and action hierarchies.

In Phase 5, we engineered a dedicated **AI Context Layer**:
1. **Multi-Agent Rules (`GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`):** Canonical rules contract defining allowed imports, prohibited patterns, scale constraints, accessibility requirements, and Do/Don't patterns.
2. **Component Manifest (`packages/ui/components.json`):** Machine-readable schema generated directly from TypeScript source code containing exact prop types, literal unions, defaults, dos/donts, and compiling examples.
3. **Screen Anatomy & Guidelines (`docs/ai/guidelines.md`):** Concrete screen architecture, typographic hierarchy rules, and card action placement patterns.
4. **AST Screen Validator (`scripts/validate-screen.ts`):** Automated TypeScript Compiler API auditor (`pnpm validate:screen <file>`) that catches raw hex colors, magic numbers, forbidden RN primitives, and hallucinated components/props with zero false positives.

---

## 2. The Test Scenario

- **Screen to Build:** **Shipment Pickup Scheduling Screen**
- **Domain:** Mobile freight logistics / courier pickup operation.
- **Key Features:**
  - Pickup location details (warehouse address, dock number, contact person).
  - Scheduling form (pickup date, time window, vehicle type selector, special instructions).
  - Cargo summary card (weight, pallet count, hazardous material toggle).
  - Accessible action footer with primary confirmation and secondary cancellation.
- **Evaluation Criteria:**
  - Design system compliance (tokens used vs raw styles).
  - Zero forbidden React Native imports.
  - Zero hallucinated components or props.
  - Full WCAG 2.1 AA accessibility (44×44pt touch targets, mandatory labels).
  - TypeScript AST validation (`pnpm validate:screen`).
  - First-prompt accuracy (zero or minimal refinement cycles).

---

## 3. Directory Structure

```
ai-demo/
├── README.md               # This overview document
├── PROMPTS.md              # Exact copy-paste prompts for both runs & test instructions
├── COMPARISON.md           # Evaluation scorecard and comparative benchmark
├── without-context/        # Baseline: run without DS context
│   └── README.md           # Instructions on what artifacts to save
└── with-context/           # Experiment: run with Shani DS context
    └── README.md           # Instructions on what artifacts to save
```

---

## 4. Execution Workflow

1. Read [`PROMPTS.md`](./PROMPTS.md) for the exact prompt text.
2. **Run 1 (Without Context):**
   - Provide Prompt 1 to an LLM in an unconfigured environment (no rules file, no `components.json`).
   - Save the prompt, generated code, screenshot, and `validate:screen` output in [`without-context/`](./without-context/).
3. **Run 2 (With Context):**
   - Provide Prompt 2 to an LLM inside this repository (or supply `GEMINI.md`/`AGENTS.md` and `packages/ui/components.json`).
   - Save the prompt, generated code, screenshot, and `validate:screen` output in [`with-context/`](./with-context/).
4. Record metrics and observations in [`COMPARISON.md`](./COMPARISON.md).
