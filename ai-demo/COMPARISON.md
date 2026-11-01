# AI Screen Generation Experiment — Comparative Analysis

This scorecard records the empirical benchmark comparing **Run 1: Without Context** and **Run 2: With Shani DS Context** for the Shipment Pickup Scheduling screen based on `ai-demo/figma-input.png`.

---

## 1. Executive Summary

| Evaluation Metric | Run 1: Without Context (`../consumer-without-context`) | Run 2: With Context (`../consumer-with-context`) | Impact / Delta |
| :--- | :--- | :--- | :--- |
| **Model Tested** | *(e.g. Gemini 1.5 Pro / Claude 3.5 Sonnet)* | *(Same model & version)* | Identical test baseline |
| **Initial Generation Status** | *[Compiles / Crashes]* | *[Compiles / Crashes]* | — |
| **Refinement Prompts Needed** | *[Count of prompts until rendering]* | *[Count of prompts until rendering]* | — |
| **Total Time to Working Screen**| *[e.g. 28 minutes]* | *[e.g. 3 minutes]* | — |
| **AST Validator Status** | ❌ FAILED (Exit Code 1) | ✅ PASSED (Exit Code 0) | Automated compliance |
| **Total AST Violations** | *[Count of violations]* | *[Count of violations]* | — |
| **Forbidden RN Imports** | *[Count: View, Text, TextInput, etc.]* | 0 | Zero raw primitives |
| **Raw Hex / RGBA Colors** | *[Count of raw color strings]* | 0 | Strict semantic tokens |
| **Raw Spacing / Size Numbers** | *[Count of raw layout numbers]* | 0 | Strict 4pt token adherence |
| **Unknown Props / Hallucinations**| *[Count of invalid props/variants]* | 0 | Validated vs components.json |
| **44×44pt Touch Targets** | *[Pass / Fail count]* | All ≥ 44pt | WCAG 2.1 AA Target Size |
| **Screen Reader Labels** | *[Missing count / Present]* | Mandatory on IconButton | WCAG 2.1 AA Name/Role |
| **Light / Dark Mode Adaptation**| *[Hardcoded light / Dynamic]* | Dynamic ThemeProvider tokens | Theme resilience |

---

## 2. Design System Adherence

### What Matched the Design System
#### Run 1 (Without Context):
- *[Document any parts where the unconstrained AI correctly guessed or used components, e.g. imported basic Button]*

#### Run 2 (With Context):
- 100% of UI primitives imported from `@shani/ui` (`Box`, `VStack`, `HStack`, `Text`, `Button`, `TextField`, `Card`, `Badge`).
- Layout spacing uses strictly the 4pt token scale (`spacing="4"`, `p="6"`).
- Component variants and sizes conform to `@shani/ui/components.json`.

---

### What Did NOT Match the Design System
#### Run 1 (Without Context):
- *[Document non-compliant patterns, e.g. raw `<TextInput>`, `<Text>`, `#1D4ED8` hex colors, `padding: 15`]*

#### Run 2 (With Context):
- *[Document any edge case or imperfection observed in the with-context run]*

---

## 3. Validator Results (`npx shani-ds validate PickupScreen.tsx`)

### Run 1: Without Context
- **Total Violations:** *[Insert total count]*
- **Violation Breakdown:**
  - `forbidden-import`: *[Count & details]*
  - `raw-hex-color`: *[Count & details]*
  - `raw-numeric-style`: *[Count & details]*
  - `unknown-prop` / `invalid-prop-value`: *[Count & details]*

```text
[Paste terminal validation output from ai-demo/without-context/validation-report.txt here]
```

---

### Run 2: With Shani DS Context
- **Total Violations:** 0
- **Validator Output:**
```text
🛡️  Validating screen code against Shani DS rules: PickupScreen.tsx

  Using manifest: node_modules/@shani/ui/components.json

  ✓ PickupScreen.tsx (0 violations)

✅ Validation passed: 1 file(s) cleanly adhere to Shani DS rules.
```

---

## 4. Ergonomics & Accessibility

### A. Touch Targets (WCAG 2.1 AA Target Size)
- **Without Context:** *[Did the AI produce small buttons, e.g. height 32px or unpadded icons?]*
- **With Context:** Minimum 44×44pt touch area enforced across all interactive elements (`Button`, `IconButton`).

### B. Screen Reader Labels
- **Without Context:** *[Did the AI omit accessibilityLabel on icon-only triggers?]*
- **With Context:** Compile-time and AST-enforced `accessibilityLabel` on all `IconButton` elements.

### C. Light / Dark Mode Adaptation
- **Without Context:** *[Did the AI hardcode white/gray backgrounds that break in dark mode?]*
- **With Context:** All colors consume `theme.colors.*` (`bg.canvas`, `bg.surface`, `text.primary`), dynamically responding to theme switches.

---

## 5. Developer Velocity & Refinement Overhead

| Workflow Stage | Run 1: Without Context | Run 2: With Context |
| :--- | :--- | :--- |
| **First-Pass Generation** | *[e.g. 30 seconds]* | *[e.g. 30 seconds]* |
| **Compilation Fixes Needed** | *[e.g. 3 prompts to resolve broken styles/types]* | *[e.g. 0 prompts]* |
| **Manual Refactoring Time** | *[e.g. 25 minutes to convert styles to tokens]* | *[0 minutes]* |
| **Total Developer Time** | *[e.g. ~30 minutes]* | *[e.g. ~2 minutes]* |

---

## 6. Honest Notes & Surprises

*Record objective observations, including any areas where the without-context run did unexpectedly well or where the with-context run had subtle friction:*

- **Where Run 1 (Without Context) Did Better Than Expected:**
  - *[e.g., Did it infer an interesting layout arrangement? Did it format a date picker nicely?]*
- **Where Run 2 (With Context) Required Attention:**
  - *[e.g., Did it choose variant="outlined" over variant="elevated" on Card?]*
- **General Reflections:**
  - *[Takeaways on developer experience and AI alignment]*
