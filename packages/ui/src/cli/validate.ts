import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') return __dirname;
  return process.cwd();
};

export interface Violation {
  file: string;
  line: number;
  column: number;
  category:
    | 'forbidden-import'
    | 'raw-hex-color'
    | 'raw-numeric-style'
    | 'unknown-component'
    | 'unknown-prop'
    | 'invalid-prop-value';
  message: string;
  hint: string;
}

export interface ValidationResult {
  file: string;
  violations: Violation[];
  valid: boolean;
}

interface ComponentPropDef {
  name: string;
  type: string;
  allowedValues?: string[];
  required: boolean;
}

interface ComponentDef {
  name: string;
  props: Map<string, ComponentPropDef>;
}

// Spacing & geometry style property names
const SPACING_PROPS = new Set([
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'gap',
  'rowGap',
  'columnGap',
]);

const RADIUS_PROPS = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
]);

const TYPOGRAPHY_PROPS = new Set(['fontSize', 'lineHeight']);

const FORBIDDEN_RN_IMPORTS = new Set(['Pressable', 'TextInput', 'Button', 'Text']);

const KNOWN_UI_EXPORTS = new Set([
  // Components
  'Box',
  'Stack',
  'HStack',
  'VStack',
  'Divider',
  'Text',
  'Icon',
  'Button',
  'IconButton',
  'TextField',
  'Checkbox',
  'Switch',
  'Card',
  'CardHeader',
  'CardContent',
  'CardFooter',
  'Badge',
  'Skeleton',
  'Timeline',
  'Chip',
  'ChipGroup',
  'QuantityStepper',
  // Hooks
  'useTheme',
  'useStyles',
  'useResponsive',
  'usePressable',
  'useTextField',
  'useToggle',
  'useDisclosure',
  'useSelection',
  'useCounter',
  // Theme & Utilities
  'createTheme',
  'lightTheme',
  'darkTheme',
  'ThemeProvider',
  'ThemeContext',
]);

const STANDARD_JSX_PROPS = new Set(['key', 'ref', 'children', 'testID', 'style', 'contentContainerStyle']);

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_OR_HSL_REGEX = /^(rgba?|hsla?)\(/i;

export class ScreenValidator {
  private components = new Map<string, ComponentDef>();
  private manifestPath: string;

  constructor(customManifestPath?: string) {
    this.manifestPath = this.resolveManifestPath(customManifestPath);
    this.loadManifest();
  }

  private resolveManifestPath(customPath?: string): string {
    if (customPath && fs.existsSync(customPath)) {
      return path.resolve(customPath);
    }

    const baseDir = getDirname();
    const candidatePaths = [
      // 0. Environment variable passed from CLI launcher
      process.env.SHANI_MANIFEST_PATH,
      // 1. Installed package root: node_modules/@shani/ui/components.json
      path.resolve(baseDir, '../../components.json'),
      // 2. Fallback relative to package src: packages/ui/components.json
      path.resolve(baseDir, '../components.json'),
      // 3. Current working directory node_modules:
      path.resolve(process.cwd(), 'node_modules/@shani/ui/components.json'),
      // 4. Monorepo repo root relative path:
      path.resolve(baseDir, '../../../packages/ui/components.json'),
    ].filter((p): p is string => Boolean(p));

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    throw new Error(
      `Could not locate Shani DS 'components.json'. Ensure @shani/ui is installed or specify --manifest <path>. Searched: ${candidatePaths.join(', ')}`
    );
  }

  public getResolvedManifestPath(): string {
    return this.manifestPath;
  }

  private loadManifest() {
    const raw = JSON.parse(fs.readFileSync(this.manifestPath, 'utf-8'));
    for (const comp of raw.components) {
      const propsMap = new Map<string, ComponentPropDef>();
      for (const p of comp.props) {
        propsMap.set(p.name, {
          name: p.name,
          type: p.type,
          allowedValues: p.allowedValues,
          required: p.required,
        });
      }
      this.components.set(comp.name, {
        name: comp.name,
        props: propsMap,
      });
    }
  }

  public validateSource(filePath: string, sourceText: string): ValidationResult {
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    const violations: Violation[] = [];

    const addViolation = (
      node: ts.Node,
      category: Violation['category'],
      message: string,
      hint: string
    ) => {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({
        file: filePath,
        line: line + 1,
        column: character + 1,
        category,
        message,
        hint,
      });
    };

    const visit = (node: ts.Node) => {
      // 1. Check imports from 'react-native'
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;

        if (moduleSpecifier === 'react-native' && node.importClause?.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            for (const element of node.importClause.namedBindings.elements) {
              const importedName = element.propertyName
                ? element.propertyName.text
                : element.name.text;

              if (FORBIDDEN_RN_IMPORTS.has(importedName)) {
                let hint = `Use corresponding component from '@shani/ui'.`;
                if (importedName === 'Text') {
                  hint = `Import Text from '@shani/ui' (<Text variant="...">).`;
                } else if (importedName === 'TextInput') {
                  hint = `Import TextField from '@shani/ui' (<TextField label="...">).`;
                } else if (importedName === 'Button') {
                  hint = `Import Button or IconButton from '@shani/ui'.`;
                } else if (importedName === 'Pressable') {
                  hint = `Import Button or IconButton from '@shani/ui', or use usePressable primitive.`;
                }

                addViolation(
                  element,
                  'forbidden-import',
                  `Forbidden import of '${importedName}' from 'react-native'.`,
                  hint
                );
              }
            }
          }
        }

        // 2. Check imports from '@shani/ui' (unknown/hallucinated components)
        if (moduleSpecifier === '@shani/ui' && node.importClause?.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            for (const element of node.importClause.namedBindings.elements) {
              if (element.isTypeOnly || node.importClause.isTypeOnly) continue;

              const importedName = element.propertyName
                ? element.propertyName.text
                : element.name.text;

              if (/^[A-Z]/.test(importedName)) {
                if (!KNOWN_UI_EXPORTS.has(importedName)) {
                  addViolation(
                    element,
                    'unknown-component',
                    `Component '${importedName}' does not exist in '@shani/ui'.`,
                    `Supported components: ${Array.from(this.components.keys()).join(', ')}`
                  );
                }
              }
            }
          }
        }
      }

      // 3. Check raw hex or rgb/hsl colors in string literals
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const text = node.text.trim();
        if (HEX_COLOR_REGEX.test(text) || RGB_OR_HSL_REGEX.test(text)) {
          addViolation(
            node,
            'raw-hex-color',
            `Raw color code '${text}' detected.`,
            `Use semantic theme tokens via 'theme.colors.*' or component color props.`
          );
        }
      }

      // 4. Check raw numeric values in style object properties
      if (ts.isPropertyAssignment(node)) {
        const propName = node.name.getText();
        const isSpacing = SPACING_PROPS.has(propName);
        const isRadius = RADIUS_PROPS.has(propName);
        const isTypography = TYPOGRAPHY_PROPS.has(propName);

        if (isSpacing || isRadius || isTypography) {
          if (ts.isNumericLiteral(node.initializer)) {
            const num = Number(node.initializer.text);
            if (num !== 0) {
              let hint = `Use tokenized prop or theme scale.`;
              if (isSpacing) {
                hint = `Use spacing props on Box/Stack (e.g. spacing="4", p="4") or theme.spacing[*] token.`;
              } else if (isRadius) {
                hint = `Use borderRadius prop on Box (e.g. borderRadius="md") or theme.radius.* token.`;
              } else if (isTypography) {
                hint = `Use Text variant prop (e.g. variant="heading", variant="body") instead of raw fontSize/lineHeight.`;
              }

              addViolation(
                node,
                'raw-numeric-style',
                `Raw numeric value '${num}' used for '${propName}' in style object.`,
                hint
              );
            }
          }
        }
      }

      // 5. Check JSX Elements: unknown props and invalid enum values
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tagName = node.tagName.getText();
        const compDef = this.components.get(tagName);

        if (compDef) {
          for (const attr of node.attributes.properties) {
            if (ts.isJsxAttribute(attr)) {
              const attrName = attr.name.getText();

              const propDef = compDef.props.get(attrName);
              const isStandard = STANDARD_JSX_PROPS.has(attrName);

              if (!propDef && !isStandard) {
                const allowed = Array.from(compDef.props.keys()).slice(0, 8).join(', ');
                addViolation(
                  attr,
                  'unknown-prop',
                  `Prop '${attrName}' does not exist on component '<${tagName}>'.`,
                  `Allowed props on <${tagName}> include: ${allowed}...`
                );
              } else if (propDef && propDef.allowedValues && propDef.allowedValues.length > 0) {
                if (attr.initializer && ts.isStringLiteral(attr.initializer)) {
                  const val = attr.initializer.text;
                  if (!propDef.allowedValues.includes(val)) {
                    addViolation(
                      attr,
                      'invalid-prop-value',
                      `Invalid value '${val}' for prop '${attrName}' on '<${tagName}>'.`,
                      `Allowed values: ${propDef.allowedValues.map((v) => `'${v}'`).join(' | ')}`
                    );
                  }
                }
              }
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return {
      file: filePath,
      violations,
      valid: violations.length === 0,
    };
  }

  public validateFile(filePath: string): ValidationResult {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    const text = fs.readFileSync(fullPath, 'utf-8');
    return this.validateSource(fullPath, text);
  }

  public validateDirectory(dirPath: string): ValidationResult[] {
    const results: ValidationResult[] = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.expo') {
          results.push(...this.validateDirectory(full));
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        results.push(this.validateFile(full));
      }
    }

    return results;
  }
}

export function runValidation(
  targetPath: string,
  manifestPath?: string
): {
  totalFiles: number;
  totalViolations: number;
  results: ValidationResult[];
  manifestPath: string;
} {
  const validator = new ScreenValidator(manifestPath);
  const fullTarget = path.resolve(targetPath);

  let results: ValidationResult[] = [];

  if (!fs.existsSync(fullTarget)) {
    throw new Error(`Target path does not exist: ${fullTarget}`);
  }

  const stat = fs.statSync(fullTarget);
  if (stat.isDirectory()) {
    results = validator.validateDirectory(fullTarget);
  } else {
    results = [validator.validateFile(fullTarget)];
  }

  const totalViolations = results.reduce((acc, r) => acc + r.violations.length, 0);

  return {
    totalFiles: results.length,
    totalViolations,
    results,
    manifestPath: validator.getResolvedManifestPath(),
  };
}
