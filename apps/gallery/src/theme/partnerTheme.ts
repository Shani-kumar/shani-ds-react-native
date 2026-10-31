import { lightTheme, darkTheme, type ThemeTokens } from '@shani/tokens';
import { createTheme, type DualThemeOverrides } from '@shani/ui';

/**
 * Partner Brand Theme: "Apex Fleet"
 * Built with createTheme() extending base tokens with partner primitive tokens
 * and zero raw hex codes.
 */
export const partnerLightTheme: ThemeTokens = createTheme(lightTheme, {
  colors: {
    action: {
      primary: {
        default: lightTheme.colors.palette.partner[600],
        pressed: lightTheme.colors.palette.partner[700],
        text: lightTheme.colors.palette.neutral[0],
      },
    },
    text: {
      brand: lightTheme.colors.palette.partner[600],
      brandEmphasized: lightTheme.colors.palette.partner[700],
    },
    border: {
      brand: lightTheme.colors.palette.partner[600],
      focus: lightTheme.colors.palette.partner[600],
    },
    bg: {
      brand: lightTheme.colors.palette.partner[600],
      brandSubtle: lightTheme.colors.palette.partner[100],
    },
  },
});

export const partnerDarkTheme: ThemeTokens = createTheme(darkTheme, {
  colors: {
    action: {
      primary: {
        default: darkTheme.colors.palette.partner[500],
        pressed: darkTheme.colors.palette.partner[600],
        text: darkTheme.colors.palette.neutral[950],
      },
    },
    text: {
      brand: darkTheme.colors.palette.partner[400],
      brandEmphasized: darkTheme.colors.palette.partner[300],
    },
    border: {
      brand: darkTheme.colors.palette.partner[400],
      focus: darkTheme.colors.palette.partner[400],
    },
    bg: {
      brand: darkTheme.colors.palette.partner[500],
      brandSubtle: darkTheme.colors.palette.partner[900],
    },
  },
});

export const partnerThemeOverrides: DualThemeOverrides = {
  light: {
    colors: {
      action: {
        primary: {
          default: lightTheme.colors.palette.partner[600],
          pressed: lightTheme.colors.palette.partner[700],
          text: lightTheme.colors.palette.neutral[0],
        },
      },
      text: {
        brand: lightTheme.colors.palette.partner[600],
        brandEmphasized: lightTheme.colors.palette.partner[700],
      },
      border: {
        brand: lightTheme.colors.palette.partner[600],
        focus: lightTheme.colors.palette.partner[600],
      },
      bg: {
        brand: lightTheme.colors.palette.partner[600],
        brandSubtle: lightTheme.colors.palette.partner[100],
      },
    },
  },
  dark: {
    colors: {
      action: {
        primary: {
          default: darkTheme.colors.palette.partner[500],
          pressed: darkTheme.colors.palette.partner[600],
          text: darkTheme.colors.palette.neutral[950],
        },
      },
      text: {
        brand: darkTheme.colors.palette.partner[400],
        brandEmphasized: darkTheme.colors.palette.partner[300],
      },
      border: {
        brand: darkTheme.colors.palette.partner[400],
        focus: darkTheme.colors.palette.partner[400],
      },
      bg: {
        brand: darkTheme.colors.palette.partner[500],
        brandSubtle: darkTheme.colors.palette.partner[900],
      },
    },
  },
};
