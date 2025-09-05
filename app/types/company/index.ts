// 🏢 Tipos para el módulo de empresas

export enum CompanySize {
  MICRO = 'MICRO', // 1-10 empleados
  SMALL = 'SMALL', // 11-50 empleados
  MEDIUM = 'MEDIUM', // 51-250 empleados
  LARGE = 'LARGE', // 250+ empleados
}

export enum CompanyType {
  CORPORATION = 'CORPORATION', // Sociedad Anónima
  LLC = 'LLC', // Sociedad de Responsabilidad Limitada
  PARTNERSHIP = 'PARTNERSHIP', // Sociedad
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP', // Empresa Individual
  COOPERATIVE = 'COOPERATIVE', // Cooperativa
  NON_PROFIT = 'NON_PROFIT', // Sin fines de lucro
}

export enum IndustryType {
  TECHNOLOGY = 'TECHNOLOGY',
  FINANCE = 'FINANCE',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  RETAIL = 'RETAIL',
  MANUFACTURING = 'MANUFACTURING',
  CONSTRUCTION = 'CONSTRUCTION',
  AGRICULTURE = 'AGRICULTURE',
  TRANSPORTATION = 'TRANSPORTATION',
  HOSPITALITY = 'HOSPITALITY',
  REAL_ESTATE = 'REAL_ESTATE',
  CONSULTING = 'CONSULTING',
  OTHER = 'OTHER',
}

export enum CompanyStatus {
  PENDING = 'PENDING', // Pendiente de aprobación
  APPROVED = 'APPROVED', // Aprobada
  REJECTED = 'REJECTED', // Rechazada
  SUSPENDED = 'SUSPENDED', // Suspendida
  ACTIVE = 'ACTIVE', // Activa
  INACTIVE = 'INACTIVE', // Inactiva
}

// 🏢 Interfaz principal de empresa
export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string; // RNC, RUT, etc.
  email: string;
  phone: string;
  website?: string;
  
  // Información legal
  companyType: CompanyType;
  registrationNumber: string;
  registrationDate: string;
  
  // Clasificación
  industry: IndustryType;
  companySize: CompanySize;
  employeeCount: number;
  
  // Dirección
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Información financiera
  annualRevenue?: number;
  creditRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';
  
  // Estado y metadatos
  status: CompanyStatus;
  isVerified: boolean;
  verificationDate?: string;
  
  // Representante legal
  legalRepresentative: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    documentType: 'DNI' | 'PASSPORT' | 'LICENSE';
    documentNumber: string;
  };
  
  // Documentos
  documents: {
    businessLicense?: string; // URL del documento
    taxCertificate?: string;
    bankStatement?: string;
    incorporationCertificate?: string;
  };
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID del usuario que registró la empresa
}

// 📝 Datos para registro de empresa
export interface CompanyRegistrationData {
  // Información básica
  name: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  website?: string;
  
  // Información legal
  companyType: CompanyType;
  registrationNumber: string;
  registrationDate: string;
  
  // Clasificación
  industry: IndustryType;
  companySize: CompanySize;
  employeeCount: number;
  
  // Dirección
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Información financiera opcional
  annualRevenue?: number;
  
  // Representante legal
  legalRepresentative: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    documentType: 'DNI' | 'PASSPORT' | 'LICENSE';
    documentNumber: string;
  };
  
  // Términos y condiciones
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

// 🔍 Filtros para búsqueda de empresas
export interface CompanyFilters {
  status?: CompanyStatus[];
  industry?: IndustryType[];
  companySize?: CompanySize[];
  companyType?: CompanyType[];
  isVerified?: boolean;
  country?: string;
  state?: string;
  city?: string;
  minRevenue?: number;
  maxRevenue?: number;
  registrationDateFrom?: string;
  registrationDateTo?: string;
}

// 📊 Estadísticas de empresa
export interface CompanyStats {
  totalCompanies: number;
  companiesByStatus: Record<CompanyStatus, number>;
  companiesByIndustry: Record<IndustryType, number>;
  companiesBySize: Record<CompanySize, number>;
  averageRevenue: number;
  verificationRate: number;
}

// 🎯 Contexto de empresas
export interface CompanyContextType {
  // Estado
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  registerCompany: (data: CompanyRegistrationData) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompany: (id: string) => Promise<Company | null>;
  getCompanies: (filters?: CompanyFilters) => Promise<Company[]>;
  verifyCompany: (id: string) => Promise<void>;
  
  // Utilidades
  setCurrentCompany: (company: Company | null) => void;
  clearError: () => void;
}

// 🗂️ Errores específicos de empresas
export interface CompanyError {
  code: string;
  message: string;
  field?: string;
}

// 📋 Errores de formulario
export interface CompanyFormErrors {
  name?: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  registrationNumber?: string;
  employeeCount?: string;
  annualRevenue?: string;
  'address.street'?: string;
  'address.city'?: string;
  'address.state'?: string;
  'address.zipCode'?: string;
  'legalRepresentative.firstName'?: string;
  'legalRepresentative.lastName'?: string;
  'legalRepresentative.email'?: string;
  'legalRepresentative.phone'?: string;
  'legalRepresentative.documentNumber'?: string;
  general?: string;
}

// 🚀 Navegación de empresas
export type CompanyStackParamList = {
  CompanyList: undefined;
  CompanyRegistration: undefined;
  CompanyDetails: { companyId: string };
  CompanyEdit: { companyId: string };
  CompanyVerification: { companyId: string };
};

export default {
  CompanySize,
  CompanyType,
  IndustryType,
  CompanyStatus,
};