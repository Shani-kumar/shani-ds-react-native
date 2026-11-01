import path from 'node:path';
import { ScreenValidator, runValidation } from './validate-screen';

describe('Screen AST Validator (Step 5.4)', () => {
  const validator = new ScreenValidator();
  const fixturesDir = path.resolve(__dirname, '__fixtures__');

  it('validates valid-screen.tsx with 0 violations', () => {
    const validFile = path.join(fixturesDir, 'valid-screen.tsx');
    const result = validator.validateFile(validFile);

    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('detects all expected rule violations in failing-screen.tsx', () => {
    const failingFile = path.join(fixturesDir, 'failing-screen.tsx');
    const result = validator.validateFile(failingFile);

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThanOrEqual(10);

    const categories = result.violations.map((v) => v.category);
    expect(categories).toContain('forbidden-import');
    expect(categories).toContain('unknown-component');
    expect(categories).toContain('raw-hex-color');
    expect(categories).toContain('raw-numeric-style');
    expect(categories).toContain('unknown-prop');
    expect(categories).toContain('invalid-prop-value');

    // Specific messages
    const messages = result.violations.map((v) => v.message);
    expect(messages.some((m) => m.includes("Forbidden import of 'Text'"))).toBe(true);
    expect(messages.some((m) => m.includes("Forbidden import of 'TextInput'"))).toBe(true);
    expect(messages.some((m) => m.includes("Forbidden import of 'Button'"))).toBe(true);
    expect(messages.some((m) => m.includes("Forbidden import of 'Pressable'"))).toBe(true);
    expect(messages.some((m) => m.includes("Component 'Modal' does not exist"))).toBe(true);
    expect(messages.some((m) => m.includes("Component 'Slider' does not exist"))).toBe(true);
    expect(messages.some((m) => m.includes("Raw color code '#1D4ED8'"))).toBe(true);
    expect(messages.some((m) => m.includes("Raw numeric value '16' used for 'margin'"))).toBe(true);
    expect(messages.some((m) => m.includes("Invalid value 'ultra' for prop 'variant' on '<Button>'"))).toBe(true);
    expect(messages.some((m) => m.includes("Prop 'fakeProp' does not exist on component '<Button>'"))).toBe(true);
  });

  it('validates gallery demo screens with 0 violations', () => {
    const demosDir = path.resolve(__dirname, '../apps/gallery/app/demos');
    const { totalViolations, results } = runValidation(demosDir);

    if (totalViolations > 0) {
      console.error('Failing demo violations:', results.filter((r) => !r.valid));
    }

    expect(totalViolations).toBe(0);
    expect(results.length).toBe(2);
    expect(results.every((r) => r.valid)).toBe(true);
  });
});
