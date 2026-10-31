import { getRelativeLuminance, getContrastRatio, runContrastAudit } from './contrast';

describe('WCAG Contrast Utilities', () => {
  it('calculates correct relative luminance for black and white', () => {
    expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 4);
    expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1, 4);
  });

  it('calculates correct contrast ratios for edge cases', () => {
    expect(getContrastRatio('#000000', '#FFFFFF')).toBe(21);
    expect(getContrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    expect(getContrastRatio('#2563EB', '#2563EB')).toBe(1);
  });

  it('passes automated contrast audit for all defined light and dark tokens', () => {
    const { results, passed } = runContrastAudit();
    expect(passed).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    results.forEach(result => {
      expect(result.ratio).toBeGreaterThanOrEqual(result.minRatio);
    });
  });
});
