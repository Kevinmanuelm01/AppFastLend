// Configuración del tema de la aplicación - Archivo principal de exportación

import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import type { ThemeColors } from '../../types';

// Importar archivos de tema
export * from './ColorsDefault';
export * from './Metrics';
export * from './Margins';
export * from './Fonts';

// Re-exportar para compatibilidad
export { default as MetricsStyles } from './Metrics';
export { default as MarginStyles } from './Margins';
export { default as FontStyles } from './Fonts';

// Tema claro
export const lightTheme: ThemeColors = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  background: COLORS.background,
  surface: COLORS.surface,
  text: COLORS.text,
  border: COLORS.border,
};

// Tema oscuro
export const darkTheme: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#9ca3af',
  background: '#111827',
  surface: '#1f2937',
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    light: '#9ca3af',
  },
  border: '#374151',
};

// Estilos comunes
export const commonStyles = {
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  paddedContainer: {
    paddingHorizontal: SPACING.md,
  },

  // Textos
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: lightTheme.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: lightTheme.text.secondary,
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: lightTheme.text.primary,
    lineHeight: 24,
  },
  caption: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: lightTheme.text.light,
  },

  // Botones
  button: {
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: lightTheme.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: lightTheme.border,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: lightTheme.text.primary,
  },

  // Inputs
  input: {
    backgroundColor: lightTheme.surface,
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: TYPOGRAPHY.sizes.md,
    color: lightTheme.text.primary,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: lightTheme.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: lightTheme.text.primary,
    marginBottom: SPACING.xs,
  },
  inputErrorText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },

  // Cards
  card: {
    backgroundColor: lightTheme.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Separadores
  separator: {
    height: 1,
    backgroundColor: lightTheme.border,
    marginVertical: SPACING.md,
  },

  // Estados
  disabled: {
    opacity: 0.6,
  },
  loading: {
    opacity: 0.8,
  },

  // Sombras
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

// Función para obtener el tema actual
export const getTheme = (isDark: boolean = false) => {
  return isDark ? darkTheme : lightTheme;
};

// Función para obtener estilos con tema
export const getThemedStyles = (isDark: boolean = false) => {
  const theme = getTheme(isDark);

  return {
    ...commonStyles,
    // Sobrescribir colores según el tema
    container: {
      ...commonStyles.container,
      backgroundColor: theme.background,
    },
    title: {
      ...commonStyles.title,
      color: theme.text.primary,
    },
    subtitle: {
      ...commonStyles.subtitle,
      color: theme.text.secondary,
    },
    body: {
      ...commonStyles.body,
      color: theme.text.primary,
    },
    input: {
      ...commonStyles.input,
      backgroundColor: theme.surface,
      borderColor: theme.border,
      color: theme.text.primary,
    },
    card: {
      ...commonStyles.card,
      backgroundColor: theme.surface,
    },
    separator: {
      ...commonStyles.separator,
      backgroundColor: theme.border,
    },
  };
};
