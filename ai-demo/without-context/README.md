# Run 1: Without Context (Baseline)

This folder stores the raw artifacts from running the benchmark prompt **without** the Shani Design System AI layer.

---

## 1. Environment & Setup

- **Working Directory:** An external consumer app without AI context files (e.g. `../consumer-without-context`).
- **Dependencies:** Contains `@shani/ui` installed, but **no** `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, or `.cursorrules`.
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

Inside the consumer app directory (`../consumer-without-context`):

```bash
npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/without-context/validation-report.txt 2>&1
```

*(Note: Without context, this command typically exits with code 1 due to violations such as raw hex codes, direct React Native primitive imports, or arbitrary pixel values).*

---

## 5. Next Steps

After running this baseline test, proceed to [`../with-context/README.md`](../with-context/README.md) for Run 2, and then fill in the results in [`../COMPARISON.md`](../COMPARISON.md).
