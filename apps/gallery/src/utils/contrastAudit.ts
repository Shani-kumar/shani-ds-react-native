import { lightTheme, darkTheme, type ThemeTokens } from '@shani/tokens';
import { getContrastRatio } from './contrast';

export interface ContrastReportItem {
  theme: 'light' | 'dark';
  category: 'text' | 'action' | 'feedback' | 'ui';
  fgName: string;
  fgHex: string;
  bgName: string;
  bgHex: string;
  ratio: number;
  minRatio: number;
  passed: boolean;
}

interface CheckDefinition {
  category: 'text' | 'action' | 'feedback' | 'ui';
  fgName: string;
  getFg: (t: ThemeTokens) => string;
  bgName: string;
  getBg: (t: ThemeTokens) => string;
  minRatio: number;
}

const AUDIT_CHECKS: CheckDefinition[] = [
  // Text on background
  { category: 'text', fgName: 'text.primary', getFg: (t) => t.colors.text.primary, bgName: 'bg.canvas', getBg: (t) => t.colors.bg.canvas, minRatio: 4.5 },
  { category: 'text', fgName: 'text.primary', getFg: (t) => t.colors.text.primary, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.primary', getFg: (t) => t.colors.text.primary, bgName: 'bg.surfaceRaised', getBg: (t) => t.colors.bg.surfaceRaised, minRatio: 4.5 },
  { category: 'text', fgName: 'text.secondary', getFg: (t) => t.colors.text.secondary, bgName: 'bg.canvas', getBg: (t) => t.colors.bg.canvas, minRatio: 4.5 },
  { category: 'text', fgName: 'text.secondary', getFg: (t) => t.colors.text.secondary, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.secondary', getFg: (t) => t.colors.text.secondary, bgName: 'bg.surfaceRaised', getBg: (t) => t.colors.bg.surfaceRaised, minRatio: 4.5 },
  { category: 'text', fgName: 'text.tertiary', getFg: (t) => t.colors.text.tertiary, bgName: 'bg.canvas', getBg: (t) => t.colors.bg.canvas, minRatio: 4.5 },
  { category: 'text', fgName: 'text.tertiary', getFg: (t) => t.colors.text.tertiary, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.tertiary', getFg: (t) => t.colors.text.tertiary, bgName: 'bg.surfaceRaised', getBg: (t) => t.colors.bg.surfaceRaised, minRatio: 4.5 },
  { category: 'text', fgName: 'text.brand', getFg: (t) => t.colors.text.brand, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.brandEmphasized', getFg: (t) => t.colors.text.brandEmphasized, bgName: 'bg.brandSubtle', getBg: (t) => t.colors.bg.brandSubtle, minRatio: 4.5 },
  { category: 'text', fgName: 'text.inverse', getFg: (t) => t.colors.text.inverse, bgName: 'bg.inverse', getBg: (t) => t.colors.bg.inverse, minRatio: 4.5 },
  { category: 'text', fgName: 'text.danger', getFg: (t) => t.colors.text.danger, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.warning', getFg: (t) => t.colors.text.warning, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.success', getFg: (t) => t.colors.text.success, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },
  { category: 'text', fgName: 'text.info', getFg: (t) => t.colors.text.info, bgName: 'bg.surface', getBg: (t) => t.colors.bg.surface, minRatio: 4.5 },

  // Actions
  { category: 'action', fgName: 'action.primary.text', getFg: (t) => t.colors.action.primary.text, bgName: 'action.primary.default', getBg: (t) => t.colors.action.primary.default, minRatio: 4.5 },
  { category: 'action', fgName: 'action.primary.text', getFg: (t) => t.colors.action.primary.text, bgName: 'action.primary.pressed', getBg: (t) => t.colors.action.primary.pressed, minRatio: 4.5 },
  { category: 'action', fgName: 'action.secondary.text', getFg: (t) => t.colors.action.secondary.text, bgName: 'action.secondary.default', getBg: (t) => t.colors.action.secondary.default, minRatio: 4.5 },
  { category: 'action', fgName: 'action.danger.text', getFg: (t) => t.colors.action.danger.text, bgName: 'action.danger.default', getBg: (t) => t.colors.action.danger.default, minRatio: 4.5 },
  { category: 'action', fgName: 'action.danger.text', getFg: (t) => t.colors.action.danger.text, bgName: 'action.danger.pressed', getBg: (t) => t.colors.action.danger.pressed, minRatio: 4.5 },

  // Feedback pairs
  { category: 'feedback', fgName: 'feedback.success.text', getFg: (t) => t.colors.feedback.success.text, bgName: 'feedback.success.bg', getBg: (t) => t.colors.feedback.success.bg, minRatio: 4.5 },
  { category: 'feedback', fgName: 'feedback.warning.text', getFg: (t) => t.colors.feedback.warning.text, bgName: 'feedback.warning.bg', getBg: (t) => t.colors.feedback.warning.bg, minRatio: 4.5 },
  { category: 'feedback', fgName: 'feedback.danger.text', getFg: (t) => t.colors.feedback.danger.text, bgName: 'feedback.danger.bg', getBg: (t) => t.colors.feedback.danger.bg, minRatio: 4.5 },
  { category: 'feedback', fgName: 'feedback.info.text', getFg: (t) => t.colors.feedback.info.text, bgName: 'feedback.info.bg', getBg: (t) => t.colors.feedback.info.bg, minRatio: 4.5 },

  // UI Icons
  { category: 'ui', fgName: 'feedback.success.icon', getFg: (t) => t.colors.feedback.success.icon, bgName: 'feedback.success.bg', getBg: (t) => t.colors.feedback.success.bg, minRatio: 3.0 },
  { category: 'ui', fgName: 'feedback.warning.icon', getFg: (t) => t.colors.feedback.warning.icon, bgName: 'feedback.warning.bg', getBg: (t) => t.colors.feedback.warning.bg, minRatio: 3.0 },
  { category: 'ui', fgName: 'feedback.danger.icon', getFg: (t) => t.colors.feedback.danger.icon, bgName: 'feedback.danger.bg', getBg: (t) => t.colors.feedback.danger.bg, minRatio: 3.0 },
  { category: 'ui', fgName: 'feedback.info.icon', getFg: (t) => t.colors.feedback.info.icon, bgName: 'feedback.info.bg', getBg: (t) => t.colors.feedback.info.bg, minRatio: 3.0 },
];

export function getFullContrastReport(
  customLight: ThemeTokens = lightTheme,
  customDark: ThemeTokens = darkTheme
): ContrastReportItem[] {
  const report: ContrastReportItem[] = [];

  const themes: Array<{ name: 'light' | 'dark'; theme: ThemeTokens }> = [
    { name: 'light', theme: customLight },
    { name: 'dark', theme: customDark },
  ];

  for (const { name, theme } of themes) {
    for (const check of AUDIT_CHECKS) {
      const fgHex = check.getFg(theme);
      const bgHex = check.getBg(theme);
      const ratio = getContrastRatio(fgHex, bgHex);
      const passed = ratio >= check.minRatio;

      report.push({
        theme: name,
        category: check.category,
        fgName: check.fgName,
        fgHex,
        bgName: check.bgName,
        bgHex,
        ratio,
        minRatio: check.minRatio,
        passed,
      });
    }
  }

  return report;
}

