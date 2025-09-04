// Constantes globales de la aplicación - Archivo principal de exportación

// Importaciones desde archivos modulares
export { COLORS } from '../assets/theme/ColorsDefault';
export { SPACING, COMPONENT_SIZES } from '../assets/theme/Metrics';
export { FONT_SIZES, FONT_WEIGHTS, FONT_FAMILIES, TYPOGRAPHY_STYLES } from '../assets/theme/Fonts';
export { PADDING_STYLES, MARGIN_STYLES } from '../assets/theme/Margins';
export { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS, HTTP_STATUS } from './ApiDefault';
export { ROUTES, ROUTE_GROUPS } from './RoutesDefault';
export { STORAGE_KEYS, STORAGE_CONFIG, STORAGE_PREFIXES } from './StorageDefault';

// Re-exportar tipos para facilitar el uso
export type { ColorPalette, TextColors } from '../assets/theme/ColorsDefault';
export type { SpacingKeys, ComponentSizes } from '../assets/theme/Metrics';
export type { FontSizes, FontWeights, FontFamilies } from '../assets/theme/Fonts';
export type { ApiConfig, ApiEndpoints, HttpStatus } from './ApiDefault';
export type { RouteNames, RouteValues, RootStackParamList } from './RoutesDefault';
export type { StorageKeys, StorageValues, StoragePrefixes } from './StorageDefault';

// Re-exportar para compatibilidad legacy
export { FONT_SIZES as TYPOGRAPHY } from '../assets/theme/Fonts';

// Constantes adicionales que no requieren archivo separado
export const APP_INFO = {
  name: 'React Native TypeScript Template',
  version: '1.0.0',
  buildNumber: 1,
} as const;

// Configuración de desarrollo
export const DEV_CONFIG = {
  enableLogging: __DEV__,
  enableDebugMode: __DEV__,
  showPerformanceMonitor: __DEV__,
} as const;
