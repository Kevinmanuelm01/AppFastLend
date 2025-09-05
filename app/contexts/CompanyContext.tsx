// 🏢 Contexto de Empresas - App de Préstamos

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import {
  Company,
  CompanyContextType,
  CompanyRegistrationData,
  CompanyFilters,
  CompanyStatus,
  CompanyType,
  IndustryType,
  CompanySize,
  CompanyError,
} from '../types/company';

// 📱 Configuración de almacenamiento seguro para empresas
const companyStorage = new MMKV({
  id: 'company-storage',
  encryptionKey: 'loans-app-company-key-2024',
});

const COMPANY_STORAGE_KEYS = {
  COMPANIES: 'companies',
  CURRENT_COMPANY: 'current_company',
} as const;

// 🎯 Estado del contexto de empresas
interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

// 🔄 Acciones del reducer
type CompanyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COMPANIES'; payload: Company[] }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: { id: string; data: Partial<Company> } }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'SET_CURRENT_COMPANY'; payload: Company | null }
  | { type: 'CLEAR_ERROR' };

// 🏗️ Estado inicial
const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  isLoading: false,
  error: null,
};

// 🔄 Reducer para manejo de estado
const companyReducer = (state: CompanyState, action: CompanyAction): CompanyState => {
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
    
    case 'SET_COMPANIES':
      return {
        ...state,
        companies: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [...state.companies, action.payload],
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id
            ? { ...company, ...action.payload.data, updatedAt: new Date().toISOString() }
            : company
        ),
        currentCompany: state.currentCompany?.id === action.payload.id
          ? { ...state.currentCompany, ...action.payload.data, updatedAt: new Date().toISOString() }
          : state.currentCompany,
        isLoading: false,
        error: null,
      };
    
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        currentCompany: state.currentCompany?.id === action.payload ? null : state.currentCompany,
        isLoading: false,
        error: null,
      };
    
    case 'SET_CURRENT_COMPANY':
      return {
        ...state,
        currentCompany: action.payload,
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
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// 🏗️ Proveedor de empresas
interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  // 🔄 Cargar empresas al iniciar
  useEffect(() => {
    loadCompanies();
  }, []);

  // 💾 Guardar empresas en almacenamiento
  const saveCompanies = (companies: Company[]) => {
    try {
      companyStorage.set(COMPANY_STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    } catch (error) {
      console.error('Error saving companies:', error);
    }
  };

  // 📖 Cargar empresas desde almacenamiento
  const loadCompanies = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const savedCompanies = companyStorage.getString(COMPANY_STORAGE_KEYS.COMPANIES);
      if (savedCompanies) {
        const companies = JSON.parse(savedCompanies) as Company[];
        dispatch({ type: 'SET_COMPANIES', payload: companies });
      } else {
        dispatch({ type: 'SET_COMPANIES', payload: [] });
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar empresas' });
    }
  };

  // 📝 Registrar nueva empresa
  const registerCompany = async (data: CompanyRegistrationData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular registro de empresa
      const response = await simulateCompanyRegistration(data);
      
      if (response.success) {
        const newCompany = response.data;
        dispatch({ type: 'ADD_COMPANY', payload: newCompany });
        
        // Guardar en almacenamiento
        const updatedCompanies = [...state.companies, newCompany];
        saveCompanies(updatedCompanies);
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
      }
    } catch (error) {
      console.error('Error registering company:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al registrar empresa' });
    }
  };

  // ✏️ Actualizar empresa
  const updateCompany = async (id: string, data: Partial<Company>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'UPDATE_COMPANY', payload: { id, data } });
      
      // Guardar en almacenamiento
      const updatedCompanies = state.companies.map(company =>
        company.id === id ? { ...company, ...data, updatedAt: new Date().toISOString() } : company
      );
      saveCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error updating company:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar empresa' });
    }
  };

  // 🗑️ Eliminar empresa
  const deleteCompany = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'DELETE_COMPANY', payload: id });
      
      // Guardar en almacenamiento
      const updatedCompanies = state.companies.filter(company => company.id !== id);
      saveCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error deleting company:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar empresa' });
    }
  };

  // 🔍 Obtener empresa por ID
  const getCompany = async (id: string): Promise<Company | null> => {
    try {
      const company = state.companies.find(c => c.id === id);
      return company || null;
    } catch (error) {
      console.error('Error getting company:', error);
      return null;
    }
  };

  // 📋 Obtener empresas con filtros
  const getCompanies = async (filters?: CompanyFilters): Promise<Company[]> => {
    try {
      let filteredCompanies = [...state.companies];
      
      if (filters) {
        if (filters.status) {
          filteredCompanies = filteredCompanies.filter(c => filters.status!.includes(c.status));
        }
        if (filters.industry) {
          filteredCompanies = filteredCompanies.filter(c => filters.industry!.includes(c.industry));
        }
        if (filters.companySize) {
          filteredCompanies = filteredCompanies.filter(c => filters.companySize!.includes(c.companySize));
        }
        if (filters.isVerified !== undefined) {
          filteredCompanies = filteredCompanies.filter(c => c.isVerified === filters.isVerified);
        }
      }
      
      return filteredCompanies;
    } catch (error) {
      console.error('Error getting companies:', error);
      return [];
    }
  };

  // ✅ Verificar empresa
  const verifyCompany = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const verificationData = {
        isVerified: true,
        verificationDate: new Date().toISOString(),
        status: CompanyStatus.APPROVED,
      };
      
      dispatch({ type: 'UPDATE_COMPANY', payload: { id, data: verificationData } });
      
      // Guardar en almacenamiento
      const updatedCompanies = state.companies.map(company =>
        company.id === id ? { ...company, ...verificationData, updatedAt: new Date().toISOString() } : company
      );
      saveCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error verifying company:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al verificar empresa' });
    }
  };

  // 🎯 Establecer empresa actual
  const setCurrentCompany = (company: Company | null) => {
    dispatch({ type: 'SET_CURRENT_COMPANY', payload: company });
    if (company) {
      companyStorage.set(COMPANY_STORAGE_KEYS.CURRENT_COMPANY, JSON.stringify(company));
    } else {
      companyStorage.delete(COMPANY_STORAGE_KEYS.CURRENT_COMPANY);
    }
  };

  // 🧹 Limpiar error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 🎯 Valor del contexto
  const contextValue: CompanyContextType = {
    companies: state.companies,
    currentCompany: state.currentCompany,
    isLoading: state.isLoading,
    error: state.error,
    registerCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    getCompanies,
    verifyCompany,
    setCurrentCompany,
    clearError,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// 🪝 Hook personalizado para usar el contexto
export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany debe ser usado dentro de CompanyProvider');
  }
  return context;
};

// 🎭 Simulación para desarrollo (remover en producción)
type SimulateCompanyResponse = {
  success: true;
  data: Company;
} | {
  success: false;
  error: string;
};

const simulateCompanyRegistration = async (data: CompanyRegistrationData): Promise<SimulateCompanyResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Validar datos básicos
  if (!data.name || !data.taxId || !data.email) {
    return {
      success: false,
      error: 'Faltan datos obligatorios',
    };
  }
  
  // Simular empresa registrada exitosamente
  const newCompany: Company = {
    id: Date.now().toString(),
    name: data.name,
    legalName: data.legalName,
    taxId: data.taxId,
    email: data.email,
    phone: data.phone,
    website: data.website,
    companyType: data.companyType,
    registrationNumber: data.registrationNumber,
    registrationDate: data.registrationDate,
    industry: data.industry,
    companySize: data.companySize,
    employeeCount: data.employeeCount,
    address: data.address,
    annualRevenue: data.annualRevenue,
    status: CompanyStatus.PENDING,
    isVerified: false,
    legalRepresentative: data.legalRepresentative,
    documents: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id', // En producción, obtener del contexto de auth
  };
  
  return {
    success: true,
    data: newCompany,
  };
};

export default CompanyContext;