# Run 2: With Context (Shani Design System Layer)

This folder stores the artifacts from running the prompt **with** the full Shani Design System AI layer active.

---

## 1. Environment Setup

- Run the AI assistant inside this repository or provide it with:
  - `GEMINI.md`, `CLAUDE.md`, or `AGENTS.md` (canonical rules contract).
  - `packages/ui/components.json` (TypeScript AST component manifest).
  - Guidelines from `docs/ai/guidelines.md`.
- Use the **With Context** prompt specified in [`../PROMPTS.md`](../PROMPTS.md).

---

## 2. Artifacts to Save Here

When the AI generates the screen, save the following files into this directory:

| Filename | Description |
| :--- | :--- |
| `prompt.md` | The exact prompt submitted to the assistant. |
| `PickupScreen.tsx` | The code output produced by the AI adhering to `@shani/ui`. |
| `screenshot.png` | Screenshot of the screen running on mobile or web. |
| `validation-report.txt` | Terminal output from running `pnpm validate:screen ai-demo/with-context/PickupScreen.tsx`. |

---

## 3. How to Validate & Test

### Run AST Validation
```bash
pnpm validate:screen ai-demo/with-context/PickupScreen.tsx > ai-demo/with-context/validation-report.txt 2>&1
```

*(Expected output: `0 violations`, exit code 0).*

### Preview in Gallery
Follow the testing instructions in [`../PROMPTS.md`](../PROMPTS.md) to preview `PickupScreen.tsx` directly inside the Expo gallery app at `apps/gallery/app/demos/pickup.tsx`.

---

## 4. Expected Quality Standards

With the AI layer active, the generated screen should demonstrate:
- **100% `@shani/ui` Primitives:** `Box`, `VStack`, `HStack`, `Text`, `Button`, `TextField`, `Card`, `Badge`, `Switch`, `Icon`.
- **Zero Raw Hex Colors:** All colors consume `theme.colors.*` or semantic prop aliases (`color="secondary"`, `variant="brand"`).
- **Zero Raw Numeric Layout Styles:** All padding, margins, and gaps consume the 4pt token scale (`spacing="4"`, `p="4"`).
- **Ergonomic Accessibility:** Minimum 44×44pt touch targets on all interactive elements, compile-time enforced `accessibilityLabel` on `IconButton`, and clear form field labels.
- **Responsive Card Action Placement:** Secondary actions in card header, single primary action in card footer wrapping properly on narrow viewports.
