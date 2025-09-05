// 👥 Contexto de Clientes - Gestión completa de clientes

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Alert } from 'react-native';
import {
  Client,
  ClientContextType,
  ClientFormData,
  ClientFilters,
  ClientStats,
  ClientStatus,
  RiskLevel,
  BankType,
  BANK_CONFIGS,
  BankAccessInfo,
} from '../types/client';

// 📱 Configuración de almacenamiento seguro para clientes
const clientStorage = new MMKV({
  id: 'client-storage',
  encryptionKey: 'loans-app-client-key-2024-secure',
});

const CLIENT_STORAGE_KEYS = {
  CLIENTS: 'clients',
  CURRENT_CLIENT: 'current_client',
  CLIENT_STATS: 'client_stats',
} as const;

// 🎯 Estado del contexto de clientes
interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  error: string | null;
}

// 🔄 Acciones del reducer
type ClientAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; data: Partial<Client> } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_CURRENT_CLIENT'; payload: Client | null }
  | { type: 'CLEAR_ERROR' };

// 🏗️ Estado inicial
const initialState: ClientState = {
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
};

// 🔄 Reducer para manejo de estado
const clientReducer = (state: ClientState, action: ClientAction): ClientState => {
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
    
    case 'SET_CLIENTS':
      return {
        ...state,
        clients: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id
            ? { ...client, ...action.payload.data, updatedAt: new Date().toISOString() }
            : client
        ),
        currentClient: state.currentClient?.id === action.payload.id
          ? { ...state.currentClient, ...action.payload.data, updatedAt: new Date().toISOString() }
          : state.currentClient,
        isLoading: false,
        error: null,
      };
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        currentClient: state.currentClient?.id === action.payload ? null : state.currentClient,
        isLoading: false,
        error: null,
      };
    
    case 'SET_CURRENT_CLIENT':
      return {
        ...state,
        currentClient: action.payload,
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
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// 🏗️ Proveedor de clientes
interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  // 🔄 Cargar clientes al iniciar
  useEffect(() => {
    loadClients();
  }, []);

  // 💾 Guardar clientes en almacenamiento
  const saveClients = (clients: Client[]) => {
    try {
      clientStorage.set(CLIENT_STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving clients:', error);
    }
  };

  // 📖 Cargar clientes desde almacenamiento
  const loadClients = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const savedClients = clientStorage.getString(CLIENT_STORAGE_KEYS.CLIENTS);
      if (savedClients) {
        const clients = JSON.parse(savedClients) as Client[];
        dispatch({ type: 'SET_CLIENTS', payload: clients });
      } else {
        // Cargar clientes de ejemplo para desarrollo
        const exampleClients = generateExampleClients();
        dispatch({ type: 'SET_CLIENTS', payload: exampleClients });
        saveClients(exampleClients);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar clientes' });
    }
  };

  // 📝 Crear nuevo cliente
  const createClient = async (data: ClientFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular creación de cliente
      const response = await simulateCreateClient(data);
      
      if (response.success) {
        const newClient = response.data;
        dispatch({ type: 'ADD_CLIENT', payload: newClient });
        
        // Guardar en almacenamiento
        const updatedClients = [...state.clients, newClient];
        saveClients(updatedClients);
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
      }
    } catch (error) {
      console.error('Error creating client:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear cliente' });
    }
  };

  // ✏️ Actualizar cliente
  const updateClient = async (id: string, data: Partial<ClientFormData>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateData = {
        ...data,
        updatedBy: 'current-user-id', // En producción, obtener del contexto de auth
      };
      
      dispatch({ type: 'UPDATE_CLIENT', payload: { id, data: updateData } });
      
      // Guardar en almacenamiento
      const updatedClients = state.clients.map(client =>
        client.id === id ? { ...client, ...updateData, updatedAt: new Date().toISOString() } : client
      );
      saveClients(updatedClients);
    } catch (error) {
      console.error('Error updating client:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar cliente' });
    }
  };

  // 🗑️ Eliminar cliente
  const deleteClient = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'DELETE_CLIENT', payload: id });
      
      // Guardar en almacenamiento
      const updatedClients = state.clients.filter(client => client.id !== id);
      saveClients(updatedClients);
    } catch (error) {
      console.error('Error deleting client:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar cliente' });
    }
  };

  // 🔍 Obtener cliente por ID
  const getClient = async (id: string): Promise<Client | null> => {
    try {
      const client = state.clients.find(c => c.id === id);
      return client || null;
    } catch (error) {
      console.error('Error getting client:', error);
      return null;
    }
  };

  // 📋 Obtener clientes con filtros
  const getClients = async (filters?: ClientFilters): Promise<Client[]> => {
    try {
      let filteredClients = [...state.clients];
      
      if (filters) {
        if (filters.status) {
          filteredClients = filteredClients.filter(c => filters.status!.includes(c.status));
        }
        if (filters.riskLevel) {
          filteredClients = filteredClients.filter(c => filters.riskLevel!.includes(c.riskLevel));
        }
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filteredClients = filteredClients.filter(c =>
            c.firstName.toLowerCase().includes(term) ||
            c.lastName.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.documentNumber.includes(term)
          );
        }
        if (filters.minIncome) {
          filteredClients = filteredClients.filter(c => c.employmentInfo.monthlyIncome >= filters.minIncome!);
        }
        if (filters.maxIncome) {
          filteredClients = filteredClients.filter(c => c.employmentInfo.monthlyIncome <= filters.maxIncome!);
        }
      }
      
      return filteredClients;
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  };

  // ✅ Activar cliente
  const activateClient = async (id: string): Promise<void> => {
    await updateClient(id, { status: ClientStatus.ACTIVE });
  };

  // ❌ Desactivar cliente
  const deactivateClient = async (id: string): Promise<void> => {
    await updateClient(id, { status: ClientStatus.INACTIVE });
  };

  // 🎯 Actualizar nivel de riesgo
  const updateRiskLevel = async (id: string, riskLevel: RiskLevel): Promise<void> => {
    await updateClient(id, { riskLevel });
  };

  // 🏦 ADVERTENCIA: Funcionalidad de acceso bancario de alto riesgo
  const initiateBankAccess = async (clientId: string): Promise<{ success: boolean; url?: string; warnings: string[] }> => {
    try {
      const client = await getClient(clientId);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      const bankConfig = BANK_CONFIGS[client.bankingInfo.primaryBank];
      
      // ADVERTENCIA CRÍTICA DE SEGURIDAD
      const securityWarnings = [
        '🚨 ADVERTENCIA DE SEGURIDAD CRÍTICA',
        '⚠️ Esta funcionalidad accede directamente a la banca en línea del cliente',
        '🔐 Requiere credenciales bancarias del cliente',
        '📋 Debe tener autorización explícita y por escrito del cliente',
        '⚖️ Cumple con regulaciones de protección de datos financieros',
        '🛡️ Toda la información se maneja de forma encriptada',
        '📝 Se registra un log de auditoría de cada acceso',
        '🔒 Solo personal autorizado puede usar esta funcionalidad',
        ...bankConfig.securityWarnings,
      ];

      // En producción, aquí se implementaría:
      // 1. Verificación de permisos del usuario
      // 2. Validación de autorización del cliente
      // 3. Registro de auditoría
      // 4. Encriptación de credenciales
      // 5. Conexión segura con el backend que maneja Puppeteer/Selenium

      return {
        success: true,
        url: bankConfig.bankUrl,
        warnings: securityWarnings,
      };
    } catch (error) {
      console.error('Error initiating bank access:', error);
      return {
        success: false,
        warnings: ['Error al iniciar acceso bancario'],
      };
    }
  };

  // 📊 Obtener estadísticas de clientes
  const getClientStats = async (): Promise<ClientStats> => {
    try {
      const clients = state.clients;
      
      const stats: ClientStats = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === ClientStatus.ACTIVE).length,
        clientsByStatus: {
          [ClientStatus.ACTIVE]: clients.filter(c => c.status === ClientStatus.ACTIVE).length,
          [ClientStatus.INACTIVE]: clients.filter(c => c.status === ClientStatus.INACTIVE).length,
          [ClientStatus.SUSPENDED]: clients.filter(c => c.status === ClientStatus.SUSPENDED).length,
          [ClientStatus.PENDING_VERIFICATION]: clients.filter(c => c.status === ClientStatus.PENDING_VERIFICATION).length,
          [ClientStatus.BLOCKED]: clients.filter(c => c.status === ClientStatus.BLOCKED).length,
        },
        clientsByRisk: {
          [RiskLevel.LOW]: clients.filter(c => c.riskLevel === RiskLevel.LOW).length,
          [RiskLevel.MEDIUM]: clients.filter(c => c.riskLevel === RiskLevel.MEDIUM).length,
          [RiskLevel.HIGH]: clients.filter(c => c.riskLevel === RiskLevel.HIGH).length,
          [RiskLevel.VERY_HIGH]: clients.filter(c => c.riskLevel === RiskLevel.VERY_HIGH).length,
        },
        averageIncome: clients.reduce((sum, c) => sum + c.employmentInfo.monthlyIncome, 0) / clients.length || 0,
        averageCreditScore: clients.reduce((sum, c) => sum + (c.creditScore || 0), 0) / clients.length || 0,
        newClientsThisMonth: clients.filter(c => {
          const clientDate = new Date(c.registrationDate);
          const now = new Date();
          return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
        }).length,
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting client stats:', error);
      throw error;
    }
  };

  // 🎯 Establecer cliente actual
  const setCurrentClient = (client: Client | null) => {
    dispatch({ type: 'SET_CURRENT_CLIENT', payload: client });
    if (client) {
      clientStorage.set(CLIENT_STORAGE_KEYS.CURRENT_CLIENT, JSON.stringify(client));
    } else {
      clientStorage.delete(CLIENT_STORAGE_KEYS.CURRENT_CLIENT);
    }
  };

  // 🧹 Limpiar error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 🎯 Valor del contexto
  const contextValue: ClientContextType = {
    clients: state.clients,
    currentClient: state.currentClient,
    isLoading: state.isLoading,
    error: state.error,
    createClient,
    updateClient,
    deleteClient,
    getClient,
    getClients,
    activateClient,
    deactivateClient,
    updateRiskLevel,
    initiateBankAccess,
    setCurrentClient,
    clearError,
    getClientStats,
  };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};

// 🪝 Hook personalizado para usar el contexto
export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient debe ser usado dentro de ClientProvider');
  }
  return context;
};

// 🎭 Funciones de simulación para desarrollo
const simulateCreateClient = async (data: ClientFormData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Validar datos básicos
  if (!data.email || !data.documentNumber) {
    return {
      success: false,
      error: 'Email y número de documento son obligatorios',
    };
  }
  
  // Simular cliente creado exitosamente
  const newClient: Client = {
    id: Date.now().toString(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
    address: data.address,
    employmentInfo: data.employmentInfo,
    creditScore: Math.floor(Math.random() * 300) + 500, // 500-800
    riskLevel: calculateRiskLevel(data.employmentInfo.monthlyIncome),
    monthlyExpenses: data.monthlyExpenses,
    otherIncome: data.otherIncome,
    bankingInfo: data.bankingInfo,
    status: ClientStatus.PENDING_VERIFICATION,
    registrationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id', // En producción, obtener del contexto de auth
    internalNotes: data.internalNotes,
    preferences: data.preferences,
  };
  
  return {
    success: true,
    data: newClient,
  };
};

// 🎯 Calcular nivel de riesgo basado en ingresos
const calculateRiskLevel = (monthlyIncome: number): RiskLevel => {
  if (monthlyIncome >= 100000) return RiskLevel.LOW;
  if (monthlyIncome >= 50000) return RiskLevel.MEDIUM;
  if (monthlyIncome >= 25000) return RiskLevel.HIGH;
  return RiskLevel.VERY_HIGH;
};

// 🎭 Generar clientes de ejemplo
const generateExampleClients = (): Client[] => {
  return [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '+1-809-123-4567',
      dateOfBirth: '1985-03-15',
      documentType: 'CEDULA',
      documentNumber: '001-1234567-8',
      address: {
        street: 'Calle Principal #123, Sector Centro',
        city: 'Santo Domingo',
        state: 'Distrito Nacional',
        zipCode: '10101',
        country: 'República Dominicana',
      },
      employmentInfo: {
        company: 'Empresa Tecnológica SRL',
        position: 'Desarrollador Senior',
        monthlyIncome: 75000,
        employmentType: 'FULL_TIME',
        workPhone: '+1-809-987-6543',
        yearsInCompany: 3,
      },
      creditScore: 720,
      riskLevel: RiskLevel.LOW,
      monthlyExpenses: 45000,
      bankingInfo: {
        primaryBank: BankType.BANCO_POPULAR,
        accountNumber: '123456789',
        accountType: 'SAVINGS',
        bankBranch: 'Sucursal Centro',
      },
      status: ClientStatus.ACTIVE,
      registrationDate: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      createdBy: 'admin-user',
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsAlerts: false,
        language: 'es',
      },
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      phone: '+1-809-234-5678',
      dateOfBirth: '1990-07-22',
      documentType: 'CEDULA',
      documentNumber: '001-2345678-9',
      address: {
        street: 'Av. Independencia #456',
        city: 'Santiago',
        state: 'Santiago',
        zipCode: '51000',
        country: 'República Dominicana',
      },
      employmentInfo: {
        company: 'Consultora ABC',
        position: 'Gerente de Proyectos',
        monthlyIncome: 95000,
        employmentType: 'FULL_TIME',
        yearsInCompany: 5,
      },
      creditScore: 780,
      riskLevel: RiskLevel.LOW,
      monthlyExpenses: 55000,
      bankingInfo: {
        primaryBank: BankType.BANCO_RESERVAS,
        accountNumber: '987654321',
        accountType: 'CHECKING',
        bankBranch: 'Sucursal Santiago',
      },
      status: ClientStatus.ACTIVE,
      registrationDate: '2024-02-10T14:30:00Z',
      createdAt: '2024-02-10T14:30:00Z',
      updatedAt: '2024-02-10T14:30:00Z',
      createdBy: 'admin-user',
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsAlerts: true,
        language: 'es',
      },
    },
  ];
};

export default ClientContext;