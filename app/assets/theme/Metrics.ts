/**
 * Métricas globales de la aplicación
 * Valores de spacing, dimensiones y medidas comunes
 */

// Spacing principal
export const SPACING = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  xxl: 52,
  xxxl: 64,
} as const;

// Radios de borde modernos
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// Sombras modernas
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  colored: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
// Métricas legacy (compatibilidad)
export const METRICS = {
  // Small margin
  small: 4,
  // Medium margin
  medium: 8,
  // Medium-Large margin
  medium_large: 12,
  // Native Base margin
  nativeBase: 13,
  // Large margin
  large: 16,
  // X-Large margin
  xLarge: 24,
  // XX-Large margin
  xxLarge: 32,

  // Small margin
  mSm: 5,
  // Medium margin
  mMd: 10,
  // Native Base margin
  nBm: 13,
  // Large margin
  mLg: 15,
  // X-Large margin
  mXl: 20,
  // X-Large-Medium margin
  mXMl: 25,
  // XX-Large margin
  mXxl: 30,
} as const;

// Dimensiones de componentes
export const COMPONENT_SIZES = {
  button: {
    small: { height: 32, paddingHorizontal: 12 },
    medium: { height: 40, paddingHorizontal: 16 },
    large: { height: 48, paddingHorizontal: 20 },
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  icon: {
    small: 16,
    medium: 24,
    large: 32,
    xl: 48,
  },
} as const;

// Tipos para TypeScript
export type SpacingKeys = keyof typeof SPACING;
export type ComponentSizes = typeof COMPONENT_SIZES;

// Export por defecto para compatibilidad
export default METRICS;
