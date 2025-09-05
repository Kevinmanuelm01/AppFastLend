// 📝 Pantalla de Registro - Creación de nuevas cuentas

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SimpleAuthInput, AuthButton, AuthCard } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';
import { UserRole, type RegisterData } from '../../types/auth';

// 🎯 Schema de validación con Yup
const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Nombre es requerido')
    .min(2, 'Debe tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
  lastName: yup
    .string()
    .required('Apellido es requerido')
    .min(2, 'Debe tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
  email: yup
    .string()
    .required('Email es requerido')
    .email('Formato de email inválido'),
  phone: yup
    .string()
    .required('Teléfono es requerido')
    .matches(/^[+]?[0-9]{10,15}$/, 'Formato de teléfono inválido'),
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo'
    ),
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  documentType: yup
    .string()
    .required('Tipo de documento es requerido'),
  documentNumber: yup
    .string()
    .required('Número de documento es requerido')
    .min(8, 'Debe tener al menos 8 caracteres'),
  dateOfBirth: yup
    .string()
    .required('Fecha de nacimiento es requerida')
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Formato de fecha inválido (YYYY-MM-DD)'
    ),
  termsAccepted: yup
    .boolean()
    .required('Debes aceptar los términos y condiciones')
    .oneOf([true], 'Debes aceptar los términos y condiciones'),
});

// 🎯 Tipos del formulario
type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: string;
  termsAccepted: boolean;
};

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/auth';

// 🎯 Props del componente
type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// 🎨 Componente RegisterScreen
const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {
  // 🎯 Estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    route?.params?.role || UserRole.CLIENT
  );

  // 🎯 Contexto de autenticación
  const { register, authState } = useAuth();

  // 🎯 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      documentType: 'DNI',
      documentNumber: '',
      dateOfBirth: '',
      termsAccepted: false,
    },
  });

  // 🎯 Observar términos aceptados
  const termsAccepted = watch('termsAccepted');

  // 🎯 Manejar envío del formulario
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      // clearError(); // TODO: Implementar cuando esté disponible

      // 🔄 Preparar datos de registro
      const registerData: RegisterData = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        role: selectedRole,
        documentType: data.documentType as 'DNI' | 'PASSPORT' | 'LICENSE',
        documentNumber: data.documentNumber.trim(),
        dateOfBirth: data.dateOfBirth,
        termsAccepted: data.termsAccepted,
      };

      // 📝 Intentar registro
      await register(registerData);

      // ✅ Registro exitoso
      Alert.alert(
        '¡Registro Exitoso! 🎉',
        'Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error de registro';
      Alert.alert('❌ Error de Registro', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Navegar a login
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  // 🎯 Toggle términos
  const toggleTerms = () => {
    // En una app real, aquí se abriría un modal o navegaría a los términos
    Alert.alert(
      'Términos y Condiciones',
      'Aquí se mostrarían los términos y condiciones completos de la aplicación.',
      [{ text: 'Entendido' }]
    );
  };

  // 🎯 Opciones de roles (solo para empleados)
  const roleOptions = [
    { value: UserRole.CLIENT, label: '👤 Cliente', description: 'Solicitar préstamos' },
    { value: UserRole.ADMIN, label: '👑 Administrador', description: 'Acceso completo' },
    { value: UserRole.ACCOUNTING, label: '💰 Contabilidad', description: 'Gestión financiera' },
    { value: UserRole.CUSTOMER_SERVICE, label: '🎧 Servicio al Cliente', description: 'Atención al usuario' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🎨 Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta 📝</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para registrarte
          </Text>
        </View>

        {/* 🃏 Card de registro */}
        <View style={styles.card}>
          {/* 🎭 Selector de rol */}
          <View style={styles.roleSection}>
            <Text style={styles.sectionTitle}>Tipo de Cuenta</Text>
            <View style={styles.roleGrid}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.roleOption,
                    selectedRole === option.value && styles.roleOptionSelected,
                  ]}
                  onPress={() => setSelectedRole(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.roleLabel,
                    selectedRole === option.value && styles.roleLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    selectedRole === option.value && styles.roleDescriptionSelected,
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 📝 Formulario */}
          <View style={styles.form}>
            {/* 🚨 Mostrar error si existe */}
            {authState.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{authState.error}</Text>
              </View>
            )}

            {/* 👤 Información personal */}
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SimpleAuthInput
                      label="Nombre"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                      placeholder="Tu nombre"
                      autoCapitalize="words"
                      required
                    />
                  )}
                />
              </View>

              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SimpleAuthInput
                      label="Apellido"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                      placeholder="Tu apellido"
                      autoCapitalize="words"
                      required
                    />
                  )}
                />
              </View>
            </View>

            {/* 📧 Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <SimpleAuthInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Text style={styles.inputIcon}>📧</Text>}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  required
                />
              )}
            />

            {/* 📱 Teléfono */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <SimpleAuthInput
                  label="Teléfono"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  leftIcon={<Text style={styles.inputIcon}>📱</Text>}
                  placeholder="+1234567890"
                  keyboardType="phone-pad"
                  required
                />
              )}
            />

            {/* 🔒 Contraseñas */}
            <Text style={styles.sectionTitle}>Seguridad</Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <SimpleAuthInput
                  label="Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                  placeholder="Mínimo 8 caracteres"
                  isPassword
                  required
                  helperText="Debe contener mayúscula, minúscula, número y símbolo"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <SimpleAuthInput
                  label="Confirmar Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                  placeholder="Repite tu contraseña"
                  isPassword
                  required
                />
              )}
            />

            {/* 📄 Documentación */}
            <Text style={styles.sectionTitle}>Documentación</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="documentType"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <Text style={styles.inputLabel}>Tipo de Documento *</Text>
                      <View style={styles.pickerContainer}>
                        {['DNI', 'PASSPORT', 'LICENSE'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.pickerOption,
                              value === type && styles.pickerOptionSelected,
                            ]}
                            onPress={() => onChange(type)}
                          >
                            <Text style={[
                              styles.pickerText,
                              value === type && styles.pickerTextSelected,
                            ]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {errors.documentType && (
                        <Text style={styles.errorText}>
                          {errors.documentType.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="documentNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SimpleAuthInput
                      label="Número"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.documentNumber?.message}
                      leftIcon={<Text style={styles.inputIcon}>📄</Text>}
                      placeholder="12345678"
                      required
                    />
                  )}
                />
              </View>
            </View>

            {/* 📅 Fecha de nacimiento */}
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, onBlur, value } }) => (
                <SimpleAuthInput
                  label="Fecha de Nacimiento"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dateOfBirth?.message}
                  leftIcon={<Text style={styles.inputIcon}>📅</Text>}
                  placeholder="YYYY-MM-DD"
                  required
                  helperText="Formato: YYYY-MM-DD (ej: 1990-01-15)"
                />
              )}
            />

            {/* ✅ Términos y condiciones */}
            <Controller
              control={control}
              name="termsAccepted"
              render={({ field: { onChange, value } }) => (
                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={styles.termsCheckContainer}
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      value && styles.checkboxChecked
                    ]}>
                      {value && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.termsTextContainer}>
                      <Text style={styles.termsText}>
                        Acepto los{' '}
                        <Text style={styles.termsLink} onPress={toggleTerms}>
                          términos y condiciones
                        </Text>
                        {' '}y la política de privacidad
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {errors.termsAccepted && (
                    <Text style={styles.errorText}>
                      {errors.termsAccepted.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* 🔘 Botón de registro */}
            <AuthButton
              title="Crear Cuenta"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading || authState.isLoading}
              loadingText="Creando cuenta..."
              isDisabled={!isValid || !termsAccepted || authState.isLoading}
              style={styles.registerButton}
            />
          </View>
        </View>

        {/* 🔗 Link a login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity
            onPress={navigateToLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>Inicia sesión aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  // Secciones
  roleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },

  // Roles
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#eff6ff',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  roleLabelSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  roleDescriptionSelected: {
    color: COLORS.primary,
  },

  // Formulario
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputIcon: {
    fontSize: 18,
  },

  // Picker personalizado
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pickerTextSelected: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },

  // Términos
  termsContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  termsCheckContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 14,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Botones
  registerButton: {
    marginTop: 8,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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
});

RegisterScreen.displayName = 'RegisterScreen';

export default RegisterScreen;