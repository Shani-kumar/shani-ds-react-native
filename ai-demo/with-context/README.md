# Run 2: With Context (Shani Design System AI Layer)

This folder stores the raw artifacts from running the benchmark prompt **with** the full Shani Design System AI layer configured.

---

## 1. Environment & Setup

- **Working Directory:** An external consumer app initialized with `npx shani-ds init-ai` (e.g. `../consumer-with-context`).
- **Context Configured:** Contains AI rules files (`GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`) referencing `@node_modules/@shani/ui/AGENTS.md` and pointing to `node_modules/@shani/ui/components.json`.
- **Session:** A fresh AI session (Gemini CLI, Claude Code, Cursor, or web interface) with zero prior chat context.

---

## 2. Identical Test Prompt

Submit the exact, unmodified prompt to the AI assistant along with the image [`ai-demo/figma-input.png`](../figma-input.png):

```markdown
Build a shipment pickup scheduling screen matching the attached Figma screenshot: pickup address, date and time slot selection, package count, notes, a summary card, and a confirm button. Use the installed design system.
```

---

## 3. Artifacts to Save Here

When the AI produces its code, save the following files into this directory:

| Filename | Description |
| :--- | :--- |
| `PickupScreen.tsx` | The raw, unmodified code output produced by the AI assistant. |
| `screenshot.png` | Screenshot of the screen rendered on web or mobile. |
| `validation-report.txt` | Terminal output from running `npx shani-ds validate PickupScreen.tsx`. |

---

## 4. How to Generate the Validation Report

Inside the consumer app directory (`../consumer-with-context`):

```bash
npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/with-context/validation-report.txt 2>&1
```

*(Expected output: `0 violations detected across 1 file`, exit code 0).*

---

## 5. Next Steps

After running this test, compare the artifacts with Run 1 and document the full evaluation in [`../COMPARISON.md`](../COMPARISON.md).
