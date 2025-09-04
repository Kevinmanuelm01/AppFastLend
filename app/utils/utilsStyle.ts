// Utilidades para manejo de estilos, colores y temas

import { Dimensions, PixelRatio, StatusBar, Platform } from 'react-native';

// ═══════════════════════════════════════════════════════════════
// 📐 UTILIDADES DE DIMENSIONES Y RESPONSIVE
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene las dimensiones de la pantalla
 * @returns Objeto con dimensiones y información del dispositivo
 */
export const getDeviceDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const screenData = Dimensions.get('screen');

  return {
    window: { width, height },
    screen: screenData,
    isTablet: width >= 768,
    isSmallScreen: width < 375,
    isLargeScreen: width > 414,
    aspectRatio: width / height,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
  };
};

/**
 * Convierte dp a px
 * @param dp - Valor en density-independent pixels
 * @returns Valor en pixels
 */
export const dpToPx = (dp: number): number => {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
};

/**
 * Convierte px a dp
 * @param px - Valor en pixels
 * @returns Valor en density-independent pixels
 */
export const pxToDp = (px: number): number => {
  return PixelRatio.roundToNearestPixel(px);
};

/**
 * Escala un valor basado en el ancho de pantalla
 * @param size - Tamaño base
 * @param baseWidth - Ancho base de referencia (default: 375)
 * @returns Tamaño escalado
 */
export const scaleSize = (size: number, baseWidth: number = 375): number => {
  const { width } = Dimensions.get('window');
  return (size * width) / baseWidth;
};

/**
 * Escala un valor verticalmente basado en la altura de pantalla
 * @param size - Tamaño base
 * @param baseHeight - Altura base de referencia (default: 812)
 * @returns Tamaño escalado verticalmente
 */
export const scaleHeight = (size: number, baseHeight: number = 812): number => {
  const { height } = Dimensions.get('window');
  return (size * height) / baseHeight;
};

/**
 * Obtiene el height de la status bar
 * @returns Altura de la status bar
 */
export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    const { height, width } = Dimensions.get('window');
    const screenHeight = Dimensions.get('screen').height;
    const statusBarHeight = screenHeight - height;
    return statusBarHeight;
  }
  return StatusBar.currentHeight || 0;
};

// ═══════════════════════════════════════════════════════════════
// 🎨 UTILIDADES DE COLORES
// ═══════════════════════════════════════════════════════════════

/**
 * Convierte color hex a RGBA
 * @param hex - Color hexadecimal
 * @param alpha - Valor alpha (0-1)
 * @returns String RGBA
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Oscurece un color hex
 * @param hex - Color hexadecimal
 * @param percent - Porcentaje a oscurecer (0-100)
 * @returns Color hex oscurecido
 */
export const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return (
    '#' +
    (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  );
};

/**
 * Aclara un color hex
 * @param hex - Color hexadecimal
 * @param percent - Porcentaje a aclarar (0-100)
 * @returns Color hex aclarado
 */
export const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  );
};

/**
 * Genera un color aleatorio
 * @returns Color hex aleatorio
 */
export const randomColor = (): string => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
};

/**
 * Obtiene el color de contraste (blanco o negro) para un color dado
 * @param hex - Color hexadecimal
 * @returns '#ffffff' o '#000000'
 */
export const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  // Fórmula para calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// ═══════════════════════════════════════════════════════════════
// 📱 UTILIDADES DE LAYOUT Y SPACING
// ═══════════════════════════════════════════════════════════════

/**
 * Crea estilos de sombra para iOS y Android
 * @param elevation - Elevación para Android
 * @param shadowColor - Color de sombra (default: '#000')
 * @param shadowOpacity - Opacidad de sombra iOS (default: 0.25)
 * @param shadowRadius - Radio de sombra iOS (default: 3.84)
 * @returns Objeto con estilos de sombra
 */
export const createShadow = (elevation: number = 5, shadowColor: string = '#000', shadowOpacity: number = 0.25, shadowRadius: number = 3.84) => {
  return {
    ...Platform.select({
      ios: {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: Math.round(elevation / 2),
        },
        shadowOpacity,
        shadowRadius,
      },
      android: {
        elevation,
      },
    }),
  };
};

/**
 * Crea estilos de border radius consistentes
 * @param radius - Radio del border
 * @returns Objeto con border radius
 */
export const createBorderRadius = (radius: number) => {
  return {
    borderRadius: radius,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  };
};

/**
 * Crea padding uniforme
 * @param value - Valor del padding
 * @returns Objeto con padding
 */
export const createPadding = (value: number) => {
  return {
    padding: value,
    paddingTop: value,
    paddingRight: value,
    paddingBottom: value,
    paddingLeft: value,
  };
};

/**
 * Crea margin uniforme
 * @param value - Valor del margin
 * @returns Objeto con margin
 */
export const createMargin = (value: number) => {
  return {
    margin: value,
    marginTop: value,
    marginRight: value,
    marginBottom: value,
    marginLeft: value,
  };
};

// ═══════════════════════════════════════════════════════════════
// 🎯 UTILIDADES DE RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════════

/**
 * Breakpoints para responsive design
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

/**
 * Verifica si la pantalla es de tamaño específico
 * @param breakpoint - Breakpoint a verificar
 * @returns true si la pantalla cumple el breakpoint
 */
export const isScreenSize = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  const { width } = Dimensions.get('window');
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Obtiene estilos responsive basados en el ancho de pantalla
 * @param styles - Objeto con estilos para diferentes breakpoints
 * @returns Estilo correspondiente al tamaño actual
 */
export const getResponsiveStyle = <T>(styles: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }): T | undefined => {
  const { width } = Dimensions.get('window');

  if (width >= BREAKPOINTS.xl && styles.xl) return styles.xl;
  if (width >= BREAKPOINTS.lg && styles.lg) return styles.lg;
  if (width >= BREAKPOINTS.md && styles.md) return styles.md;
  if (width >= BREAKPOINTS.sm && styles.sm) return styles.sm;
  return styles.xs;
};

// ═══════════════════════════════════════════════════════════════
// 🎨 UTILIDADES DE TEMA
// ═══════════════════════════════════════════════════════════════

/**
 * Interpola entre dos valores basado en un progreso
 * @param start - Valor inicial
 * @param end - Valor final
 * @param progress - Progreso (0-1)
 * @returns Valor interpolado
 */
export const interpolate = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

/**
 * Convierte un color hex a HSL
 * @param hex - Color hexadecimal
 * @returns Objeto HSL
 */
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Crea una paleta de colores basada en un color primario
 * @param primaryColor - Color primario hex
 * @returns Objeto con paleta de colores
 */
export const createColorPalette = (primaryColor: string) => {
  return {
    primary: primaryColor,
    primaryLight: lightenColor(primaryColor, 20),
    primaryDark: darkenColor(primaryColor, 20),
    primaryContrast: getContrastColor(primaryColor),
    secondary: lightenColor(primaryColor, 40),
    accent: darkenColor(primaryColor, 10),
    background: '#ffffff',
    surface: '#f5f5f5',
    error: '#ff5252',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
  };
};

// ═══════════════════════════════════════════════════════════════
// 📐 UTILIDADES DE LAYOUT
// ═══════════════════════════════════════════════════════════════

/**
 * Crea estilos de flexbox comunes
 * @param direction - Dirección del flex (default: 'row')
 * @param justify - Justify content (default: 'center')
 * @param align - Align items (default: 'center')
 * @returns Objeto con estilos flex
 */
export const createFlexStyles = (
  direction: 'row' | 'column' = 'row',
  justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' = 'center',
  align: 'flex-start' | 'center' | 'flex-end' | 'stretch' = 'center',
) => {
  return {
    display: 'flex' as const,
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
  };
};

/**
 * Crea estilos de posicionamiento absoluto
 * @param top - Posición top
 * @param right - Posición right
 * @param bottom - Posición bottom
 * @param left - Posición left
 * @returns Objeto con estilos de posición
 */
export const createAbsolutePosition = (top?: number, right?: number, bottom?: number, left?: number) => {
  return {
    position: 'absolute' as const,
    ...(top !== undefined && { top }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
  };
};

/**
 * Crea estilos de círculo perfecto
 * @param size - Tamaño del círculo
 * @param backgroundColor - Color de fondo (opcional)
 * @returns Objeto con estilos de círculo
 */
export const createCircleStyle = (size: number, backgroundColor?: string) => {
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...(backgroundColor && { backgroundColor }),
  };
};

// ═══════════════════════════════════════════════════════════════
// 🎨 UTILIDADES DE TIPOGRAFÍA
// ═══════════════════════════════════════════════════════════════

/**
 * Escala el tamaño de fuente basado en la escala del dispositivo
 * @param size - Tamaño base de fuente
 * @returns Tamaño escalado
 */
export const scaleFontSize = (size: number): number => {
  const scale = PixelRatio.getFontScale();
  return size * scale;
};

/**
 * Crea estilos de texto responsive
 * @param baseSize - Tamaño base
 * @param scaleSize - Si debe escalar con la pantalla (default: true)
 * @returns Tamaño de fuente apropiado
 */
export const getResponsiveFontSize = (baseSize: number, scaleSize: boolean = true): number => {
  const { width } = Dimensions.get('window');

  if (!scaleSize) return baseSize;

  // Escala basada en ancho de pantalla (375 como referencia)
  const scale = width / 375;
  const scaledSize = baseSize * scale;

  // Limitar entre valores mínimos y máximos
  return Math.max(12, Math.min(scaledSize, baseSize * 1.3));
};

/**
 * Obtiene line height óptimo para un tamaño de fuente
 * @param fontSize - Tamaño de fuente
 * @param multiplier - Multiplicador (default: 1.4)
 * @returns Line height calculado
 */
export const getOptimalLineHeight = (fontSize: number, multiplier: number = 1.4): number => {
  return Math.round(fontSize * multiplier);
};
