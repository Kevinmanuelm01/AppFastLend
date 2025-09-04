// Colores por defecto del tema
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: {
    primary: '#1a1a1a',
    secondary: '#6b7280',
    light: '#9ca3af',
  },
  border: '#d1d5db',
};

// Tipos para TypeScript
export type ColorPalette = typeof COLORS;
export type TextColors = typeof COLORS.text;