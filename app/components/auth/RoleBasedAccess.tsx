// 🔐 Componente de Control de Acceso Basado en Roles

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, Permission } from '../../types/auth';
import { COLORS } from '../../constants';

// 🎯 Props del componente
interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // Si true, requiere TODOS los permisos. Si false, requiere AL MENOS UNO
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

// 🔐 Componente de Control de Acceso
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback,
  showFallback = true,
}) => {
  const { authState, hasRole, hasPermission } = useAuth();
  const { user } = authState;

  // 🚫 Si no hay usuario autenticado
  if (!user) {
    return showFallback ? (
      fallback || (
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedIcon}>🔒</Text>
          <Text style={styles.accessDeniedText}>Acceso Restringido</Text>
          <Text style={styles.accessDeniedSubtext}>
            Debes iniciar sesión para ver este contenido
          </Text>
        </View>
      )
    ) : null;
  }

  // 🎯 Verificar roles permitidos
  const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role));

  // 🎯 Verificar permisos requeridos
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      // Requiere TODOS los permisos
      hasRequiredPermissions = requiredPermissions.every(permission => hasPermission(permission));
    } else {
      // Requiere AL MENOS UNO de los permisos
      hasRequiredPermissions = requiredPermissions.some(permission => hasPermission(permission));
    }
  }

  // ✅ Verificar acceso
  const hasAccess = hasAllowedRole && hasRequiredPermissions;

  if (hasAccess) {
    return <>{children}</>;
  }

  // 🚫 Acceso denegado
  return showFallback ? (
    fallback || (
      <View style={styles.accessDenied}>
        <Text style={styles.accessDeniedIcon}>⛔</Text>
        <Text style={styles.accessDeniedText}>Acceso Denegado</Text>
        <Text style={styles.accessDeniedSubtext}>
          No tienes permisos para ver este contenido
        </Text>
      </View>
    )
  ) : null;
};

// 🎯 Hook personalizado para verificaciones rápidas
export const useRoleAccess = () => {
  const { authState, hasRole, hasPermission } = useAuth();
  const { user } = authState;

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: hasRole(UserRole.ADMIN),
    isClient: hasRole(UserRole.CLIENT),
    isEmployee: hasRole(UserRole.ACCOUNTING) || hasRole(UserRole.CUSTOMER_SERVICE),
    isAccounting: hasRole(UserRole.ACCOUNTING),
    isCustomerService: hasRole(UserRole.CUSTOMER_SERVICE),
    
    // Permisos específicos
    canViewLoans: hasPermission(Permission.VIEW_LOANS),
    canCreateLoans: hasPermission(Permission.CREATE_LOANS),
    canApproveLoans: hasPermission(Permission.APPROVE_LOANS),
    canViewUsers: hasPermission(Permission.VIEW_USERS),
    canCreateUsers: hasPermission(Permission.CREATE_USERS),
    canManageSettings: hasPermission(Permission.MANAGE_SETTINGS),
    
    // Funciones de verificación
    hasRole,
    hasPermission,
    
    // Verificación de múltiples roles/permisos
    hasAnyRole: (roles: UserRole[]) => roles.some(role => hasRole(role)),
    hasAllPermissions: (permissions: Permission[]) => permissions.every(permission => hasPermission(permission)),
    hasAnyPermission: (permissions: Permission[]) => permissions.some(permission => hasPermission(permission)),
  };
};

// 🎨 Componentes de conveniencia para roles específicos
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const ClientOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={[UserRole.CLIENT]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const EmployeeOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={[UserRole.ADMIN, UserRole.ACCOUNTING, UserRole.CUSTOMER_SERVICE]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AccountingOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={[UserRole.ADMIN, UserRole.ACCOUNTING]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

// 🎨 Estilos
const styles = StyleSheet.create({
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    margin: 16,
  },
  accessDeniedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  accessDeniedText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  accessDeniedSubtext: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default RoleBasedAccess;