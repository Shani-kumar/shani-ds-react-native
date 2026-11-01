import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ScreenValidator, runValidation } from '../packages/ui/src/cli/validate';

describe('shani-ds validate (Step 5.6 Item 3)', () => {
  let tempDir: string;
  let mockPackageDir: string;
  let mockManifestPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shani-validate-test-'));
    mockPackageDir = path.join(tempDir, 'node_modules', '@shani', 'ui');
    fs.mkdirSync(mockPackageDir, { recursive: true });

    // Copy real components.json into mock installed package
    const realManifest = path.resolve(__dirname, '../packages/ui/components.json');
    mockManifestPath = path.join(mockPackageDir, 'components.json');
    fs.copyFileSync(realManifest, mockManifestPath);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('reads components.json from the simulated installed package location', () => {
    const validator = new ScreenValidator(mockManifestPath);
    expect(validator.getResolvedManifestPath()).toBe(mockManifestPath);
  });

  it('validates a valid screen using the installed package manifest with 0 violations', () => {
    const validScreenCode = `
import React from 'react';
import { Box, VStack, Text, Button } from '@shani/ui';

export function ValidScreen() {
  return (
    <Box p="4">
      <VStack spacing="3">
        <Text variant="heading">Shipment #123</Text>
        <Button variant="primary" size="md" onPress={() => {}}>
          Confirm
        </Button>
      </VStack>
    </Box>
  );
}
`;
    const screenPath = path.join(tempDir, 'ValidScreen.tsx');
    fs.writeFileSync(screenPath, validScreenCode, 'utf-8');

    const result = runValidation(screenPath, mockManifestPath);
    expect(result.totalFiles).toBe(1);
    expect(result.totalViolations).toBe(0);
    expect(result.results[0]?.valid).toBe(true);
  });

  it('detects violations using the installed package manifest and reports line/category', () => {
    const invalidScreenCode = `
import React from 'react';
import { View, Text as RNText } from 'react-native';
import { Button } from '@shani/ui';

export function InvalidScreen() {
  return (
    <View style={{ backgroundColor: '#1D4ED8', padding: 16 }}>
      <RNText>Raw RN Text</RNText>
      <Button variant="invalid_variant" size="md">
        Button
      </Button>
    </View>
  );
}
`;
    const screenPath = path.join(tempDir, 'InvalidScreen.tsx');
    fs.writeFileSync(screenPath, invalidScreenCode, 'utf-8');

    const result = runValidation(screenPath, mockManifestPath);
    expect(result.totalViolations).toBeGreaterThan(0);
    expect(result.results[0]?.valid).toBe(false);

    const categories = result.results[0]?.violations.map((v) => v.category);
    expect(categories).toContain('forbidden-import');
    expect(categories).toContain('raw-hex-color');
    expect(categories).toContain('raw-numeric-style');
    expect(categories).toContain('invalid-prop-value');
  });
});

