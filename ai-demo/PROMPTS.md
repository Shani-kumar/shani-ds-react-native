# AI Screen Generation Experiment — Prompts & Verification Protocol

This document defines the prompt and execution protocol used to benchmark screen generation in a consumer application equipped with the **Shani Design System AI Context & Governance Layer**.

---

## 1. The Benchmark Prompt

Submit the following prompt to the AI assistant along with the Figma reference image:

```markdown
Build a shipment pickup scheduling screen matching the attached Figma screenshot: pickup address, date and time slot selection, package count, notes, a summary card, and a confirm button. Use the installed design system.
```

---

## 2. Screenshot Input Attachment

- **File Path:** [`ai-demo/figma-input.png`](./figma-input.png)
- Attach this exact image file along with the prompt text above.

---

## 3. Protocol for Consumer App Generation

1. **Consumer Repository Initialization:**
   In any external consumer application installing `@shani/ui`, bootstrap the AI Layer:
   ```bash
   npx shani-ds init-ai
   ```
   This provisions `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, and links them to the `@shani/ui` component manifest.

2. **Clean Session Generation:**
   - Launch an AI agent (Gemini CLI, Claude Code, Cursor, or web interface) in the consumer app.
   - Attach [`ai-demo/figma-input.png`](./figma-input.png) and provide the prompt above.
   - The AI generates the complete screen conforming to `@shani/ui` tokens and components.

3. **Automated AST Validation:**
   Audit the generated screen against design system rules:
   ```bash
   npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/validation-report.txt 2>&1
   ```

4. **Verify Live Render & Capture:**
   - Save the code to [`ai-demo/PickupScreen.tsx`](./PickupScreen.tsx).
   - Start the app with `npx expo start --web` and verify clean rendering with 0 console errors.
   - Capture the rendered screen to [`ai-demo/screenshot.png`](./screenshot.png).

---

## 4. Evaluation Criteria

Review the results in [`ai-demo/COMPARISON.md`](./COMPARISON.md):
- **100% Component Mapping:** Package counters map to `<QuantityStepper>` and date/time chips to `<ChipGroup>`.
- **Zero Raw Hex Colors:** All styling references semantic theme tokens (`canvas`, `surface`, `secondary`).
- **Zero Magic Numbers:** Layout strictly adheres to the 4pt token scale (`spacing="5"`, `spacing="4"`, `p="6"`).
- **Accessibility:** 44×44pt touch targets on all interactive controls; explicit `accessibilityLabel` on icon triggers.
