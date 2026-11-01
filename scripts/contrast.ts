import { lightTheme } from '../packages/tokens/src/generated/light';
import { darkTheme } from '../packages/tokens/src/generated/dark';
import type { ThemeTokens } from '../packages/tokens/src/generated/types';

export interface ContrastResult {
  theme: 'light' | 'dark';
  category: 'text' | 'action' | 'feedback' | 'ui';
  fgToken: string;
  fgHex: string;
  bgToken: string;
  bgHex: string;
  ratio: number;
  minRatio: number;
  passed: boolean;
}

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB hex color.
 */
export function getRelativeLuminance(hex: string): number {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map(char => char + char)
      .join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number): number => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (1:1 to 21:1).
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

interface CheckDefinition {
  category: 'text' | 'action' | 'feedback' | 'ui';
  fgName: string;
  getFg: (t: ThemeTokens) => string;
  bgName: string;
  getBg: (t: ThemeTokens) => string;
  minRatio: number;
}

const CHECKS: CheckDefinition[] = [
  // Text on background
  {
    category: 'text',
    fgName: 'text.primary',
    getFg: t => t.colors.text.primary,
    bgName: 'bg.canvas',
    getBg: t => t.colors.bg.canvas,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.primary',
    getFg: t => t.colors.text.primary,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.primary',
    getFg: t => t.colors.text.primary,
    bgName: 'bg.surfaceRaised',
    getBg: t => t.colors.bg.surfaceRaised,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.secondary',
    getFg: t => t.colors.text.secondary,
    bgName: 'bg.canvas',
    getBg: t => t.colors.bg.canvas,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.secondary',
    getFg: t => t.colors.text.secondary,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.secondary',
    getFg: t => t.colors.text.secondary,
    bgName: 'bg.surfaceRaised',
    getBg: t => t.colors.bg.surfaceRaised,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.tertiary',
    getFg: t => t.colors.text.tertiary,
    bgName: 'bg.canvas',
    getBg: t => t.colors.bg.canvas,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.tertiary',
    getFg: t => t.colors.text.tertiary,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.tertiary',
    getFg: t => t.colors.text.tertiary,
    bgName: 'bg.surfaceRaised',
    getBg: t => t.colors.bg.surfaceRaised,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.brand',
    getFg: t => t.colors.text.brand,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.brandEmphasized',
    getFg: t => t.colors.text.brandEmphasized,
    bgName: 'bg.brandSubtle',
    getBg: t => t.colors.bg.brandSubtle,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.inverse',
    getFg: t => t.colors.text.inverse,
    bgName: 'bg.inverse',
    getBg: t => t.colors.bg.inverse,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.danger',
    getFg: t => t.colors.text.danger,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.warning',
    getFg: t => t.colors.text.warning,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.success',
    getFg: t => t.colors.text.success,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },
  {
    category: 'text',
    fgName: 'text.info',
    getFg: t => t.colors.text.info,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 4.5,
  },

  // Actions
  {
    category: 'action',
    fgName: 'action.primary.text',
    getFg: t => t.colors.action.primary.text,
    bgName: 'action.primary.default',
    getBg: t => t.colors.action.primary.default,
    minRatio: 4.5,
  },
  {
    category: 'action',
    fgName: 'action.primary.text',
    getFg: t => t.colors.action.primary.text,
    bgName: 'action.primary.pressed',
    getBg: t => t.colors.action.primary.pressed,
    minRatio: 4.5,
  },
  {
    category: 'action',
    fgName: 'action.secondary.text',
    getFg: t => t.colors.action.secondary.text,
    bgName: 'action.secondary.default',
    getBg: t => t.colors.action.secondary.default,
    minRatio: 4.5,
  },
  {
    category: 'action',
    fgName: 'action.danger.text',
    getFg: t => t.colors.action.danger.text,
    bgName: 'action.danger.default',
    getBg: t => t.colors.action.danger.default,
    minRatio: 4.5,
  },
  {
    category: 'action',
    fgName: 'action.danger.text',
    getFg: t => t.colors.action.danger.text,
    bgName: 'action.danger.pressed',
    getBg: t => t.colors.action.danger.pressed,
    minRatio: 4.5,
  },

  // Feedback pairs
  {
    category: 'feedback',
    fgName: 'feedback.success.text',
    getFg: t => t.colors.feedback.success.text,
    bgName: 'feedback.success.bg',
    getBg: t => t.colors.feedback.success.bg,
    minRatio: 4.5,
  },
  {
    category: 'feedback',
    fgName: 'feedback.warning.text',
    getFg: t => t.colors.feedback.warning.text,
    bgName: 'feedback.warning.bg',
    getBg: t => t.colors.feedback.warning.bg,
    minRatio: 4.5,
  },
  {
    category: 'feedback',
    fgName: 'feedback.danger.text',
    getFg: t => t.colors.feedback.danger.text,
    bgName: 'feedback.danger.bg',
    getBg: t => t.colors.feedback.danger.bg,
    minRatio: 4.5,
  },
  {
    category: 'feedback',
    fgName: 'feedback.info.text',
    getFg: t => t.colors.feedback.info.text,
    bgName: 'feedback.info.bg',
    getBg: t => t.colors.feedback.info.bg,
    minRatio: 4.5,
  },
  {
    category: 'ui',
    fgName: 'feedback.success.icon',
    getFg: t => t.colors.feedback.success.icon,
    bgName: 'feedback.success.bg',
    getBg: t => t.colors.feedback.success.bg,
    minRatio: 3.0,
  },
  {
    category: 'ui',
    fgName: 'feedback.warning.icon',
    getFg: t => t.colors.feedback.warning.icon,
    bgName: 'feedback.warning.bg',
    getBg: t => t.colors.feedback.warning.bg,
    minRatio: 3.0,
  },
  {
    category: 'ui',
    fgName: 'feedback.danger.icon',
    getFg: t => t.colors.feedback.danger.icon,
    bgName: 'feedback.danger.bg',
    getBg: t => t.colors.feedback.danger.bg,
    minRatio: 3.0,
  },
  {
    category: 'ui',
    fgName: 'feedback.info.icon',
    getFg: t => t.colors.feedback.info.icon,
    bgName: 'feedback.info.bg',
    getBg: t => t.colors.feedback.info.bg,
    minRatio: 3.0,
  },
  // Focus indicators (WCAG 2.1 SC 1.4.11 Non-text contrast >= 3.0:1)
  {
    category: 'ui',
    fgName: 'border.focus',
    getFg: t => t.colors.border.focus,
    bgName: 'bg.surface',
    getBg: t => t.colors.bg.surface,
    minRatio: 3.0,
  },
  {
    category: 'ui',
    fgName: 'border.focus',
    getFg: t => t.colors.border.focus,
    bgName: 'bg.canvas',
    getBg: t => t.colors.bg.canvas,
    minRatio: 3.0,
  },
  // Chip token pairs
  {
    category: 'text',
    fgName: 'chip.unselected.text',
    getFg: t => t.components.chip.unselected.text,
    bgName: 'chip.unselected.bg',
    getBg: t => t.components.chip.unselected.bg,
    minRatio: 4.5,
  },
  {
    category: 'action',
    fgName: 'chip.selected.text',
    getFg: t => t.components.chip.selected.text,
    bgName: 'chip.selected.bg',
    getBg: t => t.components.chip.selected.bg,
    minRatio: 4.5,
  },
];

export function runContrastAudit(): { results: ContrastResult[]; passed: boolean } {
  const results: ContrastResult[] = [];
  let allPassed = true;

  const themes: Array<{ name: 'light' | 'dark'; theme: ThemeTokens }> = [
    { name: 'light', theme: lightTheme },
    { name: 'dark', theme: darkTheme },
  ];

  for (const { name, theme } of themes) {
    for (const check of CHECKS) {
      const fgHex = check.getFg(theme);
      const bgHex = check.getBg(theme);
      const ratio = getContrastRatio(fgHex, bgHex);
      const passed = ratio >= check.minRatio;

      if (!passed) {
        allPassed = false;
      }

      results.push({
        theme: name,
        category: check.category,
        fgToken: check.fgName,
        fgHex,
        bgToken: check.bgName,
        bgHex,
        ratio,
        minRatio: check.minRatio,
        passed,
      });
    }
  }

  return { results, passed: allPassed };
}

export function printContrastReport(): boolean {
  console.log(
    '\n========================================================================================'
  );
  console.log(
    '                          SHANI DS - WCAG 2.1 CONTRAST AUDIT                           '
  );
  console.log(
    '========================================================================================\n'
  );

  const { results, passed } = runContrastAudit();

  const pad = (str: string, length: number): string => str.padEnd(length, ' ');

  console.log(
    `${pad('Theme', 7)} | ${pad('Category', 9)} | ${pad('Foreground', 22)} | ${pad('Background', 22)} | ${pad('Ratio', 7)} | ${pad('Required', 8)} | Status`
  );
  console.log('-'.repeat(96));

  for (const r of results) {
    const status = r.passed ? '✓ PASS' : '✗ FAIL';
    const row = `${pad(r.theme.toUpperCase(), 7)} | ${pad(r.category, 9)} | ${pad(`${r.fgToken} (${r.fgHex})`, 22)} | ${pad(`${r.bgToken} (${r.bgHex})`, 22)} | ${pad(`${r.ratio}:1`, 7)} | ${pad(`≥ ${r.minRatio}:1`, 8)} | ${status}`;
    console.log(row);
  }

  console.log('-'.repeat(96));
  if (passed) {
    console.log(`\n🎉 ALL ${results.length} CONTRAST CHECKS PASSED WCAG 2.1 AA STANDARDS!\n`);
  } else {
    console.error(`\n❌ SOME CONTRAST CHECKS FAILED! Fix token colors before proceeding.\n`);
  }

  return passed;
}

if (require.main === module) {
  const success = printContrastReport();
  if (!success) {
    process.exit(1);
  }
}
