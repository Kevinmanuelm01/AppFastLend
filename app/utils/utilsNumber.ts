// Utilidades para manejo de números y formatos numéricos

/**
 * Convierte número a formato de moneda
 * @param amount - Cantidad
 * @param currency - Código de moneda (default: 'EUR')
 * @param locale - Locale (default: 'es-ES')
 * @returns String formateado como moneda
 */
export const formatCurrency = (amount: number, currency: string = 'EUR', locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 * @param num - Número a formatear
 * @param locale - Locale (default: 'es-ES')
 * @returns Número formateado
 */
export const formatNumber = (num: number, locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Convierte bytes a formato legible
 * @param bytes - Número de bytes
 * @param decimals - Decimales a mostrar (default: 2)
 * @returns String formateado (ej: "1.23 MB")
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formatea un porcentaje
 * @param value - Valor decimal (0.1 = 10%)
 * @param decimals - Decimales a mostrar (default: 1)
 * @param locale - Locale (default: 'es-ES')
 * @returns Porcentaje formateado
 */
export const formatPercentage = (value: number, decimals: number = 1, locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Redondea un número a decimales específicos
 * @param num - Número a redondear
 * @param decimals - Número de decimales
 * @returns Número redondeado
 */
export const roundToDecimals = (num: number, decimals: number): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Clamp - limita un número entre un mínimo y máximo
 * @param num - Número a limitar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Número limitado
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Genera un número aleatorio entre min y max
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Número aleatorio
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Convierte número a formato ordinal (1st, 2nd, 3rd, etc.)
 * @param num - Número
 * @param locale - Locale (default: 'en')
 * @returns Número ordinal
 */
export const toOrdinal = (num: number, locale: string = 'en'): string => {
  if (locale === 'es') {
    return `${num}º`;
  }

  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

/**
 * Convierte número a palabras en español
 * @param num - Número (0-999)
 * @returns Número en palabras
 */
export const numberToWords = (num: number): string => {
  const ones = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  if (num === 0) return 'cero';
  if (num === 100) return 'cien';

  let result = '';

  if (num >= 100) {
    result += hundreds[Math.floor(num / 100)] + ' ';
    num %= 100;
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    if (num % 10 > 0) {
      result += ' y ' + ones[num % 10];
    }
  } else if (num >= 10) {
    result += teens[num - 10];
  } else if (num > 0) {
    result += ones[num];
  }

  return result.trim();
};

/**
 * Valida si un string es un número válido
 * @param value - String a validar
 * @returns true si es un número válido
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Formatea un número con ceros a la izquierda
 * @param num - Número a formatear
 * @param length - Longitud total deseada
 * @returns Número con ceros a la izquierda
 */
export const padNumber = (num: number, length: number): string => {
  return num.toString().padStart(length, '0');
};

/**
 * Calcula el promedio de un array de números
 * @param numbers - Array de números
 * @returns Promedio
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

/**
 * Encuentra el valor máximo en un array
 * @param numbers - Array de números
 * @returns Valor máximo
 */
export const max = (numbers: number[]): number => {
  return Math.max(...numbers);
};

/**
 * Encuentra el valor mínimo en un array
 * @param numbers - Array de números
 * @returns Valor mínimo
 */
export const min = (numbers: number[]): number => {
  return Math.min(...numbers);
};

/**
 * Suma todos los valores de un array
 * @param numbers - Array de números
 * @returns Suma total
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((total, num) => total + num, 0);
};

/**
 * Convierte grados a radianes
 * @param degrees - Grados
 * @returns Radianes
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convierte radianes a grados
 * @param radians - Radianes
 * @returns Grados
 */
export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calcula el porcentaje de un valor respecto a un total
 * @param value - Valor
 * @param total - Total
 * @returns Porcentaje (0-100)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};
