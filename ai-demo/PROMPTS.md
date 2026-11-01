# AI Screen Generation Prompts & Testing Guide

This guide provides the exact prompts to execute for the controlled experiment comparing AI screen generation **Without Context** vs **With Shani DS Context**, along with step-by-step instructions for testing the generated screen in the live gallery application.

---

## 1. Prompt 1: Without Context (Baseline)

Run this prompt in an unconfigured AI workspace (e.g., an empty project without `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or `components.json`):

```markdown
Build a production-ready mobile screen in React Native for a freight logistics application:
Screen Name: "Schedule Shipment Pickup"

Requirements:
1. Pickup Facility Info:
   - Facility Name: "Central Distribution Hub #4"
   - Address: "1040 Logistics Blvd, Dock Bay 12, Chicago, IL"
   - Contact Person: "Marcus Vance (+1 312-555-0192)"
2. Scheduling Details:
   - Pickup Date input (e.g. "2026-11-04")
   - Time Window selector (e.g. "09:00 AM - 12:00 PM")
   - Vehicle Type (e.g. "Semi-Trailer / 53ft Dry Van")
   - Special Instructions input (e.g. "Requires liftgate and pallet jack")
3. Cargo Summary Card:
   - Total Weight: "14,250 lbs"
   - Pallet Count: "18 Standard Pallets"
   - Hazardous Material toggle (default: false)
4. Screen Footer Actions:
   - Secondary button: "Cancel"
   - Primary button: "Confirm Pickup Schedule"
5. The screen must be responsive, scrollable on mobile, and written in TypeScript.
```

Save the generated output to `ai-demo/without-context/PickupScreen.tsx`.

---

## 2. Prompt 2: With Shani DS Context

Run this prompt inside this repository (or supply `GEMINI.md`/`AGENTS.md` and `packages/ui/components.json` to your AI assistant):

```markdown
You are an expert React Native engineer building a screen for a mobile logistics application using the Shani Design System (@shani/ui and @shani/tokens).

Adhere strictly to the workspace guidelines in GEMINI.md / AGENTS.md / CLAUDE.md and the component manifest in packages/ui/components.json:
- ONLY import UI primitives from '@shani/ui' and tokens from '@shani/tokens'.
- NEVER use raw React Native primitives (<Text>, <TextInput>, <Button>, <Pressable>, <TouchableOpacity>).
- NEVER use raw hex codes or RGB strings; all colors must come from theme tokens or semantic props.
- NEVER use raw numbers for layout spacing, sizes, margins, padding, or border radius. Use token keys ('none', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16').
- Enforce 44x44pt minimum touch targets. All IconButtons must have a mandatory accessibilityLabel.
- Follow screen composition hierarchy: single display hero (if any), entity IDs with variant="heading", section titles with variant="title", labels with variant="label", body text with variant="body", timestamps/hints with variant="caption".
- Card action placement: utility icon buttons in card header top-right; single main action in card footer.

Task: Build the "Schedule Shipment Pickup" screen (PickupScreen.tsx):
1. Pickup Facility Card:
   - Header: Facility title "Central Distribution Hub #4", badge "Priority Hub", print label IconButton.
   - Address: "1040 Logistics Blvd, Dock Bay 12, Chicago, IL" with MapPin icon.
   - Contact: "Marcus Vance (+1 312-555-0192)" with Phone icon.
2. Scheduling Card:
   - Section Title: "Pickup Schedule & Equipment"
   - TextField for "Pickup Date" with Calendar prefix icon.
   - TextField for "Time Window" with Clock prefix icon.
   - TextField for "Vehicle Type" with Truck prefix icon.
   - TextField for "Special Instructions" with helper text.
3. Cargo Summary Card:
   - Section Title: "Cargo Specifications"
   - Metric rows: Total Weight ("14,250 lbs") and Pallets ("18 Standard Pallets").
   - Switch row for "Hazardous Materials (HAZMAT)" declaration.
4. Action Footer:
   - Secondary button: "Cancel"
   - Primary button: "Confirm Pickup Schedule" with CheckCircle or ArrowRight icon.

Output a clean, compiling, fully typed TypeScript component named `PickupScreen` with zero design system violations.
```

Save the generated output to `ai-demo/with-context/PickupScreen.tsx`.

---

## 3. How to Test the Generated Screen in the Gallery App

To view and interact with the newly generated screen in the live Expo gallery app:

### Step 1: Copy Screen File to Gallery Demos
Copy `ai-demo/with-context/PickupScreen.tsx` into the gallery demos folder:

```bash
cp ai-demo/with-context/PickupScreen.tsx apps/gallery/app/demos/pickup.tsx
```

### Step 2: Add Link to Gallery Navigation
Open `apps/gallery/app/index.tsx` and add an entry to the `NAV_ITEMS` array:

```tsx
{
  title: 'Demo: Pickup Scheduling',
  description: 'AI-generated freight pickup scheduling screen adhering 100% to Shani DS.',
  path: '/demos/pickup',
  category: 'Display',
  badge: 'AI Generated',
},
```

### Step 3: Run AST Validation Check
Verify that the new screen passes all static design system rules:

```bash
pnpm validate:screen apps/gallery/app/demos/pickup.tsx
```

The validator should output:
```text
🛡️  Validating screen code against Shani DS rules: apps/gallery/app/demos/pickup.tsx

  ✓ apps/gallery/app/demos/pickup.tsx (0 violations)

✅ Validation passed: 1 file(s) cleanly adhere to Shani DS rules.
```

### Step 4: Launch Web Gallery Preview
Start the Expo web development server:

```bash
pnpm gallery:web
```

Open `http://localhost:8081` in your browser and click on **"Demo: Pickup Scheduling"** to review the rendered screen.
