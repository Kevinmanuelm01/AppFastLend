// Claves de almacenamiento por defecto
export const STORAGE_KEYS = {
  // Autenticación
  USER_TOKEN: '@user_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  
  // Preferencias
  THEME_PREFERENCE: '@theme_preference',
  LANGUAGE_PREFERENCE: '@language_preference',
  NOTIFICATION_SETTINGS: '@notification_settings',
  
  // Cache
  API_CACHE: '@api_cache',
  IMAGE_CACHE: '@image_cache',
  
  // Configuración de la app
  FIRST_LAUNCH: '@first_launch',
  APP_VERSION: '@app_version',
  ONBOARDING_COMPLETED: '@onboarding_completed',
} as const;

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  // Tiempo de expiración en milisegundos
  CACHE_EXPIRY: {
    SHORT: 5 * 60 * 1000, // 5 minutos
    MEDIUM: 30 * 60 * 1000, // 30 minutos
    LONG: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  // Tamaños máximos
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
};

// Prefijos para diferentes tipos de datos
export const STORAGE_PREFIXES = {
  USER: '@user_',
  CACHE: '@cache_',
  SETTINGS: '@settings_',
  TEMP: '@temp_',
} as const;

// Tipos para TypeScript
export type StorageKeys = keyof typeof STORAGE_KEYS;
export type StorageValues = typeof STORAGE_KEYS[StorageKeys];
export type StoragePrefixes = keyof typeof STORAGE_PREFIXES;