// Medidas y espaciado por defecto
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Dimensiones de pantalla
export const SCREEN_DIMENSIONS = {
  width: 375, // iPhone base width
  height: 812, // iPhone base height
};

// Tamaños de componentes comunes
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
  avatar: {
    small: 32,
    medium: 48,
    large: 64,
  },
};

// Tipos para TypeScript
export type SpacingKeys = keyof typeof SPACING;
export type ComponentSizes = typeof COMPONENT_SIZES;