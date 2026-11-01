import fs from 'node:fs';
import path from 'node:path';

export interface InitAiOptions {
  targetDir?: string;
  force?: boolean;
}

export interface InitAiResult {
  created: string[];
  updated: string[];
  skipped: string[];
}

export const SHANI_START_MARKER = '<!-- SHANI_DS_START -->';
export const SHANI_END_MARKER = '<!-- SHANI_DS_END -->';

const KEY_RULES_SUMMARY = `# Shani Design System — AI & Agent Guidelines

You are an expert React Native engineer building mobile screens for logistics applications using the **Shani Design System (\`@shani/ui\`)**.

## Package Context References
- **Canonical Rules:** \`node_modules/@shani/ui/AGENTS.md\`
- **Component Manifest:** \`node_modules/@shani/ui/components.json\`
- **AST Validator:** Run \`npx shani-ds validate <path>\` to verify screen compliance.

---

## Allowed Imports
You may ONLY import UI primitives, components, and tokens from the official packages:
\`\`\`tsx
import {
  ThemeProvider,
  Box,
  Stack,
  HStack,
  VStack,
  Divider,
  Text,
  Icon,
  Button,
  IconButton,
  TextField,
  Checkbox,
  Switch,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  Skeleton,
  Timeline,
  useTheme,
  useStyles,
  useResponsive,
} from '@shani/ui';
\`\`\`

Icons must ALWAYS be rendered through the \`@shani/ui\` \`Icon\` component using valid Lucide icon names:
\`\`\`tsx
<Icon name="Search" size="sm" color="secondary" />
\`\`\`

---

## App Setup (Root Provider)
Every application consuming \`@shani/ui\` must wrap its root component tree in \`<ThemeProvider>\`.
- **Props:** \`initialMode="light" | "dark" | "system"\` (use \`initialMode\`, **never** \`defaultMode\`), \`mode\`, \`onModeChange\`, \`overrides\`, \`children\`.
- **Note:** Root provider setup (\`<ThemeProvider>\`) is an app container wrapper and is not validated by the screen AST validator (\`shani-ds validate\`).

\`\`\`tsx
import React from 'react';
import { ThemeProvider, Box, VStack, Text, Button } from '@shani/ui';

export default function App() {
  return (
    <ThemeProvider initialMode="light">
      <Box flex={1} bg="canvas" p="6" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <VStack spacing="4" align="center">
          <Text variant="heading">Consumer App</Text>
          <Text variant="body" color="secondary">Testing @shani/ui</Text>
          <Button variant="primary" size="md" onPress={() => {}}>Action</Button>
        </VStack>
      </Box>
    </ThemeProvider>
  );
}
\`\`\`

---

## Strict Prohibitions (NEVER)
1. **NEVER use raw hex codes or RGB strings** in screen code (e.g. \`#1D4ED8\`, \`#FFFFFF\`, \`rgba(0,0,0,0.5)\`). All colors must reference theme semantic tokens via \`theme.colors.*\` or component props.
2. **NEVER use raw numbers for layout spacing, sizes, margins, padding, or border radius** (e.g. \`margin: 12\`, \`padding: 15\`, \`borderRadius: 8\`). All values must reference token scales (\`spacing="3"\`, \`p="4"\`, \`theme.radius.md\`).
3. **NEVER import or render raw React Native primitives** in screen code:
   - Do NOT use \`<Text>\` from \`'react-native'\` -> Use \`<Text variant="...">\` from \`'@shani/ui'\`.
   - Do NOT use \`<TextInput>\` from \`'react-native'\` -> Use \`<TextField label="...">\` from \`'@shani/ui'\`.
   - Do NOT use \`<Button>\` or \`<Pressable>\` or \`<TouchableOpacity>\` from \`'react-native'\` -> Use \`<Button>\` or \`<IconButton>\` from \`'@shani/ui'\`.
   - Do NOT use raw nested \`<View>\` for linear spacing -> Use \`<VStack spacing="...">\` or \`<HStack spacing="...">\` from \`'@shani/ui'\`.

---

## Spacing & Size Token Scales
- \`Stack\`, \`HStack\`, \`VStack\`: \`spacing\` in \`'none'\` (0pt), \`'1'\` (4pt), \`'2'\` (8pt), \`'3'\` (12pt), \`'4'\` (16pt), \`'5'\` (20pt), \`'6'\` (24pt), \`'8'\` (32pt), \`'10'\` (40pt), \`'12'\` (48pt), \`'16'\` (64pt).
- \`Box\`: \`p\`, \`px\`, \`py\`, \`m\`, \`mx\`, \`my\`, \`gap\` in token keys \`'none'\`, \`'1'\`, \`'2'\`, \`'3'\`, \`'4'\`, \`'5'\`, \`'6'\`, \`'8'\`, \`'10'\`, \`'12'\`, \`'16'\`.
- \`Card\`: \`padding\` in \`'none'\`, \`'sm'\`, \`'md'\`, \`'lg'\`; \`variant\` in \`'outlined'\`, \`'elevated'\`, \`'filled'\`.
- \`Text\`: \`variant\` in \`'display'\`, \`'heading'\`, \`'title'\`, \`'body'\`, \`'label'\`, \`'caption'\`.
- \`Button\` / \`IconButton\`: \`size\` in \`'sm'\` (44pt min), \`'md'\` (48pt), \`'lg'\` (56pt). \`IconButton\` requires \`accessibilityLabel: string\`.

---

## Screen Composition Hierarchy
- **Single Hero:** Only ONE value per screen uses \`variant="display"\`.
- **Entity Identifiers:** Waybill numbers and codes use \`variant="heading"\`.
- **Section Headers:** Card titles use \`variant="title"\`.
- **Card Actions:** Secondary icon actions go in CardHeader top-right; single main action goes in CardFooter bottom-right (wrapping gracefully on mobile).
`;

function getClaudeContent(): string {
  return `# Claude Code Instructions — Shani Design System

This repository builds React Native screens using the **Shani Design System (\`@shani/ui\`)**.

@node_modules/@shani/ui/AGENTS.md

## Machine-Readable Resources
- Component Manifest & Union Prop Schemas: \`node_modules/@shani/ui/components.json\`
- Full Rules: \`node_modules/@shani/ui/AGENTS.md\`
- Validation Command: \`npx shani-ds validate <path-to-screen>\`
`;
}

function getGeminiContent(): string {
  return `# Gemini CLI Instructions — Shani Design System

This repository builds React Native screens using the **Shani Design System (\`@shani/ui\`)**.

@./node_modules/@shani/ui/AGENTS.md

## Machine-Readable Resources
- Component Manifest & Union Prop Schemas: \`node_modules/@shani/ui/components.json\`
- Full Rules: \`node_modules/@shani/ui/AGENTS.md\`
- Validation Command: \`npx shani-ds validate <path-to-screen>\`
`;
}

function getAgentsContent(): string {
  return KEY_RULES_SUMMARY;
}

function getCursorRulesContent(): string {
  return KEY_RULES_SUMMARY;
}

export function initAi(options: InitAiOptions = {}): InitAiResult {
  const targetDir = path.resolve(options.targetDir || process.cwd());

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targets: { fileName: string; content: string }[] = [
    { fileName: 'CLAUDE.md', content: getClaudeContent() },
    { fileName: 'GEMINI.md', content: getGeminiContent() },
    { fileName: 'AGENTS.md', content: getAgentsContent() },
    { fileName: '.cursorrules', content: getCursorRulesContent() },
  ];

  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];

  for (const { fileName, content } of targets) {
    const filePath = path.join(targetDir, fileName);
    const wrappedContent = `${SHANI_START_MARKER}\n${content.trim()}\n${SHANI_END_MARKER}\n`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, wrappedContent, 'utf-8');
      created.push(fileName);
    } else {
      const existing = fs.readFileSync(filePath, 'utf-8');
      if (existing.includes(SHANI_START_MARKER)) {
        // Replace existing Shani DS section cleanly
        const startIndex = existing.indexOf(SHANI_START_MARKER);
        const endIndex = existing.indexOf(SHANI_END_MARKER);
        if (endIndex !== -1) {
          const before = existing.substring(0, startIndex);
          const after = existing.substring(endIndex + SHANI_END_MARKER.length);
          const newContent = `${before}${wrappedContent.trim()}${after.startsWith('\n') ? '' : '\n'}${after}`;
          fs.writeFileSync(filePath, newContent, 'utf-8');
          updated.push(fileName);
        } else {
          // If malformed marker, append
          fs.writeFileSync(filePath, `${existing.trim()}\n\n${wrappedContent}`, 'utf-8');
          updated.push(fileName);
        }
      } else {
        // Append section without overwriting user content
        const separator = existing.trim().length > 0 ? '\n\n' : '';
        const newContent = `${existing.trim()}${separator}${wrappedContent}`;
        fs.writeFileSync(filePath, newContent, 'utf-8');
        updated.push(fileName);
      }
    }
  }

  return { created, updated, skipped };
}
