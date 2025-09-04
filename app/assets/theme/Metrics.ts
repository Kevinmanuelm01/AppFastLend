/**
 * Métricas globales de la aplicación
 * Valores de spacing, dimensiones y medidas comunes
 */

// Spacing principal
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
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
