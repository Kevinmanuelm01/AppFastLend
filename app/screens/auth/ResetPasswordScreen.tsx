// 🔐 Pantalla de Restablecer Contraseña - Reset Password

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('La nueva contraseña es requerida')
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo'
    ),
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword, authState, clearError } = useAuth();
  const { token } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      clearError();
      
      // 🔐 Restablecer contraseña
      await resetPassword(token, data.password);
      
      // ✅ Éxito - navegar al login
      Alert.alert(
        '✅ Contraseña Actualizada',
        'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.',
        [
          {
            text: 'Ir al Login',
            onPress: () => {
              reset();
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error en reset password:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={styles.title}>🔐 Nueva Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu nueva contraseña para completar el proceso de recuperación
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Nueva Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  isPassword
                  leftIcon={<Text>🔒</Text>}
                  helperText="Debe contener mayúscula, minúscula, número y símbolo"
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Confirmar Nueva Contraseña"
                  placeholder="Repite tu nueva contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  isPassword
                  leftIcon={<Text>🔒</Text>}
                  required
                />
              )}
            />

            <AuthButton
              title="Actualizar Contraseña"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading || authState.isLoading}
              isDisabled={!isValid || isLoading || authState.isLoading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <AuthButton
              title="← Volver al Login"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              size="medium"
            />
          </View>
        </AuthCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  title: {
    fontSize: 28,
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
  },
  form: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 24,
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

export default ResetPasswordScreen;