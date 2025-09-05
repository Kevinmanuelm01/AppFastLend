// 📦 Exportaciones de componentes de autenticación

// 🔘 Componentes principales
export { default as AuthInput } from './AuthInput';
export { default as SimpleAuthInput } from './SimpleAuthInput';
export { default as AuthButton } from './AuthButton';
export { default as AuthCard } from './AuthCard';
export { default as RoleBasedAccess, AdminOnly, ClientOnly, EmployeeOnly, AccountingOnly, useRoleAccess } from './RoleBasedAccess';

// 🎯 Re-exportar tipos importantes
export type { AuthStackParamList } from '../../types/auth';
