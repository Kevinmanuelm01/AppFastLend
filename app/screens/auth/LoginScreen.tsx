// 🔐 Pantalla de Login - Autenticación de usuarios

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton, AuthCard, BiometricButton, UserDropdown } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';
import type { LoginCredentials } from '../../types/auth';
import type { User } from '../../components/auth/UserDropdown';

// 📱 Obtener dimensiones de pantalla
const { width, height } = Dimensions.get('window');

// 🎯 Schema de validación con Yup
const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Usuario es requerido')
    .min(3, 'Debe tener al menos 3 caracteres'),
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// 🎯 Tipos del formulario
type LoginFormData = {
  username: string;
  password: string;
};

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/auth';

// 🎯 Props del componente
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// 🎨 Componente LoginScreen
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // 🎯 Estados locales
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  // 🎯 Contexto de autenticación
  const { login, authState } = useAuth();

  // 🎯 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 🎯 Cargar usuarios disponibles
  useEffect(() => {
    // Simular carga de usuarios desde API
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        fullName: 'Administrador del Sistema',
        role: 'admin',
        email: 'admin@fastlend.com',
        companyEmail: 'admin@fastlend.com', // El admin es la empresa principal
        isActive: true,
      },
      {
        id: '2',
        username: 'gerente1',
        fullName: 'Juan Pérez - Gerente',
        role: 'manager',
        email: 'juan.perez@fastlend.com',
        companyEmail: 'admin@fastlend.com', // Pertenece a la empresa del admin
        isActive: true,
      },
      {
        id: '3',
        username: 'empleado1',
        fullName: 'María García - Empleada',
        role: 'employee',
        email: 'maria.garcia@fastlend.com',
        companyEmail: 'admin@fastlend.com', // Pertenece a la empresa del admin
        isActive: true,
      },
      {
        id: '4',
        username: 'admin2',
        fullName: 'Admin Empresa 2',
        role: 'admin',
        email: 'admin@empresa2.com',
        companyEmail: 'empresa2@fastlend.com',
        isActive: true,
      },
      {
        id: '5',
        username: 'gerente2',
        fullName: 'Carlos López - Gerente',
        role: 'manager',
        email: 'carlos.lopez@empresa2.com',
        companyEmail: 'empresa2@fastlend.com',
        isActive: true,
      },
    ];
    setUsers(mockUsers);
  }, []);

  // 🎯 Filtrar usuarios por empresa
  useEffect(() => {
    if (companyEmail.trim()) {
      const filtered = users.filter(user =>
        user.companyEmail.toLowerCase() === companyEmail.toLowerCase()
      );
      console.log('🔍 Filtrando usuarios:', {
        companyEmail,
        totalUsers: users.length,
        filteredUsers: filtered.length,
        users: filtered.map(u => ({ username: u.username, companyEmail: u.companyEmail }))
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [companyEmail, users]);

  // 🎯 Actualizar username cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser) {
      setValue('username', selectedUser.username);
    }
  }, [selectedUser, setValue]);

  // 🎯 Manejar envío del formulario
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // 🔄 Preparar credenciales
      // Si hay un usuario seleccionado, usar su email, sino usar el username como email
      const emailToUse = selectedUser?.email || data.username.trim();

      const credentials: LoginCredentials = {
        email: emailToUse,
        password: data.password,
        rememberMe,
      };

      // 🔐 Intentar login
      await login(credentials);

      // ✅ Login exitoso - la navegación se maneja en el contexto
      reset();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      Alert.alert('❌ Error de Autenticación', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Navegar a registro
  const navigateToRegister = () => {
    navigation.navigate('Register', {});
  };

  // 🎯 Navegar a recuperar contraseña
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // 🎯 Toggle remember me
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  // 🎯 Manejar autenticación biométrica
  const handleBiometricAuth = (type: 'fingerprint' | 'faceid') => {
    Alert.alert(
      '🔐 Autenticación Biométrica',
      `Función de ${type === 'fingerprint' ? 'Huella dactilar' : 'Face ID'} no implementada aún.`,
      [{ text: 'OK' }]
    );
  };

  // 🎯 Manejar selección de usuario
  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
  };

  // 🎯 Manejar búsqueda de usuarios
  const handleUserSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🎨 Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoInner} />
            </View>
          </View>
          <Text style={styles.appName}>AppFastLend</Text>
          <Text style={styles.subtitle}>
            Accede a tu cuenta de forma segura
          </Text>
        </View>

        {/* 🃏 Card de login */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>

          {/* 📝 Formulario */}
          <View style={styles.form}>
            {/* 🚨 Mostrar error si existe */}
            {authState.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{authState.error}</Text>
              </View>
            )}

            {/* 👤 Campo Usuario con Dropdown */}
            {/* 🏢 Campo de Correo de Empresa */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Correo de Empresa <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="empresa@fastlend.com"
                placeholderTextColor={COLORS.text.light}
                value={companyEmail}
                onChangeText={setCompanyEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 👤 Campo de Usuario */}
            <UserDropdown
              label="Nombre de usuario"
              users={filteredUsers}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              onSearchChange={handleUserSearch}
              error={errors.username?.message}
              placeholder={companyEmail ? "Selecciona un usuario" : "Primero ingresa el correo de empresa"}
              disabled={!companyEmail.trim()}
              required
            />

            {/* 🔒 Campo Contraseña */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                  placeholder="••••••••"
                  isPassword
                  required
                />
              )}
            />

            {/* 🔘 Botón de Login */}
            <AuthButton
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading || authState.isLoading}
              loadingText="Iniciando sesión..."
              isDisabled={!isValid || authState.isLoading}
              style={styles.loginButton}
            />

            {/* 🔗 Separador */}
            <View style={styles.separator}>
              <Text style={styles.separatorText}>O continúa con</Text>
            </View>

            {/* 🔐 Opciones biométricas */}
            <View style={styles.biometricContainer}>
              <BiometricButton
                type="fingerprint"
                onPress={() => handleBiometricAuth('fingerprint')}
              />
              <BiometricButton
                type="faceid"
                onPress={() => handleBiometricAuth('faceid')}
              />
            </View>
          </View>
        </View>

        {/* 🔗 Footer con términos */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al iniciar sesión, aceptas nuestros{' '}
          </Text>
          <TouchableOpacity onPress={() => { }} activeOpacity={0.7}>
            <Text style={styles.linkText}>Términos de Servicio</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> y </Text>
          <TouchableOpacity onPress={() => { }} activeOpacity={0.7}>
            <Text style={styles.linkText}>Política de Privacidad</Text>
          </TouchableOpacity>
        </View>

        {/* 🔗 Links de registro */}
        <View style={styles.registerFooter}>
          <TouchableOpacity
            onPress={navigateToRegister}
            activeOpacity={0.7}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>¿Eres nuevo? Crear cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Navegar a Company usando el navigator principal
              // @ts-ignore - Company está en el MainNavigator
              navigation.getParent()?.navigate('Company');
            }}
            activeOpacity={0.7}
            style={styles.companyButton}
          >
            <Text style={styles.companyButtonText}>🏢 Registrar Empresa</Text>
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
    backgroundColor: '#f8f9fa', // Fondo gris claro como en la imagen
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e3a8a', // Azul oscuro como en la imagen
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937', // Gris oscuro
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // Gris medio
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputIcon: {
    fontSize: 18,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#1e3a8a', // Azul oscuro
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#1e3a8a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  separatorText: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  biometricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#1e3a8a',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  registerFooter: {
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
    paddingBottom: 20,
  },
  registerButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    minWidth: 200,
  },
  registerButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  companyButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    minWidth: 200,
  },
  companyButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background,
  },
  required: {
    color: COLORS.error,
  },
});

LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;