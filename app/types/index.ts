// Tipos globales de la aplicación

// Tipos de navegación
export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: { userId?: string };
  SettingsScreen: undefined;
};

// Tipos de usuario
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Tipos de API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Tipos de formularios
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface LoginForm extends Record<string, FormField> {
  email: FormField;
  password: FormField;
}

// Tipos de tema
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  border: string;
}

// Tipos de configuración
export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

// Tipos de estado global (para Context API o Redux)
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'es' | 'en';
}

// Tipos de componentes comunes
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

// Tipos de utilidades
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};