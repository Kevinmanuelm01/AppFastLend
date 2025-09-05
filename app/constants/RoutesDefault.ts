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
  
  // Company Stack
  COMPANY_REGISTRATION: 'CompanyRegistration',
  COMPANY_LIST: 'CompanyList',
  COMPANY_DETAILS: 'CompanyDetails',
  COMPANY_EDIT: 'CompanyEdit',
  
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
  COMPANY: ['CompanyRegistration', 'CompanyList', 'CompanyDetails', 'CompanyEdit'],
  TABS: ['TabHome', 'TabSearch', 'TabNotifications', 'TabProfile'],
} as const;

// Parámetros de rutas (para navegación tipada)
export type RootStackParamList = {
  // Auth Stack
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  
  // Main Stack
  Main: undefined;
  HomeScreen: undefined;
  ProfileScreen: { userId?: string };
  SettingsScreen: undefined;
  
  // Company Stack
  Company: undefined;
  CompanyRegistration: undefined;
  CompanyList: undefined;
  CompanyDetails: { companyId: string };
  CompanyEdit: { companyId: string };
  
  // Modal Screens
  ModalExample: { title: string; data?: any };
};

// Navegadores principales
export type MainNavigatorParamList = {
  Auth: undefined;
  Main: undefined;
  Company: undefined;
};

// Tipos para TypeScript
export type RouteNames = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteNames];