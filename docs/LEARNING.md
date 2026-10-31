# Design Systems Learning & Interview Guide

This guide breaks down every core architectural concept implemented in **Shani DS** in plain English, structured so a junior developer could explain them confidently in a technical interview.

---

## 1. The Three-Tier Design Token Architecture

### The Problem it Solves
In naive codebases, developers write raw hex values like `#2563EB` or magic numbers like `margin: 14` directly inside components. When the company rebrands, adds dark mode, or creates a white-label partner app, engineers have to find and replace thousands of hardcoded lines across 15+ apps.

### The Solution: 3 Tiers of Tokens

```
Tier 1: Primitives (What is the value?)
  └── color.blue.600 = "#2563EB"
        │
Tier 2: Semantic (What does it mean?)
  └── color.action.primary.default = "{color.brand.600}" (in light mode)
  └── color.action.primary.default = "{color.brand.400}" (in dark mode)
        │
Tier 3: Component (Where is it applied?)
  └── button.primary.bg.default = "{color.action.primary.default}"
```

1. **Primitive Tokens (Tier 1):**
   - **Definition:** The raw palette and scales of your design system. These represent choices, not decisions.
   - **Examples:** `blue-500: #3B82F6`, `spacing-4: 16`, `radius-md: 8`.
   - **Analogy:** The raw ingredients in a pantry (flour, sugar, salt).

2. **Semantic Tokens (Tier 2):**
   - **Definition:** Intent-driven tokens that assign meaning to primitives. They answer *purpose* and change based on context (such as Light Mode vs. Dark Mode or Brand A vs. Brand B).
   - **Examples:** `color.bg.canvas`, `color.text.primary`, `color.action.primary.pressed`.
   - **Analogy:** The course designation on a menu (appetizer, dessert). Sugar might be dessert, salt is appetizer.

3. **Component Tokens (Tier 3):**
   - **Definition:** Scoped tokens dedicated to specific components.
   - **Examples:** `button.primary.bg`, `card.border.subtle`, `input.text.active`.
   - **Analogy:** The specific recipe for the dish. If a chef wants to change only the button's hover state without affecting badges or links, they edit the component token.

### Interview Talking Point:
> "We separate tokens into three distinct tiers: Primitives (raw physical scales), Semantics (contextual intent for light/dark and white-label theming), and Component tokens (isolated component-level overrides). This decoupling allows our 15+ logistics apps to flip themes or white-label a sub-brand simply by swapping semantic token maps without touching a single line of component code."

---

## 2. W3C Design Tokens Standard Format

We format token JSON files following the emerging **W3C Design Tokens Community Group (DTCG)** standard:
- `$value`: The actual value or alias string (e.g., `"{color.brand.600}"`).
- `$type`: The design token type (`color`, `dimension`, `duration`, `cubicBezier`, etc.).
- `$description`: Human and machine-readable explanation of when and why to use the token.

### Why Aliasing (`{...}`) Matters
Using `{color.neutral.900}` inside semantic definitions creates a single source of truth. When the primitive scale changes, all semantic and component tokens automatically inherit the update.

---

## 3. WCAG Contrast Ratios & Automated Enforcement

### What is WCAG 2.1 AA Contrast?
The Web Content Accessibility Guidelines (WCAG) specify that text and essential UI elements must have sufficient luminance contrast against their background:
- **Normal Text (<18pt or <14pt bold):** At least **4.5:1** contrast ratio.
- **Large Text (≥18pt or ≥14pt bold):** At least **3.0:1** contrast ratio.
- **UI Components & Graphical Objects (Borders, Action icons):** At least **3.0:1** contrast ratio.

### How Luminance is Calculated
Relative luminance ($L$) calculates perceived lightness:
$$L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
where $R, G, B$ are gamma-corrected sRGB channel values.
The contrast ratio between light luminance ($L_1$) and dark luminance ($L_2$) is:
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### Why Automated Contrast CI Checks Matter
In a logistics app, drivers and warehouse operators work outdoors in direct sunlight or in dimly lit distribution hubs. An automated contrast check in CI (`pnpm contrast`) guarantees that no designer or developer can commit a color pair that fails WCAG AA standards. If a pair is below 4.5:1, the CI build fails instantly.
