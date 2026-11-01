# Run 1: Without Context (Baseline)

This folder stores the raw artifacts from running the prompt **without** the Shani Design System AI layer.

---

## 1. Environment Setup

- Run the AI model (Gemini, Claude, GPT-4, Cursor) in a generic or isolated workspace.
- **Do NOT** provide:
  - `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, or `.cursorrules`.
  - `packages/ui/components.json`.
  - `docs/ai/` guidelines or prompt templates.
- Use the **Without Context** prompt specified in [`../PROMPTS.md`](../PROMPTS.md).

---

## 2. Artifacts to Save Here

When the AI generates the screen, save the following files into this directory:

| Filename | Description |
| :--- | :--- |
| `prompt.md` | The exact prompt text submitted to the AI assistant. |
| `PickupScreen.tsx` | The raw, unmodified code output produced by the AI. |
| `screenshot.png` | Screenshot of the screen running on mobile or web. |
| `validation-report.txt` | Terminal output from running `pnpm validate:screen ai-demo/without-context/PickupScreen.tsx`. |

---

## 3. How to Run AST Validation

From the repository root, execute:

```bash
pnpm validate:screen ai-demo/without-context/PickupScreen.tsx > ai-demo/without-context/validation-report.txt 2>&1
```

*(Note: The command is expected to exit with code 1 due to design system violations).*

---

## 4. Expected Common Violations

Without design system guidance, baseline LLMs typically produce:
- **Forbidden RN Imports:** `import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native'`.
- **Raw Hex Codes:** `#1D4ED8`, `#FFFFFF`, `#64748B`, `#EF4444`.
- **Magic Pixel Numbers:** `padding: 16`, `marginTop: 12`, `borderRadius: 8`, `fontSize: 18`.
- **Sub-44pt Touch Targets:** `height: 36` buttons or unpadded icons.
- **Missing Accessibility:** No `accessibilityLabel` on icon buttons, raw unlabelled text inputs.
