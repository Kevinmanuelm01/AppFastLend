// 🔐 Pantalla de Login - Autenticación de usuarios

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton, AuthCard } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';
import type { LoginCredentials } from '../../types/auth';

// 📱 Obtener dimensiones de pantalla
const { width, height } = Dimensions.get('window');

// 🎯 Schema de validación con Yup
const loginSchema = yup.object().shape({
  emailOrUsername: yup
    .string()
    .required('Email o usuario es requerido')
    .min(3, 'Debe tener al menos 3 caracteres'),
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// 🎯 Tipos del formulario
type LoginFormData = {
  emailOrUsername: string;
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

  // 🎯 Contexto de autenticación
  const { login, authState, clearError } = useAuth();

  // 🎯 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  // 🎯 Manejar envío del formulario
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      clearError();

      // 🔄 Preparar credenciales
      const credentials: LoginCredentials = {
        email: data.emailOrUsername.trim(),
        password: data.password,
        rememberMe,
      };

      // 🔐 Intentar login
      await login(credentials.email, credentials.password);

      // ✅ Login exitoso - la navegación se maneja en el contexto
      reset();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 🎨 Header */}
        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenido! 👋</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para acceder a tu cuenta
          </Text>
        </View>

        {/* 🃏 Card de login */}
        <AuthCard style={styles.card}>
          {/* 📝 Formulario */}
          <View style={styles.form}>
            {/* 🚨 Mostrar error si existe */}
            {authState.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{authState.error}</Text>
              </View>
            )}

            {/* 📧 Campo Email/Usuario */}
            <Controller
              control={control}
              name="emailOrUsername"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Email o Usuario"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.emailOrUsername?.message}
                  leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  placeholder="Ingresa tu email o usuario"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  required
                />
              )}
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
                  placeholder="Ingresa tu contraseña"
                  isPassword
                  required
                />
              )}
            />

            {/* 🎛️ Opciones adicionales */}
            <View style={styles.options}>
              {/* ✅ Remember Me */}
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={toggleRememberMe}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked
                ]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Recordarme</Text>
              </TouchableOpacity>

              {/* 🔗 Forgot Password */}
              <TouchableOpacity
                onPress={navigateToForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* 🔘 Botón de Login */}
            <AuthButton
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading || authState.isLoading}
              loadingText="Iniciando sesión..."
              isDisabled={!isValid || authState.isLoading}
              style={styles.loginButton}
            />
          </View>
        </AuthCard>

        {/* 🔗 Link a registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity
            onPress={navigateToRegister}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 24,
  },
  form: {
    gap: 4,
  },
  inputIcon: {
    fontSize: 18,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  registerLink: {
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
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
});

LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;