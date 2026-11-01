import fs from 'node:fs';
import path from 'node:path';
import * as docgen from 'react-docgen-typescript';
import { COMPONENT_METADATA } from './manifest-metadata';

export interface ComponentPropDoc {
  name: string;
  type: string;
  allowedValues?: string[];
  defaultValue?: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface ComponentDoc {
  name: string;
  importPath: string;
  description: string;
  category: 'Foundation' | 'Actions' | 'Forms' | 'Display';
  variants?: string[];
  sizes?: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  accessibilityNotes: string[];
  props: ComponentPropDoc[];
  example: string;
}

export interface DesignSystemManifest {
  name: string;
  version: string;
  description: string;
  components: ComponentDoc[];
}

const COMPONENT_FILES = [
  'Box/Box.tsx',
  'Stack/Stack.tsx',
  'Divider/Divider.tsx',
  'Text/Text.tsx',
  'Icon/Icon.tsx',
  'Button/Button.tsx',
  'Button/IconButton.tsx',
  'TextField/TextField.tsx',
  'Checkbox/Checkbox.tsx',
  'Switch/Switch.tsx',
  'Card/Card.tsx',
  'Badge/Badge.tsx',
  'Skeleton/Skeleton.tsx',
  'Timeline/Timeline.tsx',
];

export function generateManifest(): DesignSystemManifest {
  const tsconfigPath = path.resolve(__dirname, '../packages/ui/tsconfig.json');
  const parserOptions: docgen.ParserOptions = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      if (prop.parent && prop.parent.fileName.includes('node_modules')) return false;
      return true;
    },
  };

  const parser = docgen.withCustomConfig(tsconfigPath, parserOptions);
  const componentsDir = path.resolve(__dirname, '../packages/ui/src/components');

  const componentsMap = new Map<string, docgen.ComponentDoc>();

  for (const fileRel of COMPONENT_FILES) {
    const filePath = path.join(componentsDir, fileRel);
    const parsed = parser.parse(filePath);
    for (const comp of parsed) {
      componentsMap.set(comp.displayName, comp);
    }
  }

  // Desired ordering of components
  const orderedComponentNames = [
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
  ];

  const components: ComponentDoc[] = [];

  for (const name of orderedComponentNames) {
    const parsed = componentsMap.get(name);
    if (!parsed) {
      throw new Error(`Component "${name}" was not found by react-docgen-typescript parser.`);
    }

    const staticMeta = COMPONENT_METADATA[name];
    if (!staticMeta) {
      throw new Error(`Missing static metadata in COMPONENT_METADATA for component "${name}".`);
    }

    // Process props
    const propsList: ComponentPropDoc[] = [];
    let extractedVariants: string[] | undefined;
    let extractedSizes: string[] | undefined;

    for (const [propName, propInfo] of Object.entries(parsed.props)) {
      let allowedValues: string[] | undefined;

      if (
        propInfo.type &&
        propInfo.type.name === 'enum' &&
        Array.isArray(propInfo.type.value) &&
        propInfo.type.value.length > 0
      ) {
        // Extract string literal values
        const stringValues = propInfo.type.value
          .map((v: { value: string }) => {
            const rawVal = String(v.value);
            return rawVal.replace(/^['"]|['"]$/g, '');
          })
          .filter((v: string) => !v.includes('|') && v !== 'undefined' && v !== 'null');

        if (stringValues.length > 0) {
          allowedValues = stringValues;
        }
      }

      if (propName === 'variant' && allowedValues) {
        extractedVariants = allowedValues;
      }
      if (propName === 'size' && allowedValues) {
        extractedSizes = allowedValues;
      }

      let defaultValue: string | undefined;
      if (propInfo.defaultValue && propInfo.defaultValue.value !== undefined) {
        defaultValue = String(propInfo.defaultValue.value).replace(/^['"]|['"]$/g, '');
      }

      const propDoc: ComponentPropDoc = {
        name: propName,
        type: propInfo.type?.raw || propInfo.type?.name || 'unknown',
        ...(allowedValues && allowedValues.length > 0 && { allowedValues }),
        ...(defaultValue !== undefined && { defaultValue }),
        required: Boolean(propInfo.required),
        description: propInfo.description || '',
        example: staticMeta.propExamples?.[propName] || `${propName}={...}`,
      };

      propsList.push(propDoc);
    }

    const compDoc: ComponentDoc = {
      name,
      importPath: '@shani/ui',
      description: staticMeta.description,
      category: staticMeta.category,
      ...(extractedVariants && extractedVariants.length > 0 && { variants: extractedVariants }),
      ...(extractedSizes && extractedSizes.length > 0 && { sizes: extractedSizes }),
      whenToUse: staticMeta.whenToUse,
      whenNotToUse: staticMeta.whenNotToUse,
      accessibilityNotes: staticMeta.accessibilityNotes,
      props: propsList,
      example: staticMeta.example,
    };

    components.push(compDoc);
  }

  return {
    name: '@shani/ui',
    version: '0.1.0',
    description:
      'Machine-readable and developer-facing metadata manifest for Shani Design System components',
    components,
  };
}

if (require.main === module) {
  const isCheck = process.argv.includes('--check');
  const targetPath = path.resolve(__dirname, '../packages/ui/components.json');

  console.log(`\n📋 Generating Shani DS Component Manifest (${isCheck ? 'check mode' : 'write mode'})...`);

  try {
    const manifest = generateManifest();
    const formattedJson = JSON.stringify(manifest, null, 2) + '\n';
    const distTargetPath = path.resolve(__dirname, '../packages/ui/dist/components.json');

    if (isCheck) {
      if (!fs.existsSync(targetPath)) {
        console.error(`\n❌ Manifest check failed: ${targetPath} does not exist.`);
        console.error(`   Run 'pnpm manifest' to generate it.\n`);
        process.exit(1);
      }

      const existingContent = fs.readFileSync(targetPath, 'utf-8');
      if (existingContent !== formattedJson) {
        console.error(`\n❌ Manifest check failed: packages/ui/components.json is out of date with component source files.`);
        console.error(`   Run 'pnpm manifest' to regenerate.\n`);
        process.exit(1);
      }

      if (fs.existsSync(distTargetPath)) {
        const distContent = fs.readFileSync(distTargetPath, 'utf-8');
        if (distContent !== formattedJson) {
          console.error(`\n❌ Manifest check failed: packages/ui/dist/components.json is out of date with packages/ui/components.json.`);
          console.error(`   Run 'pnpm --filter @shani/ui build' to rebuild the package.\n`);
          process.exit(1);
        }
      }

      console.log(`  ✓ packages/ui/components.json is up to date (${manifest.components.length} components verified).\n`);
    } else {
      fs.writeFileSync(targetPath, formattedJson, 'utf-8');
      console.log(`  ✓ Wrote packages/ui/components.json (${manifest.components.length} components documented).\n`);

      if (fs.existsSync(path.dirname(distTargetPath))) {
        fs.writeFileSync(distTargetPath, formattedJson, 'utf-8');
        console.log(`  ✓ Synchronized packages/ui/dist/components.json.\n`);
      }
    }
  } catch (err) {
    console.error('\n❌ Failed to generate component manifest:', err);
    process.exit(1);
  }
}

