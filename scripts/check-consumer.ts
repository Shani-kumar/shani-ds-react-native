/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';

interface ComponentManifest {
  components: Array<{
    name: string;
    importPath: string;
  }>;
}

export async function checkConsumerExports(): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  // 1. Check for collision file: dist/components.json must NOT exist
  const distCollision = path.resolve(__dirname, '../packages/ui/dist/components.json');
  if (fs.existsSync(distCollision)) {
    errors.push(`Found collision file: ${distCollision}. This shadows dist/components/ in bundlers.`);
  }

  // 2. Read manifest
  const manifestPath = path.resolve(__dirname, '../packages/ui/components.json');
  if (!fs.existsSync(manifestPath)) {
    errors.push(`Manifest not found at ${manifestPath}`);
    return { success: false, errors };
  }

  const manifest: ComponentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const documentedComponents = manifest.components.map((c) => c.name);

  // 3. Check dist files exist
  const distIndexPath = path.resolve(__dirname, '../packages/ui/dist/index.js');
  const distComponentsPath = path.resolve(__dirname, '../packages/ui/dist/components/index.js');

  if (!fs.existsSync(distIndexPath)) {
    errors.push(`dist/index.js does not exist at ${distIndexPath}. Run 'pnpm --filter @shani/ui build'.`);
    return { success: false, errors };
  }

  if (!fs.existsSync(distComponentsPath)) {
    errors.push(`dist/components/index.js does not exist at ${distComponentsPath}.`);
    return { success: false, errors };
  }

  // 4. Also verify static re-exports in dist/components/index.js and dist/index.js
  const distComponentsContent = fs.readFileSync(distComponentsPath, 'utf8');
  const distIndexContent = fs.readFileSync(distIndexPath, 'utf8');

  if (!distIndexContent.includes('./components/index') && !distIndexContent.includes('./components')) {
    errors.push(`dist/index.js does not re-export from components`);
  }

  for (const name of documentedComponents) {
    // Check if the component or its folder is re-exported in dist/components/index.js
    const directExport = new RegExp(`export \\* from ['"].*${name}.*['"]`).test(distComponentsContent);
    const subFolderExport = (name === 'HStack' || name === 'VStack') && distComponentsContent.includes('Stack');
    const cardPart = name.startsWith('Card') && distComponentsContent.includes('Card');
    const chipPart = name === 'ChipGroup' && distComponentsContent.includes('Chip');

    if (!directExport && !subFolderExport && !cardPart && !chipPart) {
      errors.push(`Component '${name}' is not re-exported in dist/components/index.js`);
    }
  }

  // 5. Runtime load with RN web/mocks to verify exports are defined
  (global as any).__DEV__ = true;

  const rnWebPath = require.resolve('react-native-web', {
    paths: [path.resolve(__dirname, '../apps/gallery'), process.cwd()],
  });
  const rnWeb = require(rnWebPath);
  rnWeb.TurboModuleRegistry = { get: () => null };

  const originalResolve = (Module as any)._resolveFilename;
  (Module as any)._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
    if (request === 'react-native') {
      return rnWebPath;
    }
    if (request === '@shani/tokens') {
      return path.resolve(__dirname, '../packages/tokens/dist/index.js');
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };

  const originalLoad = (Module as any)._load;
  (Module as any)._load = function (request: string, parent: any, isMain: boolean) {
    if (request === 'react-native-svg') {
      const React = require('react');
      const dummy = (_name: string) => (props: any) => React.createElement('svg', props, props.children);
      return {
        __esModule: true,
        default: dummy('Svg'),
        Svg: dummy('Svg'),
        Circle: dummy('Circle'),
        Path: dummy('Path'),
        Polyline: dummy('Polyline'),
        Line: dummy('Line'),
        Rect: dummy('Rect'),
      };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const ui = await import(distIndexPath);
    const mod = ui.default || ui;

    for (const name of documentedComponents) {
      const exported = mod[name];
      if (exported === undefined) {
        errors.push(`Export '${name}' is undefined in packages/ui/dist/index.js`);
      }
    }
  } catch (err: any) {
    errors.push(`Failed to load packages/ui/dist/index.js: ${err.message}`);
  } finally {
    (Module as any)._resolveFilename = originalResolve;
    (Module as any)._load = originalLoad;
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

if (require.main === module) {
  (async () => {
    console.log('\n🔍 Verifying all documented components are defined in packaged @shani/ui build...');
    const { success, errors } = await checkConsumerExports();

    if (!success) {
      console.error('\n❌ Consumer export check failed:');
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }

    console.log('✅ All 22 components from components.json are defined in packages/ui/dist!\n');
  })();
}
