// 🔐 Tipos de Autenticación para App de Préstamos

// Roles del sistema
export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  ACCOUNTING = 'ACCOUNTING',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

// Permisos del sistema
export enum Permission {
  // Préstamos
  VIEW_LOANS = 'VIEW_LOANS',
  CREATE_LOANS = 'CREATE_LOANS',
  APPROVE_LOANS = 'APPROVE_LOANS',
  REJECT_LOANS = 'REJECT_LOANS',
  
  // Usuarios
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Reportes
  VIEW_REPORTS = 'VIEW_REPORTS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',
  
  // Configuración
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

// Usuario base
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Cliente específico (extiende User)
export interface Client extends User {
  role: UserRole.CLIENT;
  // Información específica del cliente
  documentType: 'DNI' | 'PASSPORT' | 'LICENSE';
  documentNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  employmentInfo: {
    company: string;
    position: string;
    monthlyIncome: number;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'FREELANCE' | 'UNEMPLOYED';
  };
  creditScore?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Empleado interno
export interface Employee extends User {
  role: UserRole.ADMIN | UserRole.ACCOUNTING | UserRole.CUSTOMER_SERVICE;
  employeeId: string;
  department: string;
  hireDate: string;
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Datos de registro
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  // Campos adicionales para clientes
  documentType?: 'DNI' | 'PASSPORT' | 'LICENSE';
  documentNumber?: string;
  dateOfBirth?: string;
  termsAccepted: boolean;
}

// Respuesta de autenticación
export interface AuthResponse {
  user: User | Client | Employee;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Estado de autenticación
export interface AuthState {
  user: User | Client | Employee | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Contexto de autenticación
export interface AuthContextType {
  // Estado
  authState: AuthState;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  // Utilidades
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  isClient: () => boolean;
  isEmployee: () => boolean;
}

// Errores de autenticación
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// Validación de formularios
export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentNumber?: string;
  general?: string;
}

// Configuración de 2FA
export interface TwoFactorAuth {
  isEnabled: boolean;
  method: 'SMS' | 'EMAIL' | 'AUTHENTICATOR';
  backupCodes?: string[];
}

// Token de recuperación
export interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: string;
}

// Configuración de sesión
export interface SessionConfig {
  timeout: number; // en minutos
  maxConcurrentSessions: number;
  requireReauthForSensitive: boolean;
}

// Audit log para autenticación
export interface AuthAuditLog {
  id: string;
  userId: string;
  action: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PASSWORD_RESET' | 'PROFILE_UPDATE';
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
  timestamp: string;
}

// Tipos para navegación
export type AuthStackParamList = {
  Login: undefined;
  Register: { role?: UserRole };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  TwoFactor: { method?: 'SMS' | 'EMAIL' | 'AUTHENTICATOR'; phone?: string; email?: string };
  Profile: undefined;
};

// Tipos para hooks
export interface UseAuthReturn extends AuthContextType {}

export interface UseFormValidationReturn {
  errors: FormErrors;
  validateField: (field: string, value: string) => string | undefined;
  validateForm: (data: any) => FormErrors;
  clearErrors: () => void;
}

// Configuración de la app
export interface AuthConfig {
  apiBaseUrl: string;
  tokenStorageKey: string;
  refreshTokenStorageKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export default {
  UserRole,
  Permission,
};