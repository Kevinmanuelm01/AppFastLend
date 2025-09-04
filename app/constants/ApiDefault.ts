// Configuración de API por defecto
export const API_CONFIG = {
  baseURL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.tudominio.com',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Endpoints de la API
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
  },
  user: {
    profile: '/user/profile',
    update: '/user/update',
    delete: '/user/delete',
  },
  // Agregar más endpoints según necesidades
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Tipos para TypeScript
export type ApiConfig = typeof API_CONFIG;
export type ApiEndpoints = typeof API_ENDPOINTS;
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];