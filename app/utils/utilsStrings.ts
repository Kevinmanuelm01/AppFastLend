// Utilidades para manejo de strings y texto

/**
 * Valida si un email tiene formato correcto
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
 * @param password - Contraseña a validar
 * @returns true si la contraseña cumple los criterios
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena con primera letra en mayúscula
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formatea un nombre completo
 * @param firstName - Nombre
 * @param lastName - Apellido
 * @returns Nombre completo formateado
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};

/**
 * Trunca un texto a una longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Obtiene las iniciales de un nombre
 * @param name - Nombre completo
 * @returns Iniciales (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Convierte un string a slug (URL friendly)
 * @param text - Texto a convertir
 * @returns Slug generado
 */
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones con un solo guión
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
};

/**
 * Formatea un número de teléfono
 * @param phone - Número de teléfono
 * @returns Número formateado
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Genera un ID único simple
 * @returns ID único basado en timestamp y random
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Convierte texto a camelCase
 * @param str - String a convertir
 * @returns String en camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Convierte texto a PascalCase
 * @param str - String a convertir
 * @returns String en PascalCase
 */
export const toPascalCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
};

/**
 * Limpia espacios extra y normaliza texto
 * @param text - Texto a limpiar
 * @returns Texto limpio
 */
export const cleanText = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};
