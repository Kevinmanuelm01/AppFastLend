// Utilidades para manejo de fechas y tiempo

/**
 * Formatea una fecha en formato legible
 * @param date - Fecha a formatear (Date o string)
 * @param locale - Locale para formateo (default: 'es-ES')
 * @returns Fecha formateada
 */
export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea fecha y hora
 * @param date - Fecha a formatear (Date o string)
 * @param locale - Locale para formateo (default: 'es-ES')
 * @returns Fecha y hora formateadas
 */
export const formatDateTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea fecha en formato corto (DD/MM/YYYY)
 * @param date - Fecha a formatear
 * @param separator - Separador a usar (default: '/')
 * @returns Fecha en formato corto
 */
export const formatDateShort = (date: Date | string, separator: string = '/'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
};

/**
 * Formatea hora en formato 24h
 * @param date - Fecha/hora a formatear
 * @returns Hora en formato HH:MM
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Obtiene fecha relativa (hace X tiempo)
 * @param date - Fecha a comparar
 * @returns String con tiempo relativo
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `Hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Verifica si una fecha es hoy
 * @param date - Fecha a verificar
 * @returns true si la fecha es hoy
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
};

/**
 * Verifica si una fecha es ayer
 * @param date - Fecha a verificar
 * @returns true si la fecha es ayer
 */
export const isYesterday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.getDate() === yesterday.getDate() && dateObj.getMonth() === yesterday.getMonth() && dateObj.getFullYear() === yesterday.getFullYear();
};

/**
 * Obtiene el inicio del día para una fecha
 * @param date - Fecha
 * @returns Nueva fecha al inicio del día (00:00:00)
 */
export const startOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Obtiene el final del día para una fecha
 * @param date - Fecha
 * @returns Nueva fecha al final del día (23:59:59)
 */
export const endOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Agrega días a una fecha
 * @param date - Fecha base
 * @param days - Número de días a agregar
 * @returns Nueva fecha
 */
export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns Diferencia en días
 */
export const daysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formatea duración en milisegundos a formato legible
 * @param milliseconds - Milisegundos
 * @returns String formateado (ej: "2h 30m 15s")
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Convierte timestamp a fecha
 * @param timestamp - Timestamp en segundos o milisegundos
 * @returns Objeto Date
 */
export const timestampToDate = (timestamp: number): Date => {
  // Si el timestamp es en segundos (10 dígitos), convertir a milisegundos
  const ms = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  return new Date(ms);
};
