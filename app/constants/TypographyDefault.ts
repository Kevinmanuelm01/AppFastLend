// Configuración de tipografía por defecto
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Familias de fuentes
export const FONT_FAMILIES = {
  regular: 'System',
  medium: 'System-Medium',
  bold: 'System-Bold',
  // Agregar fuentes personalizadas aquí
  // custom: 'CustomFont-Regular',
};

// Tipos para TypeScript
export type FontSizes = keyof typeof TYPOGRAPHY.sizes;
export type FontWeights = keyof typeof TYPOGRAPHY.weights;
export type FontFamilies = keyof typeof FONT_FAMILIES;