/**
 * Sistema de tipografía de la aplicación
 * Tamaños de fuente, pesos y estilos de texto
 */

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './ColorsDefault';

// Tamaños de fuente
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  
  // Específicos
  subtitle: 16,
  subtitle2: 14,
  input: 16,
  body1: 16,
  body2: 14,
  button: 16,
  caption: 12,
  overline: 10,
  
  // Legacy
  iconAction: 24,
} as const;

// Pesos de fuente
export const FONT_WEIGHTS = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

// Familias de fuente
export const FONT_FAMILIES = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
  // Custom fonts
  verlag: 'Verlag',
  verlagBold: 'Verlag-Bold',
} as const;

// Line heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Estilos de tipografía
export const TYPOGRAPHY_STYLES = StyleSheet.create({
  // Headings
  h1: {
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    fontFamily: FONT_FAMILIES.bold,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.tight,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.semibold,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  h4: {
    fontSize: FONT_SIZES.h4,
    fontWeight: FONT_WEIGHTS.semibold,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  h5: {
    fontSize: FONT_SIZES.h5,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.h5 * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  h6: {
    fontSize: FONT_SIZES.h6,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.h6 * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  
  // Body text
  body1: {
    fontSize: FONT_SIZES.body1,
    fontWeight: FONT_WEIGHTS.regular,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: FONT_SIZES.body1 * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  body2: {
    fontSize: FONT_SIZES.body2,
    fontWeight: FONT_WEIGHTS.regular,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: FONT_SIZES.body2 * LINE_HEIGHTS.normal,
    color: COLORS.text.secondary,
  },
  
  // Subtitles
  subtitle1: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.subtitle * LINE_HEIGHTS.normal,
    color: COLORS.text.primary,
  },
  subtitle2: {
    fontSize: FONT_SIZES.subtitle2,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    lineHeight: FONT_SIZES.subtitle2 * LINE_HEIGHTS.normal,
    color: COLORS.text.secondary,
  },
  
  // Buttons
  button: {
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    textAlign: 'center' as const,
  },
  buttonPrimary: {
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.semibold,
    fontFamily: FONT_FAMILIES.bold,
    textAlign: 'center' as const,
    color: '#ffffff',
  },
  
  // Caption and overline
  caption: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: FONT_SIZES.caption * LINE_HEIGHTS.normal,
    color: COLORS.text.secondary,
  },
  overline: {
    fontSize: FONT_SIZES.overline,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: FONT_FAMILIES.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    color: COLORS.text.secondary,
  },
  
  // Inputs
  input: {
    fontSize: FONT_SIZES.input,
    fontWeight: FONT_WEIGHTS.regular,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.primary,
  },
  
  // Variants
  textWhite: {
    color: '#ffffff',
  },
  textPrimary: {
    color: COLORS.primary,
  },
  textSecondary: {
    color: COLORS.text.secondary,
  },
  textSuccess: {
    color: COLORS.success,
  },
  textWarning: {
    color: COLORS.warning,
  },
  textError: {
    color: COLORS.error,
  },
  
  // Legacy styles
  birthDay: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.light,
    fontFamily: FONT_FAMILIES.regular,
  },
  subtitleWhite: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: FONT_WEIGHTS.regular,
    color: '#ffffff',
    fontFamily: FONT_FAMILIES.regular,
  },
  h6White: {
    fontSize: FONT_SIZES.h6,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.light,
  },
});

// Tipos para TypeScript
export type FontSizes = typeof FONT_SIZES;
export type FontWeights = typeof FONT_WEIGHTS;
export type FontFamilies = typeof FONT_FAMILIES;
export type LineHeights = typeof LINE_HEIGHTS;

// Export por defecto
export default TYPOGRAPHY_STYLES;

// Named exports
export { FONT_SIZES as FontSize, FONT_WEIGHTS as FontWeight };
