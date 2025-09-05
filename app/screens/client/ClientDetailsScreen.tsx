// 👤 Pantalla de Detalles del Cliente - Vista completa del perfil

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackRouteProp } from '@react-navigation/native-stack';
import { ModernCard, ModernButton } from '../../components/common';
import { RoleBasedAccess, useRoleAccess } from '../../components/auth';
import { useClient } from '../../contexts/ClientContext';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';
import { Client, ClientStackParamList, ClientStatus, RiskLevel } from '../../types/client';
import { Permission } from '../../types/auth';
import { formatCurrency, formatDate } from '../../utils';

// 🎯 Tipos de navegación
type ClientDetailsScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  'ClientDetails'
>;

type ClientDetailsScreenRouteProp = NativeStackRouteProp<
  ClientStackParamList,
  'ClientDetails'
>;

// 🎨 Componente principal
export const ClientDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ClientDetailsScreenNavigationProp>();
  const route = useRoute<ClientDetailsScreenRouteProp>();
  const { clientId } = route.params;
  
  const { getClient, updateClient, activateClient, deactivateClient, initiateBankAccess } = useClient();
  const { canEditUsers, canDeleteUsers, isEmployee } = useRoleAccess();
  
  // 🎯 Estados locales
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bankAccessLoading, setBankAccessLoading] = useState(false);

  // 🔄 Cargar cliente al montar
  useEffect(() => {
    loadClient();
  }, [clientId]);

  // 📖 Cargar datos del cliente
  const loadClient = async () => {
    try {
      setIsLoading(true);
      const clientData = await getClient(clientId);
      setClient(clientData);
    } catch (error) {
      console.error('Error loading client:', error);
      Alert.alert('❌ Error', 'No se pudo cargar la información del cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Cambiar estado del cliente
  const handleToggleStatus = async () => {
    if (!client) return;

    const isActive = client.status === ClientStatus.ACTIVE;
    const action = isActive ? 'desactivar' : 'activar';
    
    Alert.alert(
      `${isActive ? '❌' : '✅'} ${action.charAt(0).toUpperCase() + action.slice(1)} Cliente`,
      `¿Estás seguro que deseas ${action} a ${client.firstName} ${client.lastName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            try {
              if (isActive) {
                await deactivateClient(client.id);
              } else {
                await activateClient(client.id);
              }
              await loadClient(); // Recargar datos
            } catch (error) {
              Alert.alert('❌ Error', `No se pudo ${action} el cliente.`);
            }
          },
        },
      ]
    );
  };

  // 🏦 ADVERTENCIA: Acceso bancario de alto riesgo
  const handleBankAccess = async () => {
    if (!client) return;

    // ADVERTENCIA CRÍTICA DE SEGURIDAD
    Alert.alert(
      '🚨 ADVERTENCIA DE SEGURIDAD CRÍTICA',
      '⚠️ Esta funcionalidad accederá directamente a la banca en línea del cliente.\n\n' +
      '🔐 Requiere:\n' +
      '• Autorización explícita del cliente\n' +
      '• Credenciales bancarias válidas\n' +
      '• Cumplimiento de regulaciones\n\n' +
      '📋 ¿El cliente ha autorizado este acceso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar con Precaución',
          style: 'destructive',
          onPress: async () => {
            try {
              setBankAccessLoading(true);
              const result = await initiateBankAccess(client.id);
              
              if (result.success && result.url) {
                // Mostrar advertencias adicionales
                Alert.alert(
                  '🔒 Acceso Bancario Iniciado',
                  result.warnings.join('\n\n'),
                  [
                    { text: 'Entendido', style: 'default' },
                    {
                      text: 'Abrir Banco',
                      onPress: () => {
                        Linking.openURL(result.url!).catch(() => {
                          Alert.alert('❌ Error', 'No se pudo abrir el enlace del banco.');
                        });
                      },
                    },
                  ]
                );
              } else {
                Alert.alert('❌ Error', 'No se pudo iniciar el acceso bancario.');
              }
            } catch (error) {
              Alert.alert('❌ Error', 'Error al acceder al sistema bancario.');
            } finally {
              setBankAccessLoading(false);
            }
          },
        },
      ]
    );
  };

  // 📱 Llamar al cliente
  const handleCallClient = () => {
    if (client?.phone) {
      Linking.openURL(`tel:${client.phone}`);
    }
  };

  // 📧 Enviar email al cliente
  const handleEmailClient = () => {
    if (client?.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Cliente no encontrado</Text>
        <ModernButton
          title="← Volver"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🎨 Header del cliente */}
      <ModernCard variant="elevated" style={styles.headerCard}>
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>
              {client.firstName[0]}{client.lastName[0]}
            </Text>
          </View>
          
          <View style={styles.clientMainInfo}>
            <Text style={styles.clientName}>
              {client.firstName} {client.lastName}
            </Text>
            <Text style={styles.clientEmail}>{client.email}</Text>
            <Text style={styles.clientDocument}>
              {client.documentType}: {client.documentNumber}
            </Text>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(client.status) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusLabel(client.status)}
                </Text>
              </View>
              
              <View style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(client.riskLevel) }
              ]}>
                <Text style={styles.riskText}>
                  Riesgo: {getRiskLabel(client.riskLevel)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 🎯 Acciones rápidas */}
        <View style={styles.quickActions}>
          <ModernButton
            title="📱 Llamar"
            onPress={handleCallClient}
            variant="outline"
            size="sm"
            style={styles.quickActionButton}
          />
          
          <ModernButton
            title="📧 Email"
            onPress={handleEmailClient}
            variant="outline"
            size="sm"
            style={styles.quickActionButton}
          />
          
          <RoleBasedAccess requiredPermissions={[Permission.EDIT_USERS]}>
            <ModernButton
              title="✏️ Editar"
              onPress={() => navigation.navigate('ClientEdit', { clientId: client.id })}
              variant="primary"
              size="sm"
              style={styles.quickActionButton}
            />
          </RoleBasedAccess>
        </View>
      </ModernCard>

      {/* 👤 Información personal */}
      <ModernCard variant="outlined" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>👤 Información Personal</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
            <Text style={styles.infoValue}>{formatDate(client.dateOfBirth)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{client.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Documento:</Text>
            <Text style={styles.infoValue}>
              {client.documentType}: {client.documentNumber}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Registro:</Text>
            <Text style={styles.infoValue}>{formatDate(client.registrationDate)}</Text>
          </View>
        </View>
      </ModernCard>

      {/* 📍 Dirección */}
      <ModernCard variant="outlined" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📍 Dirección</Text>
        
        <Text style={styles.addressText}>
          {client.address.street}
        </Text>
        <Text style={styles.addressText}>
          {client.address.city}, {client.address.state}
        </Text>
        <Text style={styles.addressText}>
          {client.address.zipCode}, {client.address.country}
        </Text>
      </ModernCard>

      {/* 💼 Información laboral */}
      <ModernCard variant="outlined" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>💼 Información Laboral</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Empresa:</Text>
            <Text style={styles.infoValue}>{client.employmentInfo.company}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cargo:</Text>
            <Text style={styles.infoValue}>{client.employmentInfo.position}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ingresos Mensuales:</Text>
            <Text style={[styles.infoValue, styles.incomeValue]}>
              {formatCurrency(client.employmentInfo.monthlyIncome, 'DOP')}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo de Empleo:</Text>
            <Text style={styles.infoValue}>
              {getEmploymentTypeLabel(client.employmentInfo.employmentType)}
            </Text>
          </View>
          
          {client.employmentInfo.yearsInCompany && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Años en la Empresa:</Text>
              <Text style={styles.infoValue}>{client.employmentInfo.yearsInCompany}</Text>
            </View>
          )}
        </View>
      </ModernCard>

      {/* 🏦 Información bancaria */}
      <ModernCard variant="outlined" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏦 Información Bancaria</Text>
          
          <RoleBasedAccess requiredPermissions={[Permission.VIEW_LOANS]}>
            <ModernButton
              title="🔗 Acceso Directo"
              onPress={handleBankAccess}
              variant="secondary"
              size="sm"
              isLoading={bankAccessLoading}
              style={styles.bankAccessButton}
            />
          </RoleBasedAccess>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Banco Principal:</Text>
            <Text style={styles.infoValue}>
              {getBankLabel(client.bankingInfo.primaryBank)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Número de Cuenta:</Text>
            <Text style={styles.infoValue}>
              ****{client.bankingInfo.accountNumber.slice(-4)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo de Cuenta:</Text>
            <Text style={styles.infoValue}>
              {client.bankingInfo.accountType === 'SAVINGS' ? 'Ahorros' : 'Corriente'}
            </Text>
          </View>
          
          {client.bankingInfo.bankBranch && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sucursal:</Text>
              <Text style={styles.infoValue}>{client.bankingInfo.bankBranch}</Text>
            </View>
          )}
        </View>

        {/* 🚨 Advertencia de seguridad */}
        <View style={styles.securityWarning}>
          <Text style={styles.warningIcon}>🚨</Text>
          <Text style={styles.warningText}>
            El acceso directo al banco requiere autorización explícita del cliente y cumple con todas las regulaciones de seguridad financiera.
          </Text>
        </View>
      </ModernCard>

      {/* 📊 Información financiera */}
      <ModernCard variant="outlined" style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📊 Perfil Financiero</Text>
        
        <View style={styles.financialGrid}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>💰 Ingresos Mensuales</Text>
            <Text style={[styles.financialValue, styles.incomeValue]}>
              {formatCurrency(client.employmentInfo.monthlyIncome, 'DOP')}
            </Text>
          </View>
          
          {client.monthlyExpenses && (
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>💸 Gastos Mensuales</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(client.monthlyExpenses, 'DOP')}
              </Text>
            </View>
          )}
          
          {client.otherIncome && (
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>💼 Otros Ingresos</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(client.otherIncome, 'DOP')}
              </Text>
            </View>
          )}
          
          {client.creditScore && (
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>📈 Score Crediticio</Text>
              <Text style={[
                styles.financialValue,
                { color: client.creditScore >= 700 ? COLORS.success : client.creditScore >= 600 ? COLORS.warning : COLORS.error }
              ]}>
                {client.creditScore}
              </Text>
            </View>
          )}
          
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>⚠️ Nivel de Riesgo</Text>
            <Text style={[
              styles.financialValue,
              { color: getRiskColor(client.riskLevel).replace('20', '') }
            ]}>
              {getRiskLabel(client.riskLevel)}
            </Text>
          </View>
        </View>
      </ModernCard>

      {/* 📝 Notas internas (solo para empleados) */}
      <RoleBasedAccess requiredPermissions={[Permission.VIEW_USERS]}>
        {client.internalNotes && (
          <ModernCard variant="filled" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📝 Notas Internas</Text>
            <Text style={styles.notesText}>{client.internalNotes}</Text>
          </ModernCard>
        )}
      </RoleBasedAccess>

      {/* 🎛️ Acciones del cliente */}
      <RoleBasedAccess requiredPermissions={[Permission.EDIT_USERS]}>
        <ModernCard variant="outlined" style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>🎛️ Acciones</Text>
          
          <View style={styles.actionsGrid}>
            <ModernButton
              title={client.status === ClientStatus.ACTIVE ? '❌ Desactivar' : '✅ Activar'}
              onPress={handleToggleStatus}
              variant={client.status === ClientStatus.ACTIVE ? 'danger' : 'success'}
              size="md"
              style={styles.actionButton}
            />
            
            <ModernButton
              title="✏️ Editar Perfil"
              onPress={() => navigation.navigate('ClientEdit', { clientId: client.id })}
              variant="primary"
              size="md"
              style={styles.actionButton}
            />
            
            <ModernButton
              title="🏦 Acceso Bancario"
              onPress={handleBankAccess}
              variant="secondary"
              size="md"
              isLoading={bankAccessLoading}
              style={styles.actionButton}
            />
          </View>
        </ModernCard>
      </RoleBasedAccess>

      {/* 🔙 Botón de regreso */}
      <View style={styles.backContainer}>
        <ModernButton
          title="← Volver a la Lista"
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="lg"
        />
      </View>
    </ScrollView>
  );
};

// 🎨 Funciones auxiliares (reutilizar las del ClientListScreen)
const getStatusColor = (status: ClientStatus): string => {
  switch (status) {
    case ClientStatus.ACTIVE: return COLORS.success + '20';
    case ClientStatus.INACTIVE: return COLORS.text.light + '20';
    case ClientStatus.SUSPENDED: return COLORS.warning + '20';
    case ClientStatus.PENDING_VERIFICATION: return COLORS.info + '20';
    case ClientStatus.BLOCKED: return COLORS.error + '20';
    default: return COLORS.border;
  }
};

const getStatusLabel = (status: ClientStatus): string => {
  switch (status) {
    case ClientStatus.ACTIVE: return 'Activo';
    case ClientStatus.INACTIVE: return 'Inactivo';
    case ClientStatus.SUSPENDED: return 'Suspendido';
    case ClientStatus.PENDING_VERIFICATION: return 'Pendiente';
    case ClientStatus.BLOCKED: return 'Bloqueado';
    default: return status;
  }
};

const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case RiskLevel.LOW: return COLORS.success + '20';
    case RiskLevel.MEDIUM: return COLORS.warning + '20';
    case RiskLevel.HIGH: return COLORS.error + '20';
    case RiskLevel.VERY_HIGH: return COLORS.error + '40';
    default: return COLORS.border;
  }
};

const getRiskLabel = (risk: RiskLevel): string => {
  switch (risk) {
    case RiskLevel.LOW: return 'Bajo';
    case RiskLevel.MEDIUM: return 'Medio';
    case RiskLevel.HIGH: return 'Alto';
    case RiskLevel.VERY_HIGH: return 'Muy Alto';
    default: return risk;
  }
};

const getBankLabel = (bank: string): string => {
  switch (bank) {
    case 'BANCO_POPULAR': return 'Banco Popular';
    case 'BANCO_RESERVAS': return 'BanReservas';
    case 'BANCO_BHD': return 'BHD León';
    case 'BANESCO': return 'Banesco';
    case 'BANCO_SANTA_CRUZ': return 'Banco Santa Cruz';
    case 'BANCO_PROMERICA': return 'Promerica';
    default: return 'Otro Banco';
  }
};

const getEmploymentTypeLabel = (type: string): string => {
  switch (type) {
    case 'FULL_TIME': return 'Tiempo Completo';
    case 'PART_TIME': return 'Tiempo Parcial';
    case 'FREELANCE': return 'Freelance';
    case 'UNEMPLOYED': return 'Desempleado';
    case 'RETIRED': return 'Jubilado';
    case 'STUDENT': return 'Estudiante';
    default: return type;
  }
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: SPACING.lg,
  },
  headerCard: {
    margin: SPACING.md,
    marginBottom: SPACING.sm,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  clientAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  clientAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clientMainInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  clientDocument: {
    fontSize: 14,
    color: COLORS.text.light,
    marginBottom: SPACING.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  sectionCard: {
    margin: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.sm,
  },
  incomeValue: {
    color: COLORS.success,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginBottom: 4,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  financialItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  notesText: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionsCard: {
    margin: SPACING.md,
    marginTop: SPACING.sm,
  },
  actionsGrid: {
    gap: SPACING.sm,
  },
  actionButton: {
    marginBottom: SPACING.xs,
  },
  bankAccessButton: {
    paddingHorizontal: SPACING.md,
  },
  securityWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.warning,
    lineHeight: 18,
    fontWeight: '500',
  },
  backContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
});

export default ClientDetailsScreen;