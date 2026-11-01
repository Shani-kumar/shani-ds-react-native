# Shani Design System — Figma Mapping & Tooling Specification

This document defines the formal mapping between Figma design variables/components and Shani Design System (`@shani/tokens` and `@shani/ui`), and provides setup instructions for the **Figma Dev Mode MCP Server** and **Figma Code Connect**.

> **Note on Live Connections:**  
> This specification documents production tooling and integration architecture. No live Figma token or remote Figma file URL is hardcoded into this repository.

---

## 1. Token & Variable Mapping Matrix

Figma variables map 1:1 to the 3-tier token architecture of `@shani/tokens`.

### Tier 1: Primitive Palette Mappings

| Figma Variable Name | Shani Token Key | Light Hex | Dark Hex |
| :--- | :--- | :--- | :--- |
| `primitive/blue/600` | `palette.blue[600]` | `#1D4ED8` | `#1D4ED8` |
| `primitive/blue/500` | `palette.blue[500]` | `#2563EB` | `#2563EB` |
| `primitive/blue/100` | `palette.blue[100]` | `#DBEAFE` | `#DBEAFE` |
| `primitive/slate/900` | `palette.slate[900]` | `#0F172A` | `#0F172A` |
| `primitive/slate/800` | `palette.slate[800]` | `#1E293B` | `#1E293B` |
| `primitive/slate/50` | `palette.slate[50]` | `#F8FAFC` | `#F8FAFC` |
| `primitive/emerald/600` | `palette.emerald[600]` | `#059669` | `#059669` |
| `primitive/amber/600` | `palette.amber[600]` | `#D97706` | `#D97706` |
| `primitive/rose/600` | `palette.rose[600]` | `#E11D48` | `#E11D48` |

### Tier 2: Semantic Color Tokens (Mode-Aware)

| Figma Semantic Variable | Shani Semantic Key | Light Theme Value | Dark Theme Value |
| :--- | :--- | :--- | :--- |
| `color/text/primary` | `colors.text.primary` | `#0F172A` | `#F8FAFC` |
| `color/text/secondary` | `colors.text.secondary` | `#334155` | `#CBD5E1` |
| `color/text/tertiary` | `colors.text.tertiary` | `#475569` | `#94A3B8` |
| `color/text/brand` | `colors.text.brand` | `#1D4ED8` | `#60A5FA` |
| `color/bg/canvas` | `colors.bg.canvas` | `#F8FAFC` | `#020617` |
| `color/bg/surface` | `colors.bg.surface` | `#FFFFFF` | `#0F172A` |
| `color/bg/surfaceRaised` | `colors.bg.surfaceRaised` | `#FFFFFF` | `#1E293B` |
| `color/border/subtle` | `colors.border.subtle` | `#E2E8F0` | `#1E293B` |
| `color/border/default` | `colors.border.default` | `#CBD5E1` | `#334155` |
| `color/border/focus` | `colors.border.focus` | `#1D4ED8` | `#60A5FA` |
| `color/action/primary/default` | `colors.action.primary.default` | `#1D4ED8` | `#1D4ED8` |
| `color/action/primary/pressed` | `colors.action.primary.pressed` | `#1E40AF` | `#1E40AF` |
| `color/action/primary/text` | `colors.action.primary.text` | `#FFFFFF` | `#FFFFFF` |

### Tier 3: Dimension & Geometry Variables

| Figma Dimension Variable | Shani Token Key | Points / Value | CSS / RN Equivalent |
| :--- | :--- | :--- | :--- |
| `spacing/0` | `theme.spacing[0]` | $0\text{pt}$ | `0` |
| `spacing/1` | `theme.spacing[1]` | $4\text{pt}$ | `4` |
| `spacing/2` | `theme.spacing[2]` | $8\text{pt}$ | `8` |
| `spacing/3` | `theme.spacing[3]` | $12\text{pt}$ | `12` |
| `spacing/4` | `theme.spacing[4]` | $16\text{pt}$ | `16` |
| `spacing/6` | `theme.spacing[6]` | $24\text{pt}$ | `24` |
| `spacing/8` | `theme.spacing[8]` | $32\text{pt}$ | `32` |
| `spacing/12` | `theme.spacing[12]` | $48\text{pt}$ | `48` |
| `spacing/16` | `theme.spacing[16]` | $64\text{pt}$ | `64` |
| `radius/none` | `theme.radius.none` | $0\text{pt}$ | `borderRadius: 0` |
| `radius/xs` | `theme.radius.xs` | $2\text{pt}$ | `borderRadius: 2` |
| `radius/sm` | `theme.radius.sm` | $4\text{pt}$ | `borderRadius: 4` |
| `radius/md` | `theme.radius.md` | $8\text{pt}$ | `borderRadius: 8` |
| `radius/lg` | `theme.radius.lg` | $12\text{pt}$ | `borderRadius: 12` |
| `radius/full` | `theme.radius.full` | $9999\text{pt}$ | `borderRadius: 9999` |

---

## 2. Component Mapping Matrix

| Figma Component Name | Variant / Property in Figma | Shani DS Component (`@shani/ui`) | Code Example |
| :--- | :--- | :--- | :--- |
| `Button` | `Variant=Primary`, `Size=Medium` | `<Button variant="primary" size="md">` | `<Button variant="primary" size="md">Dispatch</Button>` |
| `Button` | `Variant=Secondary`, `Size=Small` | `<Button variant="secondary" size="sm">` | `<Button variant="secondary" size="sm">Cancel</Button>` |
| `IconButton` | `Variant=Ghost`, `Size=Medium`, `Shape=Square` | `<IconButton variant="ghost" size="md" shape="square">` | `<IconButton name="Printer" accessibilityLabel="Print" />` |
| `Card` | `Elevation=Outlined`, `Padding=Medium` | `<Card variant="outlined" padding="md">` | `<Card variant="outlined"><CardContent>...</CardContent></Card>` |
| `Card` | `Elevation=Elevated`, `Padding=Large` | `<Card variant="elevated" padding="lg">` | `<Card variant="elevated"><CardContent>...</CardContent></Card>` |
| `TextField` | `State=Default`, `HasError=False` | `<TextField label="..." helperText="...">` | `<TextField label="Waybill" placeholder="1Z..." />` |
| `TextField` | `State=Error`, `ErrorText="..."` | `<TextField error="...">` | `<TextField label="Waybill" error="Invalid format" />` |
| `Badge` | `Status=Success`, `HasDot=True` | `<Badge variant="success" dot={true}>` | `<Badge variant="success" dot={true}>Delivered</Badge>` |
| `Badge` | `Status=Brand`, `HasDot=False` | `<Badge variant="brand">` | `<Badge variant="brand">Express</Badge>` |
| `Timeline` | Stepper with milestone list | `<Timeline steps={[...]} />` | `<Timeline steps={milestones} />` |
| `Checkbox` | `Checked=True`, `Indeterminate=False` | `<Checkbox checked={true} label="...">` | `<Checkbox checked={true} label="Fragile Cargo" />` |
| `Switch` | `Checked=True`, `Disabled=False` | `<Switch checked={true} label="...">` | `<Switch checked={true} label="GPS Telemetry" />` |
| `Skeleton` | `Type=Rectangular` | `<Skeleton variant="rectangular" />` | `<Skeleton variant="rectangular" width="100%" height={80} />` |
| `Divider` | `Orientation=Horizontal` | `<Divider orientation="horizontal" />` | `<Divider orientation="horizontal" color="subtle" />` |

---

## 3. Figma Dev Mode MCP Server Integration

The Model Context Protocol (MCP) server allows AI agents to inspect live Figma design files, query layer trees, read variable bindings, and generate pixel-perfect React Native code with `@shani/ui`.

### A. MCP Server Configuration

Add the Figma MCP server to your editor's MCP settings (e.g. `.cursor/mcp.json`, Claude Desktop config, or Antigravity settings):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

### B. Agent Capabilities Enabled

When configured, the agent has access to these MCP tools:
1. `figma_get_file_nodes(fileKey, nodeIds)`: Fetches layer geometry, auto-layout constraints, and typography parameters.
2. `figma_get_variables(fileKey)`: Retrieves all variable collections and alias tokens bound to selected nodes.
3. `figma_get_component_metadata(componentKey)`: Inspects component property definitions (enums, booleans, slots).

### C. Translation Workflow for AI Agents

```
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│ 1. Agent queries Figma │  ──>  │ 2. Extract bound       │  ──>  │ 3. Match components   │
│    node via MCP        │       │    variables & values  │       │    & props from schema │
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘
            │                                                                  │
            ▼                                                                  ▼
    Layer Tree JSON                                                    Compiling React Native
    autoLayout: VERTICAL                                               <VStack spacing="4">
    gap: 16 (spacing/4)                                                  <Card variant="elevated">
    padding: 16 (spacing/4)                                                ...
    component: "Button"                                                  </Card>
    props: { Size: "Large" }                                           </VStack>
```

---

## 4. Figma Code Connect Setup

Figma Code Connect links production components directly into Figma's Dev Mode panel. When a developer or designer selects a component in Figma, Dev Mode displays the exact `@shani/ui` TypeScript snippet.

### A. Installation

Install Code Connect in the repository devDependencies:

```bash
pnpm add -D @figma/code-connect
```

### B. Code Connect Configuration (`figma.config.json`)

Create `figma.config.json` at the repo root:

```json
{
  "codeConnect": {
    "include": ["packages/ui/src/**/*.figma.tsx"],
    "parser": "react"
  }
}
```

### C. Component Code Connect Definition (`Button.figma.tsx`)

Place Code Connect files next to components: `packages/ui/src/components/Button/Button.figma.tsx`:

```tsx
import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'https://www.figma.com/design/<FIGMA_FILE_KEY>/Shani-Design-System?node-id=123-456', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
      Danger: 'danger',
      Ghost: 'ghost',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    loading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    fullWidth: figma.boolean('Full Width'),
    label: figma.string('Label Text'),
    leftIcon: figma.string('Left Icon'),
  },
  example: ({ variant, size, loading, disabled, fullWidth, label, leftIcon }) => (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      leftIcon={leftIcon}
      onPress={() => console.log('Action tapped')}
    >
      {label}
    </Button>
  ),
});
```

### D. Card Code Connect Definition (`Card.figma.tsx`)

`packages/ui/src/components/Card/Card.figma.tsx`:

```tsx
import figma from '@figma/code-connect';
import { Card, CardHeader, CardContent, CardFooter, Text, Button } from '../../index';

figma.connect(Card, 'https://www.figma.com/design/<FIGMA_FILE_KEY>/Shani-Design-System?node-id=789-012', {
  props: {
    variant: figma.enum('Variant', {
      Outlined: 'outlined',
      Elevated: 'elevated',
      Filled: 'filled',
    }),
    padding: figma.enum('Padding', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    title: figma.string('Header Title'),
    body: figma.string('Body Text'),
    actionLabel: figma.string('Action Label'),
  },
  example: ({ variant, padding, title, body, actionLabel }) => (
    <Card variant={variant} padding={padding}>
      <CardHeader>
        <Text variant="title">{title}</Text>
      </CardHeader>
      <CardContent>
        <Text variant="body">{body}</Text>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  ),
});
```

### E. Publishing to Figma Dev Mode

Once Figma credentials are set in environment variables (`FIGMA_ACCESS_TOKEN`), publish mappings to Figma:

```bash
# Verify definitions locally
npx figma connect parse

# Publish live snippets to Figma Dev Mode
npx figma connect publish
```

