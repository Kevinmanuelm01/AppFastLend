// 👥 Tipos para el módulo de clientes - Sistema completo de gestión

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED',
}

export enum DocumentType {
  CEDULA = 'CEDULA',
  PASSPORT = 'PASSPORT',
  LICENSE = 'LICENSE',
  RNC = 'RNC',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  FREELANCE = 'FREELANCE',
  UNEMPLOYED = 'UNEMPLOYED',
  RETIRED = 'RETIRED',
  STUDENT = 'STUDENT',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export enum BankType {
  BANCO_POPULAR = 'BANCO_POPULAR',
  BANCO_RESERVAS = 'BANCO_RESERVAS',
  BANCO_BHD = 'BANCO_BHD',
  BANESCO = 'BANESCO',
  BANCO_SANTA_CRUZ = 'BANCO_SANTA_CRUZ',
  BANCO_PROMERICA = 'BANCO_PROMERICA',
  OTHER = 'OTHER',
}

// 👤 Interfaz principal del cliente
export interface Client {
  id: string;
  
  // Información personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Documentación
  documentType: DocumentType;
  documentNumber: string;
  
  // Dirección
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Información laboral
  employmentInfo: {
    company: string;
    position: string;
    monthlyIncome: number;
    employmentType: EmploymentType;
    workPhone?: string;
    workAddress?: string;
    yearsInCompany?: number;
  };
  
  // Información financiera
  creditScore?: number;
  riskLevel: RiskLevel;
  monthlyExpenses?: number;
  otherIncome?: number;
  
  // Información bancaria
  bankingInfo: {
    primaryBank: BankType;
    accountNumber: string;
    accountType: 'SAVINGS' | 'CHECKING';
    bankBranch?: string;
    // ADVERTENCIA: Información sensible - manejar con extrema precaución
    onlineBankingCredentials?: {
      username: string;
      // NUNCA almacenar contraseñas en texto plano en producción
      encryptedPassword?: string;
      lastAccessDate?: string;
      isActive: boolean;
    };
  };
  
  // Historial y estado
  status: ClientStatus;
  registrationDate: string;
  lastLoginDate?: string;
  verificationDate?: string;
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID del empleado que creó el cliente
  updatedBy?: string; // ID del empleado que actualizó por última vez
  
  // Notas internas (solo para empleados)
  internalNotes?: string;
  
  // Configuraciones
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsAlerts: boolean;
    language: 'es' | 'en';
  };
}

// 📝 Datos para crear/actualizar cliente
export interface ClientFormData {
  // Información personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Documentación
  documentType: DocumentType;
  documentNumber: string;
  
  // Dirección
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Información laboral
  employmentInfo: {
    company: string;
    position: string;
    monthlyIncome: number;
    employmentType: EmploymentType;
    workPhone?: string;
    workAddress?: string;
    yearsInCompany?: number;
  };
  
  // Información financiera
  monthlyExpenses?: number;
  otherIncome?: number;
  
  // Información bancaria
  bankingInfo: {
    primaryBank: BankType;
    accountNumber: string;
    accountType: 'SAVINGS' | 'CHECKING';
    bankBranch?: string;
  };
  
  // Notas internas
  internalNotes?: string;
  
  // Configuraciones
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsAlerts: boolean;
    language: 'es' | 'en';
  };
}

// 🔍 Filtros para búsqueda de clientes
export interface ClientFilters {
  status?: ClientStatus[];
  riskLevel?: RiskLevel[];
  employmentType?: EmploymentType[];
  primaryBank?: BankType[];
  documentType?: DocumentType[];
  minIncome?: number;
  maxIncome?: number;
  minCreditScore?: number;
  maxCreditScore?: number;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  city?: string;
  state?: string;
  searchTerm?: string; // Para buscar por nombre, email, documento
}

// 📊 Estadísticas de clientes
export interface ClientStats {
  totalClients: number;
  activeClients: number;
  clientsByStatus: Record<ClientStatus, number>;
  clientsByRisk: Record<RiskLevel, number>;
  averageIncome: number;
  averageCreditScore: number;
  newClientsThisMonth: number;
}

// 🏦 Información de acceso bancario
export interface BankAccessInfo {
  bankType: BankType;
  bankUrl: string;
  loginFields: {
    usernameField: string;
    passwordField: string;
    submitButton: string;
  };
  securityWarnings: string[];
}

// 🎯 Contexto de clientes
export interface ClientContextType {
  // Estado
  clients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones CRUD
  createClient: (data: ClientFormData) => Promise<void>;
  updateClient: (id: string, data: Partial<ClientFormData>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Promise<Client | null>;
  getClients: (filters?: ClientFilters) => Promise<Client[]>;
  
  // Acciones específicas
  activateClient: (id: string) => Promise<void>;
  deactivateClient: (id: string) => Promise<void>;
  updateRiskLevel: (id: string, riskLevel: RiskLevel) => Promise<void>;
  
  // Acceso bancario (ADVERTENCIA: Funcionalidad de alto riesgo)
  initiateBankAccess: (clientId: string) => Promise<{ success: boolean; url?: string; warnings: string[] }>;
  
  // Utilidades
  setCurrentClient: (client: Client | null) => void;
  clearError: () => void;
  getClientStats: () => Promise<ClientStats>;
}

// 🗂️ Errores específicos de clientes
export interface ClientError {
  code: string;
  message: string;
  field?: string;
}

// 📋 Errores de formulario
export interface ClientFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  documentType?: string;
  documentNumber?: string;
  'address.street'?: string;
  'address.city'?: string;
  'address.state'?: string;
  'address.zipCode'?: string;
  'employmentInfo.company'?: string;
  'employmentInfo.position'?: string;
  'employmentInfo.monthlyIncome'?: string;
  'bankingInfo.accountNumber'?: string;
  general?: string;
}

// 🚀 Navegación de clientes
export type ClientStackParamList = {
  ClientList: undefined;
  ClientDetails: { clientId: string };
  ClientCreate: undefined;
  ClientEdit: { clientId: string };
  ClientBankAccess: { clientId: string };
};

// 🏦 Configuración de bancos
export const BANK_CONFIGS: Record<BankType, BankAccessInfo> = {
  [BankType.BANCO_POPULAR]: {
    bankType: BankType.BANCO_POPULAR,
    bankUrl: 'https://www.popularenlinea.com',
    loginFields: {
      usernameField: '#username',
      passwordField: '#password',
      submitButton: '#login-button',
    },
    securityWarnings: [
      'Esta funcionalidad accede directamente a la banca en línea',
      'Requiere credenciales del cliente',
      'Debe ser autorizada explícitamente por el cliente',
      'Cumple con regulaciones de protección de datos',
    ],
  },
  [BankType.BANCO_RESERVAS]: {
    bankType: BankType.BANCO_RESERVAS,
    bankUrl: 'https://www.banreservas.com.do',
    loginFields: {
      usernameField: '#user',
      passwordField: '#pass',
      submitButton: '#submit',
    },
    securityWarnings: [
      'Acceso directo a banca en línea de BanReservas',
      'Requiere autorización del cliente',
      'Información encriptada y protegida',
    ],
  },
  [BankType.BANCO_BHD]: {
    bankType: BankType.BANCO_BHD,
    bankUrl: 'https://www.bhdleon.com.do',
    loginFields: {
      usernameField: '#usuario',
      passwordField: '#clave',
      submitButton: '#ingresar',
    },
    securityWarnings: [
      'Acceso a BHD León en línea',
      'Protocolo de seguridad bancaria',
      'Autorización requerida del titular',
    ],
  },
  [BankType.BANESCO]: {
    bankType: BankType.BANESCO,
    bankUrl: 'https://www.banesco.com.do',
    loginFields: {
      usernameField: '#username',
      passwordField: '#password',
      submitButton: '#login',
    },
    securityWarnings: [
      'Acceso a Banesco en línea',
      'Cumplimiento de normativas bancarias',
      'Consentimiento explícito requerido',
    ],
  },
  [BankType.BANCO_SANTA_CRUZ]: {
    bankType: BankType.BANCO_SANTA_CRUZ,
    bankUrl: 'https://www.bsc.com.do',
    loginFields: {
      usernameField: '#user',
      passwordField: '#password',
      submitButton: '#login-btn',
    },
    securityWarnings: [
      'Acceso a Banco Santa Cruz',
      'Protocolo de seguridad implementado',
      'Autorización del cliente necesaria',
    ],
  },
  [BankType.BANCO_PROMERICA]: {
    bankType: BankType.BANCO_PROMERICA,
    bankUrl: 'https://www.promerica.com.do',
    loginFields: {
      usernameField: '#username',
      passwordField: '#password',
      submitButton: '#submit-login',
    },
    securityWarnings: [
      'Acceso a Promerica en línea',
      'Medidas de seguridad bancaria',
      'Consentimiento informado requerido',
    ],
  },
  [BankType.OTHER]: {
    bankType: BankType.OTHER,
    bankUrl: '',
    loginFields: {
      usernameField: '',
      passwordField: '',
      submitButton: '',
    },
    securityWarnings: [
      'Banco no configurado',
      'Contactar administrador para configuración',
    ],
  },
};

export default {
  ClientStatus,
  DocumentType,
  EmploymentType,
  RiskLevel,
  BankType,
  BANK_CONFIGS,
};