# AI Screen Generation Experiment — Prompts & Protocol

This document defines the strict, scientific testing protocol and the exact identical prompt for the controlled A/B experiment between **Run 1: Without Context** and **Run 2: With Context**.

---

## 1. The Identical Test Prompt

Both runs must use the **exact same prompt** with no variations:

```markdown
Build a shipment pickup scheduling screen matching the attached Figma screenshot: pickup address, date and time slot selection, package count, notes, a summary card, and a confirm button. Use the installed design system.
```

---

## 2. Screenshot Input Attachment

- **File Path:** [`ai-demo/figma-input.png`](./figma-input.png)
- When starting each session, attach this exact image file along with the prompt text above.

---

## 3. Rules for a Fair Test

To ensure a scientifically rigorous and unbiased benchmark:

1. **Fresh Session per Run:** Use a completely new, clean AI session (e.g., Gemini CLI, Claude Code, or web chat) for each run so no prior conversation history leaks context.
2. **Same Model & Parameters:** Use the exact same AI model (e.g. Gemini 1.5 Pro / Claude 3.5 Sonnet) and default temperature settings for both runs.
3. **Identical Prompt & Image:** Submit the exact prompt string above with `ai-demo/figma-input.png` attached.
4. **No Hand Edits:** Under no circumstances manually alter, reformat, or fix the AI's generated code. The code saved must be 100% the raw output of the AI assistant.
5. **Count Refinement Prompts:**
   - If the code fails to compile or run, prompt the AI to fix it (e.g. "Fix the TypeScript/Metro bundling errors").
   - Record the exact number of refinement prompts required until the screen renders.
6. **Automated AST Validation:** Run the official AST validator on both outputs:
   ```bash
   npx shani-ds validate <path-to-screen>
   ```
   Save the raw terminal output to `validation-report.txt` in each respective folder.

---

## 4. Execution Steps

### Run 1: Without Context
1. Open the consumer directory without AI context:
   ```bash
   cd ../consumer-without-context
   ```
2. Start a fresh Gemini or Claude session in this folder.
3. Submit the prompt with `ai-demo/figma-input.png` attached.
4. Save the generated screen to `PickupScreen.tsx`.
5. Run the validator:
   ```bash
   npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/without-context/validation-report.txt 2>&1
   ```
6. Copy `PickupScreen.tsx` to `ai-demo/without-context/PickupScreen.tsx`.
7. Capture a screenshot of the rendered screen and save to `ai-demo/without-context/screenshot.png`.

---

### Run 2: With Shani DS Context
1. Open the consumer directory with AI context (where `shani-ds init-ai` was executed):
   ```bash
   cd ../consumer-with-context
   ```
2. Start a fresh Gemini or Claude session in this folder.
3. Submit the identical prompt with `ai-demo/figma-input.png` attached.
4. Save the generated screen to `PickupScreen.tsx`.
5. Run the validator:
   ```bash
   npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/with-context/validation-report.txt 2>&1
   ```
6. Copy `PickupScreen.tsx` to `ai-demo/with-context/PickupScreen.tsx`.
7. Capture a screenshot of the rendered screen and save to `ai-demo/with-context/screenshot.png`.

---

## 5. Completing the Benchmark
After both runs are finished, record your findings in [`ai-demo/COMPARISON.md`](./COMPARISON.md).
