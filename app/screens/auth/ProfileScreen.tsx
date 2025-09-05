import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton, AuthCard } from '../../components/auth';
import { COLORS, FONT_FAMILIES, SPACING } from '../../constants';
import { UserRole } from '../../types/auth';
import { AuthStackParamList, User } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';

// 📋 Esquema de validación para el perfil
const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  lastName: yup
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .required('El apellido es requerido'),
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  phone: yup
    .string()
    .matches(/^[+]?[0-9\s\-\(\)]{10,}$/, 'Ingresa un teléfono válido')
    .default(''),
});

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { authState, logout, updateProfile, clearError } = useAuth();
  const { user, isLoading, error } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // 💾 Guardar cambios del perfil
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      // Actualizar el perfil
      await updateProfile(data);

      setIsEditing(false);

      Alert.alert(
        '✅ Perfil actualizado',
        'Tus datos han sido actualizados correctamente.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'No se pudo actualizar el perfil. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      '🚪 Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  // 🔄 Cancelar edición
  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  // 🖼️ Cambiar foto de perfil (simulado)
  const handleChangeAvatar = () => {
    Alert.alert(
      '📸 Cambiar Foto',
      'Esta funcionalidad estará disponible pronto.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <AuthCard>
        {/* 🚨 Mostrar error si existe */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 👤 Header del perfil */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangeAvatar}
            disabled={!isEditing}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() || '👤'}
              </Text>
            </View>
            {isEditing && (
              <View style={styles.editAvatarBadge}>
                <Text style={styles.editAvatarText}>📷</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userRole}>
            {user?.role === UserRole.ADMIN ? '👑 Administrador' :
              (user?.role === UserRole.ACCOUNTING || user?.role === UserRole.CUSTOMER_SERVICE) ? '👨‍💼 Empleado' :
                '👤 Cliente'}
          </Text>
        </View>

        {/* 📝 Formulario del perfil */}
        <View style={styles.form}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Información Personal</Text>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>✏️ Editar</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Nombre"
                placeholder="Tu nombre"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                editable={isEditing}
                leftIcon={<Text>👤</Text>}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Apellido"
                placeholder="Tu apellido"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                editable={isEditing}
                leftIcon={<Text>👤</Text>}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Email"
                placeholder="tu@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                leftIcon={<Text>📧</Text>}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Teléfono (Opcional)"
                placeholder="+1 234 567 8900"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
                editable={isEditing}
                leftIcon={<Text>📱</Text>}
              />
            )}
          />

          {/* 💾 Botones de acción */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <AuthButton
                title="💾 Guardar Cambios"
                onPress={handleSubmit(onSubmit as any)}
                isLoading={isLoading || authState.isLoading}
                isDisabled={!isValid || !isDirty || isLoading || authState.isLoading}
                variant="primary"
                size="large"
                style={styles.saveButton}
              />
            </View>
          )}
        </View>

        {/* 🚪 Sección de cerrar sesión */}
        <View style={styles.logoutSection}>
          <AuthButton
            title="🚪 Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            size="medium"
          />
        </View>
      </AuthCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.primary,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  editAvatarText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.secondary,
  },
  form: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.text.primary,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.medium,
    color: COLORS.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.error + '20',
  },
  cancelButtonText: {
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  logoutSection: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
});