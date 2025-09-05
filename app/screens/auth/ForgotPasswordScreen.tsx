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

// 📋 Esquema de validación
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
});

type ForgotPasswordFormData = {
  email: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      // 🔄 Simular llamada a API para recuperar contraseña
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 📧 Mostrar mensaje de éxito
      setEmailSent(true);
      
      Alert.alert(
        '📧 Email enviado',
        `Se ha enviado un enlace de recuperación a ${data.email}. Revisa tu bandeja de entrada y spam.`,
        [
          {
            text: 'Entendido',
            onPress: () => {
              reset();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'No se pudo enviar el email de recuperación. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setIsLoading(true);
      
      // 🔄 Simular reenvío de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '📧 Email reenviado',
        'Se ha reenviado el enlace de recuperación.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'No se pudo reenviar el email. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
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
          <View style={styles.header}>
            <Text style={styles.title}>🔐 Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? 'Te hemos enviado las instrucciones para recuperar tu contraseña'
                : 'Ingresa tu email y te enviaremos las instrucciones para recuperar tu contraseña'}
            </Text>
          </View>

          {!emailSent ? (
            <View style={styles.form}>
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
                    autoComplete="email"
                    leftIcon={<Text>📧</Text>}
                  />
                )}
              />

              <AuthButton
                title="Enviar Instrucciones"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>✅</Text>
              </View>
              
              <Text style={styles.successTitle}>Email Enviado</Text>
              <Text style={styles.successMessage}>
                Revisa tu bandeja de entrada y sigue las instrucciones del email.
              </Text>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>¿No recibiste el email?</Text>
                <AuthButton
                  title="Reenviar"
                  onPress={handleResendEmail}
                  isLoading={isLoading}
                  variant="outline"
                  size="medium"
                  style={styles.resendButton}
                />
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <AuthButton
              title="← Volver al Login"
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
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  resendButton: {
    paddingHorizontal: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});