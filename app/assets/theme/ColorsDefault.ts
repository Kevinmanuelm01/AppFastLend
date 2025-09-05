// Sistema de colores moderno para toda la aplicación
export const COLORS = {
  // Colores primarios modernos
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  primaryGradient: ['#3b82f6', '#1d4ed8'],
  
  // Colores secundarios
  secondary: '#64748b',
  secondaryLight: '#94a3b8',
  secondaryDark: '#475569',
  
  // Colores de estado
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#059669',
  
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  
  info: '#06b6d4',
  infoLight: '#22d3ee',
  infoDark: '#0891b2',
  
  // Fondos modernos
  background: '#f8fafc',
  backgroundSecondary: '#f1f5f9',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Textos con mejor contraste
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    light: '#94a3b8',
    inverse: '#ffffff',
    muted: '#cbd5e1',
  },
  
  // Bordes y separadores
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  divider: '#e2e8f0',
  
  // Sombras
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
    colored: 'rgba(59, 130, 246, 0.15)',
  },
  
  // Estados interactivos
  interactive: {
    hover: '#f8fafc',
    pressed: '#f1f5f9',
    focus: '#eff6ff',
    disabled: '#f8fafc',
  },
  
  // Gradientes modernos
  gradients: {
    primary: ['#3b82f6', '#1d4ed8'],
    secondary: ['#64748b', '#475569'],
    success: ['#10b981', '#059669'],
    warm: ['#f59e0b', '#d97706'],
    cool: ['#06b6d4', '#0891b2'],
    sunset: ['#f59e0b', '#ef4444'],
    ocean: ['#06b6d4', '#3b82f6'],
  },
};

// Tipos para TypeScript
export type ColorPalette = typeof COLORS;
export type TextColors = typeof COLORS.text;