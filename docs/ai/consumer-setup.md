# Consumer App Setup & Benchmark Reproduction Guide

This guide details the exact steps to reproduce the Shani Design System AI benchmark in standalone consumer applications outside the monorepo.

---

## 1. Overview & Architecture

To prove that the Shani Design System AI layer is fully portable and functional outside this monorepo, we test across two identical, isolated Expo applications:

1. **`consumer-without-context`**: A fresh Expo SDK 52 application that installs `@shani/ui` from a local tarball. It has NO design system instruction files or component manifests.
2. **`consumer-with-context`**: The exact same application after executing `npx shani-ds init-ai`. It contains generated AI rules files pointing to `@node_modules/@shani/ui/AGENTS.md` and `node_modules/@shani/ui/components.json`.

Neither app has any path aliases, symlinks, or parent directory references to the monorepo.

---

## 2. Packaging `@shani/ui`

Before installing `@shani/ui` into an external application, build and package it into a self-contained tarball:

```bash
# 1. From the repo root, build all packages
pnpm build

# 2. Package @shani/ui into a tarball
cd packages/ui
pnpm pack --pack-destination ../../
cd ../..
```

This creates `shani-ui-0.1.0.tgz` in the repository root. Because `package.json` configures `"bundleDependencies": ["@shani/tokens"]`, the tarball bundles the token compiler output directly, allowing consumers to install it without requiring `@shani/tokens` to be published to a remote registry.

---

## 3. Creating the Consumer Applications

### Step 3.1: Create the Base Expo SDK 52 Application

In a directory outside the monorepo (e.g. `../`):

```bash
mkdir -p ../shani-consumer-base
cd ../shani-consumer-base
npx create-expo-app@~52.0.0 . --template blank-typescript
```

Ensure dependencies match the exact versions used by the design system:
```bash
npm install \
  react@18.3.1 \
  react-native@0.76.2 \
  react-native-reanimated@~3.16.7 \
  react-native-gesture-handler@~2.20.2 \
  lucide-react-native@^0.460.0 \
  react-native-svg@15.8.0 \
  react-native-web@~0.19.13 \
  @expo/metro-runtime@~4.0.0 \
  expo-asset@~11.0.0
```

Install the packaged `@shani/ui` tarball:
```bash
npm install /absolute/path/to/shani-ds/shani-ui-0.1.0.tgz
```

Verify that web exports build cleanly:
```bash
npx expo export -p web
```

---

### Step 3.2: Provision the Two Benchmark Directories

Clone the base application into two separate directories:

```bash
cd ..
cp -R shani-consumer-base consumer-without-context
cp -R shani-consumer-base consumer-with-context
```

Verify that neither directory contains any AI rules or design system configuration:
```bash
ls -la consumer-without-context/
ls -la consumer-with-context/
```

---

## 4. Initializing the AI Layer in `consumer-with-context`

Navigate into `consumer-with-context` and run the packaged CLI initialization command:

```bash
cd ../consumer-with-context
npx shani-ds init-ai
```

### What `init-ai` Does:
1. Detects the project root.
2. Creates or non-destructively merges:
   - `CLAUDE.md` — Includes `@node_modules/@shani/ui/AGENTS.md` (Claude Code file inclusion syntax).
   - `GEMINI.md` — Includes `@./node_modules/@shani/ui/AGENTS.md` (Gemini CLI inclusion syntax).
   - `AGENTS.md` — Full canonical rules contract referencing `node_modules/@shani/ui/components.json`.
   - `.cursorrules` — Formatted rules for Cursor IDE.
3. Protects manual developer rules using `<!-- SHANI_DS_START -->` and `<!-- SHANI_DS_END -->` markers.

Verify the difference between the two consumer applications:
```bash
diff -r -x node_modules -x .expo -x package-lock.json ../consumer-without-context ../consumer-with-context
```
*(The only output should be the four AI rules files).*

---

## 5. Running the A/B Experiment

### The Identical Prompt
Use the exact same prompt string in both sessions:

```markdown
Build a shipment pickup scheduling screen matching the attached Figma screenshot: pickup address, date and time slot selection, package count, notes, a summary card, and a confirm button. Use the installed design system.
```

### The Input Mockup
Attach `ai-demo/figma-input.png` to both AI sessions.

---

### Step 5.1: Run 1 (Without Context)
1. Open a terminal in `../consumer-without-context`.
2. Start a fresh AI session (e.g. Gemini CLI, Claude Code, or Cursor).
3. Send the prompt with `ai-demo/figma-input.png`.
4. Save the generated screen to `PickupScreen.tsx`.
5. Run the validator:
   ```bash
   npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/without-context/validation-report.txt 2>&1
   ```
6. Copy `PickupScreen.tsx` to `../shani-ds/ai-demo/without-context/PickupScreen.tsx`.
7. Render the screen and capture a screenshot to `../shani-ds/ai-demo/without-context/screenshot.png`.

---

### Step 5.2: Run 2 (With Context)
1. Open a terminal in `../consumer-with-context`.
2. Start a fresh AI session.
3. Send the identical prompt with `ai-demo/figma-input.png`.
4. Save the generated screen to `PickupScreen.tsx`.
5. Run the validator:
   ```bash
   npx shani-ds validate PickupScreen.tsx > ../shani-ds/ai-demo/with-context/validation-report.txt 2>&1
   ```
6. Copy `PickupScreen.tsx` to `../shani-ds/ai-demo/with-context/PickupScreen.tsx`.
7. Render the screen and capture a screenshot to `../shani-ds/ai-demo/with-context/screenshot.png`.

---

## 6. Comparing and Documenting Results

Open `ai-demo/COMPARISON.md` and record the measurements:

| Evaluation Dimension | Without Context | With Context |
| :--- | :--- | :--- |
| **Design System Compliance** | `% @shani/ui` vs RN | `% @shani/ui` vs RN |
| **Raw Hex Colors** | Count (typically 10-20) | Target: 0 |
| **Magic Spacing Numbers** | Count | Target: 0 |
| **44pt Touch Targets** | Pass / Fail | Pass (enforced by Button/IconButton) |
| **Accessible Labels** | Missing vs Present | Compile-time enforced |
| **Typographic Hierarchy** | Arbitrary sizes | Single display hero, valid variants |
| **AST Validation Result** | Violation count | 0 violations (exit 0) |
| **Refinement Prompts Needed** | Count | Count |

Document all honest notes on what the AI got right, what it got wrong, and any edge cases observed.

