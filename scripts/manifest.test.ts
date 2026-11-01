import fs from 'node:fs';
import path from 'node:path';
import { generateManifest } from './generate-manifest';
import { checkAllSnippets } from './check-snippets';

describe('Component Manifest Generator (Step 5.2)', () => {
  const manifestPath = path.resolve(__dirname, '../packages/ui/components.json');

  it('verifies that packages/ui/components.json exists on disk', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('verifies that packages/ui/components.json is identical to generateManifest() output', () => {
    const generated = generateManifest();
    const formatted = JSON.stringify(generated, null, 2) + '\n';
    const onDisk = fs.readFileSync(manifestPath, 'utf-8');
    expect(onDisk).toBe(formatted);
  });

  it('documents all 22 exported components with complete metadata', () => {
    const manifest = generateManifest();
    expect(manifest.components.length).toBe(22);

    const expectedComponents = [
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
    ];

    for (const name of expectedComponents) {
      const comp = manifest.components.find((c) => c.name === name);
      expect(comp).toBeDefined();
      expect(comp?.importPath).toBe('@shani/ui');
      expect(comp?.description.length).toBeGreaterThan(10);
      expect(['Foundation', 'Actions', 'Forms', 'Display']).toContain(comp?.category);
      expect(comp?.whenToUse.length).toBeGreaterThanOrEqual(1);
      expect(comp?.whenNotToUse.length).toBeGreaterThanOrEqual(1);
      expect(comp?.accessibilityNotes.length).toBeGreaterThanOrEqual(1);
      expect(comp?.example).toContain('@shani/ui');
      expect(comp?.props.length).toBeGreaterThan(0);

      // Verify each prop
      for (const prop of comp!.props) {
        expect(prop.name).toBeTruthy();
        expect(prop.type).toBeTruthy();
        expect(typeof prop.required).toBe('boolean');
        expect(prop.description).toBeTruthy();
        expect(prop.example).toBeTruthy();
      }
    }
  });

  it('compiles all component code snippets against real TypeScript types without errors', () => {
    const { totalSnippets, hasErrors, results } = checkAllSnippets();
    expect(totalSnippets).toBeGreaterThanOrEqual(19);
    if (hasErrors) {
      const failing = results.filter((r) => r.diagnostics.length > 0);
      console.error('Failing snippets:', failing);
    }
    expect(hasErrors).toBe(false);
  });
});

