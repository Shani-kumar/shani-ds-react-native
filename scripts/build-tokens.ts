import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const TOKENS_DIR = path.join(ROOT_DIR, 'packages', 'tokens');
const PRIMITIVE_DIR = path.join(TOKENS_DIR, 'src', 'primitive');
const SEMANTIC_DIR = path.join(TOKENS_DIR, 'src', 'semantic');
const COMPONENT_DIR = path.join(TOKENS_DIR, 'src', 'component');
const GENERATED_DIR = path.join(TOKENS_DIR, 'src', 'generated');

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type TokenDict = Record<string, JsonValue>;

function readJsonFile(filePath: string): TokenDict {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as TokenDict;
}

function loadAllPrimitives(): TokenDict {
  const files = fs.readdirSync(PRIMITIVE_DIR).filter(f => f.endsWith('.json'));
  let primitives: TokenDict = {};
  for (const file of files) {
    const data = readJsonFile(path.join(PRIMITIVE_DIR, file));
    primitives = { ...primitives, ...data };
  }
  return primitives;
}

function loadAllComponents(): TokenDict {
  const files = fs.readdirSync(COMPONENT_DIR).filter(f => f.endsWith('.json'));
  let components: TokenDict = {};
  for (const file of files) {
    const data = readJsonFile(path.join(COMPONENT_DIR, file));
    if (data.component && typeof data.component === 'object') {
      components = { ...components, ...(data.component as TokenDict) };
    }
  }
  return components;
}

function getByPath(obj: JsonValue, pathParts: string[]): JsonValue | undefined {
  let curr: JsonValue | undefined = obj;
  for (const part of pathParts) {
    if (curr === undefined || curr === null || typeof curr !== 'object' || Array.isArray(curr)) {
      return undefined;
    }
    curr = (curr as Record<string, JsonValue>)[part];
  }
  return curr;
}

function resolveValue(val: JsonValue, lookup: TokenDict, visited = new Set<string>()): JsonValue {
  if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
    const alias = val.slice(1, -1);
    if (visited.has(alias)) {
      throw new Error(`Circular reference detected for token: ${alias}`);
    }
    const nextVisited = new Set(visited);
    nextVisited.add(alias);
    const parts = alias.split('.');
    const found = getByPath(lookup, parts);
    if (found === undefined) {
      throw new Error(`Unresolved token reference: ${alias}`);
    }
    const resolvedRaw =
      typeof found === 'object' && found !== null && '$value' in found
        ? (found as Record<string, JsonValue>).$value
        : found;
    return resolveValue(resolvedRaw as JsonValue, lookup, nextVisited);
  }
  if (Array.isArray(val)) {
    return val.map(item => resolveValue(item, lookup, visited));
  }
  if (typeof val === 'object' && val !== null) {
    if ('$value' in val && Object.keys(val).some(k => k.startsWith('$'))) {
      return resolveValue((val as Record<string, JsonValue>).$value as JsonValue, lookup, visited);
    }
    const res: Record<string, JsonValue> = {};
    for (const key of Object.keys(val)) {
      res[key] = resolveValue(
        (val as Record<string, JsonValue>)[key] as JsonValue,
        lookup,
        visited
      );
    }
    return res;
  }
  return val;
}

function cleanPrimitives(primitives: TokenDict): TokenDict {
  const result: TokenDict = {};
  for (const [key, val] of Object.entries(primitives)) {
    result[key] = resolveValue(val, primitives);
  }
  return result;
}

export function buildTokens(isCheckOnly = false): boolean {
  const primitives = loadAllPrimitives();
  const lightSemantic = (readJsonFile(path.join(SEMANTIC_DIR, 'light.json')).semantic ??
    {}) as TokenDict;
  const darkSemantic = (readJsonFile(path.join(SEMANTIC_DIR, 'dark.json')).semantic ??
    {}) as TokenDict;
  const components = loadAllComponents();

  const cleanedPrimitives = cleanPrimitives(primitives);

  // Light theme lookup
  const lightLookup: TokenDict = {
    ...primitives,
    semantic: lightSemantic,
  };
  const resolvedLightSemantic = resolveValue(lightSemantic, lightLookup) as TokenDict;
  lightLookup.semantic = resolvedLightSemantic;
  const resolvedLightComponents = resolveValue(components, lightLookup) as TokenDict;

  // Dark theme lookup
  const darkLookup: TokenDict = {
    ...primitives,
    semantic: darkSemantic,
  };
  const resolvedDarkSemantic = resolveValue(darkSemantic, darkLookup) as TokenDict;
  darkLookup.semantic = resolvedDarkSemantic;
  const resolvedDarkComponents = resolveValue(components, darkLookup) as TokenDict;

  const lightColorSemantic = (resolvedLightSemantic.color ?? {}) as TokenDict;
  const darkColorSemantic = (resolvedDarkSemantic.color ?? {}) as TokenDict;

  const lightTheme = {
    mode: 'light',
    colors: {
      ...lightColorSemantic,
      palette: cleanedPrimitives.color,
    },
    spacing: cleanedPrimitives.spacing,
    radius: cleanedPrimitives.radius,
    borderWidth: cleanedPrimitives.borderWidth,
    typography: cleanedPrimitives.typography,
    shadow: cleanedPrimitives.shadow,
    opacity: cleanedPrimitives.opacity,
    zIndex: cleanedPrimitives.zIndex,
    breakpoints: cleanedPrimitives.breakpoints,
    motion: cleanedPrimitives.motion,
    components: resolvedLightComponents,
  };

  const darkTheme = {
    mode: 'dark',
    colors: {
      ...darkColorSemantic,
      palette: cleanedPrimitives.color,
    },
    spacing: cleanedPrimitives.spacing,
    radius: cleanedPrimitives.radius,
    borderWidth: cleanedPrimitives.borderWidth,
    typography: cleanedPrimitives.typography,
    shadow: cleanedPrimitives.shadow,
    opacity: cleanedPrimitives.opacity,
    zIndex: cleanedPrimitives.zIndex,
    breakpoints: cleanedPrimitives.breakpoints,
    motion: cleanedPrimitives.motion,
    components: resolvedDarkComponents,
  };

  const typesContent = `/**
 * Shani DS - Generated Design System Token Types
 * DO NOT EDIT DIRECTLY. Generated via \`pnpm tokens:build\`.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorActionState {
  default: string;
  pressed: string;
  disabled: string;
  text: string;
  textDisabled: string;
  border?: string;
  borderPressed?: string;
}

export interface FeedbackTokenGroup {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

export interface ThemeColors {
  bg: {
    canvas: string;
    surface: string;
    surfaceRaised: string;
    surfaceOverlay: string;
    muted: string;
    subtle: string;
    inverse: string;
    brand: string;
    brandSubtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
    brand: string;
    brandEmphasized: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    brand: string;
    focus: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  action: {
    primary: ColorActionState;
    secondary: ColorActionState;
    danger: ColorActionState;
  };
  feedback: {
    success: FeedbackTokenGroup;
    warning: FeedbackTokenGroup;
    danger: FeedbackTokenGroup;
    info: FeedbackTokenGroup;
  };
  palette: {
    brand: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    neutral: Record<'0' | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950' | '1000', string>;
    success: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    warning: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    danger: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    info: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
    partner: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;
  };
}

export type SpacingKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '12' | '14' | '16' | '20' | '24';
export type SpacingScale = Record<SpacingKey, number>;
export type RadiusScale = Record<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full', number>;
export type BorderWidthScale = Record<'none' | 'hairline' | 'thin' | 'medium' | 'thick' | 'heavy', number>;

export interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export type ShadowScale = Record<'none' | 'sm' | 'md' | 'lg' | 'xl', ShadowToken>;
export type OpacityScale = Record<'0' | 'faint' | 'subtle' | 'muted' | 'medium' | 'strong' | 'full', number>;
export type ZIndexScale = Record<'deep' | 'base' | 'docked' | 'dropdown' | 'sticky' | 'banner' | 'overlay' | 'modal' | 'popover' | 'toast' | 'tooltip', number>;
export type BreakpointScale = Record<'phone' | 'tablet' | 'desktop' | 'wide', number>;

export interface MotionDurationScale {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  crawl: number;
}

export interface MotionSpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
}

export interface MotionTokens {
  duration: MotionDurationScale;
  easing: {
    standard: [number, number, number, number];
    accelerate: [number, number, number, number];
    decelerate: [number, number, number, number];
    linear: [number, number, number, number];
  };
  spring: Record<'default' | 'snappy' | 'bouncier' | 'gentle', MotionSpringConfig>;
}

export type FontWeightValue = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl', number>;
  lineHeight: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl', number>;
  fontWeight: Record<'regular' | 'medium' | 'semibold' | 'bold', FontWeightValue>;
  letterSpacing: Record<'tight' | 'normal' | 'wide' | 'wider', number>;
}

export interface ComponentTokens {
  button: {
    primary: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
    secondary: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      border: string;
      borderPressed: string;
      text: string;
      textDisabled: string;
    };
    danger: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
    tertiary: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
    ghost: {
      bg: string;
      bgPressed: string;
      bgDisabled: string;
      text: string;
      textDisabled: string;
    };
    size: Record<
      'sm' | 'md' | 'lg',
      {
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        gap: number;
        fontSize: number;
        iconSize: number;
      }
    >;
  };
  input: {
    bg: string;
    bgDisabled: string;
    border: {
      default: string;
      focus: string;
      error: string;
      disabled: string;
    };
    text: {
      value: string;
      placeholder: string;
      label: string;
      helper: string;
      error: string;
      disabled: string;
    };
    size: Record<
      'sm' | 'md' | 'lg',
      {
        minHeight: number;
        paddingHorizontal: number;
        paddingVertical: number;
        gap: number;
        fontSize: number;
        iconSize: number;
      }
    >;
  };
  checkbox: {
    bg: {
      default: string;
      checked: string;
      disabled: string;
    };
    border: {
      default: string;
      focus: string;
      checked: string;
      disabled: string;
    };
    icon: {
      checked: string;
      disabled: string;
    };
    size: Record<
      'sm' | 'md' | 'lg',
      {
        boxSize: number;
        iconSize: number;
        fontSize: number;
        minTouchTarget: number;
      }
    >;
  };
  badge: {
    neutral: { bg: string; text: string };
    brand: { bg: string; text: string };
    success: { bg: string; text: string };
    warning: { bg: string; text: string };
    danger: { bg: string; text: string };
    info: { bg: string; text: string };
    size: Record<
      'sm' | 'md',
      {
        paddingHorizontal: number;
        paddingVertical: number;
        fontSize: number;
        iconSize: number;
      }
    >;
  };
  card: {
    bg: string;
    bgElevated: string;
    bgFilled: string;
    border: string;
    padding: Record<'sm' | 'md' | 'lg', number>;
  };
  timeline: {
    indicator: {
      size: number;
      borderWidth: number;
    };
    line: {
      width: number;
      color: {
        completed: string;
        upcoming: string;
      };
    };
    dot: {
      completed: {
        bg: string;
        icon: string;
      };
      current: {
        bg: string;
        border: string;
        center: string;
      };
      upcoming: {
        bg: string;
        border: string;
      };
    };
  };
  icon: {
    size: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  };
  switch: {
    track: {
      width: number;
      height: number;
      padding: number;
      bgActive: string;
      bgInactive: string;
      bgDisabledActive: string;
      bgDisabledInactive: string;
    };
    thumb: {
      size: number;
      offset: number;
      bg: string;
      bgDisabled: string;
    };
    minTouchTarget: number;
  };
}

export interface ThemeTokens {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: SpacingScale;
  radius: RadiusScale;
  borderWidth: BorderWidthScale;
  typography: TypographyTokens;
  shadow: ShadowScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  breakpoints: BreakpointScale;
  motion: MotionTokens;
  components: ComponentTokens;
}

export interface PrimitivesTokens {
  color: ThemeColors['palette'];
  spacing: SpacingScale;
  radius: RadiusScale;
  borderWidth: BorderWidthScale;
  typography: TypographyTokens;
  shadow: ShadowScale;
  opacity: OpacityScale;
  zIndex: ZIndexScale;
  breakpoints: BreakpointScale;
  motion: MotionTokens;
}
`;

  const lightTsContent = `/**
 * Shani DS - Light Theme Tokens
 * DO NOT EDIT DIRECTLY. Generated via \`pnpm tokens:build\`.
 */
import type { ThemeTokens } from './types';

export const lightTheme: ThemeTokens = ${JSON.stringify(lightTheme, null, 2)} as const;
`;

  const darkTsContent = `/**
 * Shani DS - Dark Theme Tokens
 * DO NOT EDIT DIRECTLY. Generated via \`pnpm tokens:build\`.
 */
import type { ThemeTokens } from './types';

export const darkTheme: ThemeTokens = ${JSON.stringify(darkTheme, null, 2)} as const;
`;

  const tokensExportJson = {
    light: lightTheme,
    dark: darkTheme,
    primitives: cleanedPrimitives,
  };
  const jsonContent = JSON.stringify(tokensExportJson, null, 2) + '\n';

  const filesToWrite = [
    { filePath: path.join(GENERATED_DIR, 'types.ts'), content: typesContent },
    { filePath: path.join(GENERATED_DIR, 'light.ts'), content: lightTsContent },
    { filePath: path.join(GENERATED_DIR, 'dark.ts'), content: darkTsContent },
    { filePath: path.join(GENERATED_DIR, 'tokens.json'), content: jsonContent },
  ];

  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  if (isCheckOnly) {
    let hasDrift = false;
    for (const file of filesToWrite) {
      if (!fs.existsSync(file.filePath)) {
        console.error(`Missing generated file: ${file.filePath}`);
        hasDrift = true;
        continue;
      }
      const existing = fs.readFileSync(file.filePath, 'utf-8');
      if (existing !== file.content) {
        console.error(`Token drift detected in: ${path.basename(file.filePath)}`);
        hasDrift = true;
      }
    }
    if (hasDrift) {
      console.error('\n❌ Token drift check failed! Generated tokens do not match JSON sources.');
      console.error('Run "pnpm tokens:build" and commit the updated generated files.');
      return false;
    }
    console.log('✓ Token files are up to date. No drift detected.');
    return true;
  }

  for (const file of filesToWrite) {
    fs.writeFileSync(file.filePath, file.content, 'utf-8');
    console.log(`✓ Generated: ${path.relative(ROOT_DIR, file.filePath)}`);
  }
  console.log('✨ All tokens generated successfully.');
  return true;
}

if (require.main === module) {
  const isCheck = process.argv.includes('--check');
  const success = buildTokens(isCheck);
  if (!success) {
    process.exit(1);
  }
}
