// Utilidades comunes de la aplicación - Archivo principal de exportación

import { Dimensions, Platform } from 'react-native';

// Re-exportar utilidades de strings
export * from './utilsStrings';

// Re-exportar utilidades de fechas
export * from './utilsDate';

// Re-exportar utilidades de números
export * from './utilsNumber';

// Re-exportar utilidades de estilos
export * from './utilsStyle';

// ═══════════════════════════════════════════════════════════════
// 📱 UTILIDADES DE PLATAFORMA Y DISPOSITIVO
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene las dimensiones de la pantalla
 * @returns Objeto con width y height
 */
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

/**
 * Verifica si la plataforma es iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Verifica si la plataforma es Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Obtiene información de la plataforma
 * @returns Objeto con información del dispositivo
 */
export const getPlatformInfo = () => {
  return {
    os: Platform.OS,
    version: Platform.Version,
    isIOS,
    isAndroid,
    ...getScreenDimensions(),
  };
};

// ═══════════════════════════════════════════════════════════════
// ⏰ UTILIDADES DE TIEMPO Y ASYNC
// ═══════════════════════════════════════════════════════════════

/**
 * Función delay/sleep
 * @param ms - Milisegundos a esperar
 * @returns Promise que resuelve después del tiempo especificado
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce function - retrasa la ejecución de una función
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en ms
 * @returns Función debounced
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function - limita la frecuencia de ejecución
 * @param func - Función a ejecutar
 * @param limit - Límite de tiempo en ms
 * @returns Función throttled
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ═══════════════════════════════════════════════════════════════
// 🧹 UTILIDADES DE DATOS Y OBJETOS
// ═══════════════════════════════════════════════════════════════

/**
 * Limpia un objeto removiendo propiedades undefined/null
 * @param obj - Objeto a limpiar
 * @returns Objeto limpio
 */
export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      cleaned[key as keyof T] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Clona profundamente un objeto
 * @param obj - Objeto a clonar
 * @returns Copia profunda del objeto
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy = {} as T;
    Object.keys(obj).forEach((key) => {
      copy[key as keyof T] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
};

// ═══════════════════════════════════════════════════════════════
// 🔧 UTILIDADES ADICIONALES
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un array con un rango de números
 * @param start - Número inicial
 * @param end - Número final
 * @param step - Incremento (default: 1)
 * @returns Array con el rango
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Verifica si un valor es un objeto
 * @param value - Valor a verificar
 * @returns true si es un objeto
 */
export const isObject = (value: any): value is object => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Verifica si un array está vacío
 * @param arr - Array a verificar
 * @returns true si está vacío
 */
export const isEmpty = (arr: any[]): boolean => {
  return !arr || arr.length === 0;
};

/**
 * Remueve elementos duplicados de un array
 * @param arr - Array con posibles duplicados
 * @returns Array sin duplicados
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};
