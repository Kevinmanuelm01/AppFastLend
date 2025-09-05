// 🔐 Contexto de Autenticación Simplificado - AppFastLend

import React, { createContext, useContext, ReactNode } from 'react';

// Tipos básicos
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider simplificado
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>(initialState);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 1000));

    setAuthState({
      user: {
        id: '1',
        email,
        firstName: 'Usuario',
        lastName: 'Test',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const logout = async () => {
    setAuthState(initialState);
  };

  const register = async (data: any) => {
    // Simulación de registro
    console.log('Register:', data);
  };

  const updateProfile = async (data: Partial<User>) => {
    // Simulación de actualización de perfil
    console.log('Update profile:', data);
  };

  const clearError = () => {
    // Limpiar error
    console.log('Clear error');
  };

  const contextValue: AuthContextType = {
    authState,
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
