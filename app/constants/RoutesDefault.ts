// Rutas de navegación por defecto
export const ROUTES = {
  // Auth Stack
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen',
  
  // Main Stack
  HOME: 'HomeScreen',
  PROFILE: 'ProfileScreen',
  SETTINGS: 'SettingsScreen',
  
  // Tab Navigation
  TAB_HOME: 'TabHome',
  TAB_SEARCH: 'TabSearch',
  TAB_NOTIFICATIONS: 'TabNotifications',
  TAB_PROFILE: 'TabProfile',
  
  // Modal Screens
  MODAL_EXAMPLE: 'ModalExample',
} as const;

// Grupos de rutas para mejor organización
export const ROUTE_GROUPS = {
  AUTH: ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen'],
  MAIN: ['HomeScreen', 'ProfileScreen', 'SettingsScreen'],
  TABS: ['TabHome', 'TabSearch', 'TabNotifications', 'TabProfile'],
} as const;

// Parámetros de rutas (para navegación tipada)
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: { userId?: string };
  SettingsScreen: undefined;
  ModalExample: { title: string; data?: any };
};

// Tipos para TypeScript
export type RouteNames = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteNames];