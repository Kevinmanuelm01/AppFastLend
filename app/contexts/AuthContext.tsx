// 🔐 Contexto de Autenticación Completo - AppFastLend

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Alert } from 'react-native';
import {
  User,
  Client,
  Employee,
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserRole,
  Permission,
  AuthError,
  TwoFactorAuth,
  PasswordResetToken,
} from '../types/auth';

// 📱 Configuración de almacenamiento seguro
const authStorage = new MMKV({
  id: 'auth-storage',
  encryptionKey: 'loans-app-auth-key-2024-secure',
});

const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  REMEMBER_ME: 'remember_me',
  LAST_LOGIN: 'last_login',
  LOGIN_ATTEMPTS: 'login_attempts',
  LOCKOUT_UNTIL: 'lockout_until',
} as const;

// 🔄 Acciones del reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_TOKENS'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INCREMENT_LOGIN_ATTEMPTS' }
  | { type: 'RESET_LOGIN_ATTEMPTS' }
  | { type: 'SET_LOCKOUT'; payload: number };

// 🏗️ Estado inicial
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 🔄 Reducer para manejo de estado
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// 🏗️ Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🏗️ Proveedor de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔄 Cargar datos de autenticación al iniciar
  useEffect(() => {
    loadAuthData();
  }, []);

  // 💾 Guardar datos de autenticación
  const saveAuthData = (authResponse: AuthResponse) => {
    try {
      authStorage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
      authStorage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
      authStorage.set(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
      authStorage.set(AUTH_STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  // 📖 Cargar datos de autenticación
  const loadAuthData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const accessToken = authStorage.getString(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = authStorage.getString(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      const userData = authStorage.getString(AUTH_STORAGE_KEYS.USER_DATA);

      if (accessToken && refreshToken && userData) {
        const user = JSON.parse(userData) as User;

        // Verificar si el token sigue siendo válido
        const isTokenValid = await validateToken(accessToken);

        if (isTokenValid) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              accessToken,
              refreshToken,
              expiresIn: 3600, // 1 hora
            },
          });
        } else {
          // Intentar refrescar el token
          await refreshAuth();
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos de autenticación' });
    }
  };

  // 🔐 Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Verificar si la cuenta está bloqueada
      const lockoutUntil = authStorage.getNumber(AUTH_STORAGE_KEYS.LOCKOUT_UNTIL);
      if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 60000);
        throw new Error(`Cuenta bloqueada. Intenta en ${remainingTime} minutos.`);
      }

      // Simular llamada a API
      const response = await simulateLogin(credentials);

      if (response.success) {
        // Reset intentos de login
        authStorage.delete(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS);
        authStorage.delete(AUTH_STORAGE_KEYS.LOCKOUT_UNTIL);

        // Guardar datos
        saveAuthData(response.data);

        // Guardar preferencia de recordar
        if (credentials.rememberMe) {
          authStorage.set(AUTH_STORAGE_KEYS.REMEMBER_ME, true);
        }

        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      } else {
        // Incrementar intentos fallidos
        const attempts = (authStorage.getNumber(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS) || 0) + 1;
        authStorage.set(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS, attempts);

        // Bloquear después de 5 intentos
        if (attempts >= 5) {
          const lockoutTime = Date.now() + (15 * 60 * 1000); // 15 minutos
          authStorage.set(AUTH_STORAGE_KEYS.LOCKOUT_UNTIL, lockoutTime);
          throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.');
        }

        throw new Error(response.error || 'Credenciales inválidas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // 📝 Registro
  const register = async (data: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simular registro
      const response = await simulateRegister(data);

      if (response.success) {
        // Auto-login después del registro
        await login({
          email: data.email,
          password: data.password,
          rememberMe: false,
        });
      } else {
        throw new Error(response.error || 'Error en el registro');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de registro';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // 🚪 Logout
  const logout = async (): Promise<void> => {
    try {
      // Limpiar almacenamiento
      authStorage.delete(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      authStorage.delete(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      authStorage.delete(AUTH_STORAGE_KEYS.USER_DATA);

      // Mantener remember me si está activado
      const rememberMe = authStorage.getBoolean(AUTH_STORAGE_KEYS.REMEMBER_ME);
      if (!rememberMe) {
        authStorage.clearAll();
      }

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // 🔄 Refrescar autenticación
  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshToken = authStorage.getString(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Simular refresh token
      const response = await simulateRefreshToken(refreshToken);

      if (response.success) {
        authStorage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
        authStorage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

        dispatch({
          type: 'SET_TOKENS',
          payload: {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        });
      } else {
        // Token refresh falló, hacer logout
        await logout();
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await logout();
    }
  };

  // 🔑 Recuperar contraseña
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simular envío de email
      await simulateForgotPassword(email);

      dispatch({ type: 'SET_LOADING', payload: false });

      Alert.alert(
        '📧 Email Enviado',
        'Se ha enviado un enlace de recuperación a tu email.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar email';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // 🔐 Restablecer contraseña
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simular reset de contraseña
      const response = await simulateResetPassword(token, newPassword);

      if (response.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        Alert.alert(
          '✅ Contraseña Actualizada',
          'Tu contraseña ha sido actualizada exitosamente.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(response.error || 'Error al restablecer contraseña');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al restablecer contraseña';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // ✏️ Actualizar perfil
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simular actualización
      await simulateUpdateProfile(data);

      // Actualizar usuario en estado
      dispatch({ type: 'UPDATE_USER', payload: data });

      // Actualizar en almacenamiento
      if (state.user) {
        const updatedUser = { ...state.user, ...data };
        authStorage.set(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // 🔍 Verificar permisos
  const hasPermission = (permission: Permission): boolean => {
    return state.user?.permissions.includes(permission) || false;
  };

  // 👤 Verificar rol
  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  // 👥 Verificar si es cliente
  const isClient = (): boolean => {
    return state.user?.role === UserRole.CLIENT;
  };

  // 👨‍💼 Verificar si es empleado
  const isEmployee = (): boolean => {
    return [UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.CUSTOMER_SERVICE].includes(
      state.user?.role as UserRole
    );
  };

  // 🧹 Limpiar error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 🎯 Valor del contexto
  const contextValue: AuthContextType = {
    authState: state,
    login,
    register,
    logout,
    refreshAuth,
    forgotPassword,
    resetPassword,
    updateProfile,
    hasPermission,
    hasRole,
    isClient,
    isEmployee,
    clearError,

  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// 🎭 Funciones de simulación (remover en producción)
const validateToken = async (token: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return token.length > 10; // Simulación simple
};

const simulateLogin = async (credentials: LoginCredentials) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simular diferentes usuarios
  if (credentials.email === 'admin@fastlend.com' && credentials.password === 'Yolo12345*') {
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email: 'admin@fastlend.com',
          firstName: 'Admin',
          lastName: 'FastLend',
          role: UserRole.ADMIN,
          permissions: [Permission.VIEW_LOANS, Permission.CREATE_LOANS, Permission.APPROVE_LOANS, Permission.VIEW_USERS, Permission.CREATE_USERS, Permission.MANAGE_SETTINGS],
          isActive: true,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Employee,
        accessToken: 'mock-access-token-admin',
        refreshToken: 'mock-refresh-token-admin',
        expiresIn: 3600,
      },
    };
  }

  if (credentials.email === 'cliente@test.com' && credentials.password === 'cliente123') {
    return {
      success: true,
      data: {
        user: {
          id: '2',
          email: 'cliente@test.com',
          firstName: 'Juan',
          lastName: 'Pérez',
          role: UserRole.CLIENT,
          permissions: [Permission.VIEW_LOANS, Permission.CREATE_LOANS],
          isActive: true,
          isEmailVerified: true,
          documentType: 'DNI',
          documentNumber: '12345678',
          dateOfBirth: '1990-01-01',
          address: {
            street: 'Calle Principal 123',
            city: 'Santo Domingo',
            state: 'Distrito Nacional',
            zipCode: '10101',
            country: 'República Dominicana',
          },
          employmentInfo: {
            company: 'Empresa Test',
            position: 'Desarrollador',
            monthlyIncome: 50000,
            employmentType: 'FULL_TIME',
          },
          riskLevel: 'LOW',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Client,
        accessToken: 'mock-access-token-client',
        refreshToken: 'mock-refresh-token-client',
        expiresIn: 3600,
      },
    };
  }

  return {
    success: false,
    error: 'Credenciales inválidas',
  };
};

const simulateRegister = async (data: RegisterData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simular validaciones
  if (data.email === 'admin@fastlend.com') {
    return {
      success: false,
      error: 'Este email ya está registrado',
    };
  }

  return {
    success: true,
    data: {
      message: 'Usuario registrado exitosamente',
    },
  };
};

const simulateRefreshToken = async (refreshToken: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    data: {
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    },
  };
};

const simulateForgotPassword = async (email: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!email.includes('@')) {
    throw new Error('Email inválido');
  }

  return { success: true };
};

const simulateResetPassword = async (token: string, newPassword: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (token.length < 10) {
    return {
      success: false,
      error: 'Token inválido o expirado',
    };
  }

  return { success: true };
};

const simulateUpdateProfile = async (data: Partial<User>) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export default AuthContext;