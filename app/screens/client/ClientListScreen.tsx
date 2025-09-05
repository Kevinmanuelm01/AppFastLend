// 👥 Pantalla de Lista de Clientes - CRUD completo

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ModernCard, ModernButton } from '../../components/common';
import { RoleBasedAccess, useRoleAccess } from '../../components/auth';
import { useClient } from '../../contexts/ClientContext';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';
import { Client, ClientStatus, RiskLevel, ClientStackParamList } from '../../types/client';
import { Permission } from '../../types/auth';

// 🎯 Tipo de navegación
type ClientListScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  'ClientList'
>;

// 🎨 Componente principal
export const ClientListScreen: React.FC = () => {
  const navigation = useNavigation<ClientListScreenNavigationProp>();
  const { clients, isLoading, error, getClients, deleteClient, clearError } = useClient();
  const { canViewUsers, canCreateUsers, isEmployee } = useRoleAccess();
  
  // 🎯 Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Cargar y filtrar clientes
  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm]);

  // 📖 Cargar clientes
  const loadClients = async () => {
    try {
      await getClients();
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  // 🔍 Filtrar clientes
  const filterClients = () => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.documentNumber.includes(searchTerm)
    );
    
    setFilteredClients(filtered);
  };

  // 🔄 Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  // 🗑️ Eliminar cliente
  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      '🗑️ Eliminar Cliente',
      `¿Estás seguro que deseas eliminar a ${client.firstName} ${client.lastName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(client.id);
              Alert.alert('✅ Cliente eliminado', 'El cliente ha sido eliminado exitosamente.');
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo eliminar el cliente.');
            }
          },
        },
      ]
    );
  };

  // 🎨 Renderizar item de cliente
  const renderClientItem = ({ item: client }: { item: Client }) => (
    <ModernCard variant="outlined" style={styles.clientCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ClientDetails', { clientId: client.id })}
        activeOpacity={0.7}
      >
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>
              {client.firstName[0]}{client.lastName[0]}
            </Text>
          </View>
          
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {client.firstName} {client.lastName}
            </Text>
            <Text style={styles.clientEmail}>{client.email}</Text>
            <Text style={styles.clientDocument}>
              {client.documentType}: {client.documentNumber}
            </Text>
          </View>
          
          <View style={styles.clientStatus}>
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
                {getRiskLabel(client.riskLevel)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.clientDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💰 Ingresos:</Text>
            <Text style={styles.detailValue}>
              ${client.employmentInfo.monthlyIncome.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>🏦 Banco:</Text>
            <Text style={styles.detailValue}>
              {getBankLabel(client.bankingInfo.primaryBank)}
            </Text>
          </View>
          
          {client.creditScore && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>📊 Score:</Text>
              <Text style={styles.detailValue}>{client.creditScore}</Text>
            </View>
          )}
        </View>

        <RoleBasedAccess requiredPermissions={[Permission.EDIT_USERS]}>
          <View style={styles.clientActions}>
            <ModernButton
              title="✏️ Editar"
              onPress={() => navigation.navigate('ClientEdit', { clientId: client.id })}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            
            <ModernButton
              title="🏦 Banco"
              onPress={() => navigation.navigate('ClientBankAccess', { clientId: client.id })}
              variant="secondary"
              size="sm"
              style={styles.actionButton}
            />
            
            <RoleBasedAccess requiredPermissions={[Permission.DELETE_USERS]}>
              <ModernButton
                title="🗑️"
                onPress={() => handleDeleteClient(client)}
                variant="danger"
                size="sm"
                style={styles.deleteButton}
              />
            </RoleBasedAccess>
          </View>
        </RoleBasedAccess>
      </TouchableOpacity>
    </ModernCard>
  );

  // 🎨 Renderizar header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>👥 Gestión de Clientes</Text>
        
        <RoleBasedAccess requiredPermissions={[Permission.CREATE_USERS]}>
          <ModernButton
            title="➕ Nuevo Cliente"
            onPress={() => navigation.navigate('ClientCreate')}
            variant="primary"
            size="md"
          />
        </RoleBasedAccess>
      </View>

      {/* 🔍 Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, email o documento..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={COLORS.text.light}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearch}
            onPress={() => setSearchTerm('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📊 Estadísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clients.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {clients.filter(c => c.status === ClientStatus.ACTIVE).length}
          </Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {clients.filter(c => c.riskLevel === RiskLevel.LOW).length}
          </Text>
          <Text style={styles.statLabel}>Bajo Riesgo</Text>
        </View>
      </View>
    </View>
  );

  // 🎨 Renderizar estado vacío
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>No hay clientes</Text>
      <Text style={styles.emptySubtitle}>
        {searchTerm ? 'No se encontraron clientes con ese criterio' : 'Comienza agregando tu primer cliente'}
      </Text>
      
      {!searchTerm && (
        <RoleBasedAccess requiredPermissions={[Permission.CREATE_USERS]}>
          <ModernButton
            title="➕ Crear Primer Cliente"
            onPress={() => navigation.navigate('ClientCreate')}
            variant="primary"
            size="lg"
            style={styles.emptyButton}
          />
        </RoleBasedAccess>
      )}
    </View>
  );

  return (
    <RoleBasedAccess requiredPermissions={[Permission.VIEW_USERS]}>
      <View style={styles.container}>
        {/* 🚨 Mostrar error si existe */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
    </RoleBasedAccess>
  );
};

// 🎨 Funciones auxiliares
const getStatusColor = (status: ClientStatus): string => {
  switch (status) {
    case ClientStatus.ACTIVE:
      return COLORS.success + '20';
    case ClientStatus.INACTIVE:
      return COLORS.text.light + '20';
    case ClientStatus.SUSPENDED:
      return COLORS.warning + '20';
    case ClientStatus.PENDING_VERIFICATION:
      return COLORS.info + '20';
    case ClientStatus.BLOCKED:
      return COLORS.error + '20';
    default:
      return COLORS.border;
  }
};

const getStatusLabel = (status: ClientStatus): string => {
  switch (status) {
    case ClientStatus.ACTIVE:
      return 'Activo';
    case ClientStatus.INACTIVE:
      return 'Inactivo';
    case ClientStatus.SUSPENDED:
      return 'Suspendido';
    case ClientStatus.PENDING_VERIFICATION:
      return 'Pendiente';
    case ClientStatus.BLOCKED:
      return 'Bloqueado';
    default:
      return status;
  }
};

const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case RiskLevel.LOW:
      return COLORS.success + '20';
    case RiskLevel.MEDIUM:
      return COLORS.warning + '20';
    case RiskLevel.HIGH:
      return COLORS.error + '20';
    case RiskLevel.VERY_HIGH:
      return COLORS.error + '40';
    default:
      return COLORS.border;
  }
};

const getRiskLabel = (risk: RiskLevel): string => {
  switch (risk) {
    case RiskLevel.LOW:
      return 'Bajo';
    case RiskLevel.MEDIUM:
      return 'Medio';
    case RiskLevel.HIGH:
      return 'Alto';
    case RiskLevel.VERY_HIGH:
      return 'Muy Alto';
    default:
      return risk;
  }
};

const getBankLabel = (bank: string): string => {
  switch (bank) {
    case 'BANCO_POPULAR':
      return 'Popular';
    case 'BANCO_RESERVAS':
      return 'BanReservas';
    case 'BANCO_BHD':
      return 'BHD León';
    case 'BANESCO':
      return 'Banesco';
    case 'BANCO_SANTA_CRUZ':
      return 'Santa Cruz';
    case 'BANCO_PROMERICA':
      return 'Promerica';
    default:
      return 'Otro';
  }
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
    color: COLORS.text.light,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  clearSearch: {
    padding: SPACING.xs,
  },
  clearSearchText: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  clientCard: {
    marginBottom: SPACING.md,
    padding: 0,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  clientDocument: {
    fontSize: 12,
    color: COLORS.text.light,
  },
  clientStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  clientDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.backgroundSecondary,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  clientActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    minWidth: 44,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  emptyButton: {
    paddingHorizontal: SPACING.xl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  errorIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
  errorClose: {
    fontSize: 18,
    color: COLORS.error,
    padding: SPACING.xs,
  },
});

export default ClientListScreen;