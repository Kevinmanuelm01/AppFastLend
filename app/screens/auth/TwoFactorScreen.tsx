// 🔐 Pantalla de Autenticación de Dos Factores (2FA)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton, AuthCard } from '../../components/auth';
import { COLORS, FONT_FAMILIES, SPACING } from '../../constants';
import { AuthStackParamList } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';

// 📋 Esquema de validación
const twoFactorSchema = yup.object().shape({
  code: yup
    .string()
    .required('El código es requerido')
    .matches(/^\d{6}$/, 'El código debe tener 6 dígitos'),
});

type TwoFactorFormData = {
  code: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'TwoFactor'>;

export const TwoFactorScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { authState, clearError } = useAuth();
  const { method = 'SMS', phone, email } = route.params || {};

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TwoFactorFormData>({
    resolver: yupResolver(twoFactorSchema),
    mode: 'onChange',
  });

  // ⏰ Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: TwoFactorFormData) => {
    try {
      setIsLoading(true);
      clearError();
      
      // 🔐 Verificar código 2FA
      await simulateVerify2FA(data.code);
      
      // ✅ Éxito - completar login
      Alert.alert(
        '✅ Verificación Exitosa',
        'Has sido autenticado correctamente.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              reset();
              // Aquí se completaría el proceso de login
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error en 2FA:', error);
      Alert.alert(
        '❌ Código Incorrecto',
        'El código ingresado no es válido. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      clearError();
      
      // 🔄 Reenviar código
      await simulateResend2FA(method);
      
      // Reset countdown
      setCountdown(30);
      setCanResend(false);
      
      Alert.alert(
        '📱 Código Reenviado',
        `Se ha enviado un nuevo código a tu ${method === 'SMS' ? 'teléfono' : 'email'}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error reenviando código:', error);
      Alert.alert(
        '❌ Error',
        'No se pudo reenviar el código. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodInfo = () => {
    switch (method) {
      case 'SMS':
        return {
          icon: '📱',
          title: 'Verificación por SMS',
          description: `Hemos enviado un código de 6 dígitos a tu teléfono ${phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`,
        };
      case 'EMAIL':
        return {
          icon: '📧',
          title: 'Verificación por Email',
          description: `Hemos enviado un código de 6 dígitos a tu email ${email?.replace(/(.{2}).*(@.*)/, '$1***$2')}`,
        };
      case 'AUTHENTICATOR':
        return {
          icon: '🔐',
          title: 'Aplicación Autenticadora',
          description: 'Ingresa el código de 6 dígitos de tu aplicación autenticadora (Google Authenticator, Authy, etc.)',
        };
      default:
        return {
          icon: '🔐',
          title: 'Verificación de Seguridad',
          description: 'Ingresa el código de verificación',
        };
    }
  };

  const methodInfo = getMethodInfo();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthCard>
          {/* 🚨 Mostrar error si existe */}
          {authState.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{authState.error}</Text>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.icon}>{methodInfo.icon}</Text>
            <Text style={styles.title}>{methodInfo.title}</Text>
            <Text style={styles.subtitle}>{methodInfo.description}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Código de Verificación"
                  placeholder="123456"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.code?.message}
                  keyboardType="numeric"
                  maxLength={6}
                  leftIcon={<Text>🔢</Text>}
                  containerStyle={styles.codeInput}
                  required
                />
              )}
            />

            <AuthButton
              title="Verificar Código"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading || authState.isLoading}
              isDisabled={!isValid || isLoading || authState.isLoading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            />
          </View>

          {/* 🔄 Reenviar código */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>¿No recibiste el código?</Text>
            
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isLoading}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>Reenviar Código</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>
                Reenviar en {countdown}s
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <AuthButton
              title="← Usar Otro Método"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="medium"
            />
          </View>
        </AuthCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 🎭 Funciones de simulación
const simulateVerify2FA = async (code: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simular verificación (código correcto: 123456)
  if (code !== '123456') {
    throw new Error('Código incorrecto');
  }
  
  return { success: true };
};

const simulateResend2FA = async (method: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 24,
  },
  codeInput: {
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 24,
  },
  resendSection: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.text.light,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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

export default TwoFactorScreen;