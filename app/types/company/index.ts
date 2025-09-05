// 🏢 Tipos para el módulo de empresas - Versión mejorada

export enum CompanySize {
  MICRO = 'MICRO', // 1-10 empleados
  SMALL = 'SMALL', // 11-50 empleados
  MEDIUM = 'MEDIUM', // 51-250 empleados
  LARGE = 'LARGE', // 250+ empleados
}

export enum CompanyType {
  PERSONA_JURIDICA = 'PERSONA_JURIDICA', // Persona Jurídica
  EMPRESA_COMERCIAL = 'EMPRESA_COMERCIAL', // Empresa Comercial
  CORPORATION = 'CORPORATION', // Sociedad Anónima
  LLC = 'LLC', // Sociedad de Responsabilidad Limitada
  PARTNERSHIP = 'PARTNERSHIP', // Sociedad
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP', // Empresa Individual
  COOPERATIVE = 'COOPERATIVE', // Cooperativa
  NON_PROFIT = 'NON_PROFIT', // Sin fines de lucro
}

export enum DocumentType {
  CEDULA = 'CEDULA', // Cédula de identidad
  RNC = 'RNC', // Registro Nacional del Contribuyente
  PASSPORT = 'PASSPORT', // Pasaporte
  LICENSE = 'LICENSE', // Licencia
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
  SERVICES = 'SERVICES',
  COMMERCE = 'COMMERCE',
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
  
  // Información básica
  companyType: CompanyType;
  
  // Para Persona Jurídica
  firstName?: string;
  lastName?: string;
  
  // Para Empresa Comercial
  businessName?: string; // Nombre comercial
  legalName?: string; // Razón social
  
  // Documentación
  documentType: DocumentType;
  documentNumber: string; // Cédula o RNC
  
  // Fechas importantes
  registrationDate: string; // Fecha de registro en el sistema
  companyFoundationDate: string; // Fecha de creación de la empresa
  
  // Información de contacto
  email: string;
  phone: string;
  website?: string;
  
  // Ubicación
  address: {
    street: string; // Dirección del establecimiento
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Clasificación
  industry: IndustryType;
  companySize: CompanySize;
  employeeCount?: number;
  
  // Información financiera
  annualRevenue?: number;
  creditRating?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';
  
  // Estado y metadatos
  status: CompanyStatus;
  isVerified: boolean;
  verificationDate?: string;
  
  // Representante legal (para empresas comerciales)
  legalRepresentative?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    documentType: DocumentType;
    documentNumber: string;
  };
  
  // Documentos
  documents: {
    businessLicense?: string; // URL del documento
    taxCertificate?: string;
    bankStatement?: string;
    incorporationCertificate?: string;
    mercantileRegistration?: string; // Certificado de registro mercantil (opcional)
  };
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string; // ID del usuario que registró la empresa
}

// 📝 Datos para registro de empresa
export interface CompanyRegistrationData {
  // Tipo de entidad
  companyType: CompanyType;
  
  // Para Persona Jurídica
  firstName?: string;
  lastName?: string;
  
  // Para Empresa Comercial
  businessName?: string; // Nombre comercial
  legalName?: string; // Razón social
  
  // Documentación
  documentType: DocumentType;
  documentNumber: string; // Cédula o RNC
  
  // Fechas
  registrationDate: string; // Fecha de registro
  companyFoundationDate: string; // Fecha de creación de la empresa
  
  // Información de contacto
  email: string;
  phone: string;
  website?: string;
  
  // Ubicación
  address: {
    street: string; // Dirección del establecimiento
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Clasificación
  industry: IndustryType;
  companySize: CompanySize;
  employeeCount?: number;
  
  // Información financiera opcional
  annualRevenue?: number;
  
  // Representante legal (para empresas comerciales)
  legalRepresentative?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    documentType: DocumentType;
    documentNumber: string;
  };
  
  // Documentos opcionales
  documents?: {
    mercantileRegistration?: File; // Certificado de registro mercantil (opcional)
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
  documentType?: DocumentType[];
  isVerified?: boolean;
  country?: string;
  state?: string;
  city?: string;
  minRevenue?: number;
  maxRevenue?: number;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  foundationDateFrom?: string;
  foundationDateTo?: string;
}

// 📊 Estadísticas de empresa
export interface CompanyStats {
  totalCompanies: number;
  companiesByStatus: Record<CompanyStatus, number>;
  companiesByIndustry: Record<IndustryType, number>;
  companiesBySize: Record<CompanySize, number>;
  companiesByType: Record<CompanyType, number>;
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
  companyType?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  legalName?: string;
  documentType?: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  registrationDate?: string;
  companyFoundationDate?: string;
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
  DocumentType,
  IndustryType,
  CompanyStatus,
};