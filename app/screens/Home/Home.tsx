import { COLORS } from '../../constants';
import * as React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainNavigatorParamList } from '../../constants/RoutesDefault';
import { ModernButton, ModernCard } from '../../components/common';
import { AuthInput } from '../../components/auth';
import { isValidEmail } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'Main'>;

export function HomeScreen() {
  console.log('HomeScreen component rendered');

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { logout, authState } = useAuth();
  const { user } = authState;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);


  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasErrors = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Simulate login process
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Login Successful! 🎉',
        `Welcome ${email}!\n\nYou have successfully accessed the application.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Clear form
              setEmail('');
              setPassword('');
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeEmoji}>👋</Text>
              <Text style={styles.title}>
                ¡Bienvenido{user ? `, ${user.firstName}` : ''}!
              </Text>
              <Text style={styles.subtitle}>AppFastLend</Text>
              <Text style={styles.description}>
                Tu plataforma de préstamos rápida y segura
              </Text>

              {/* 👤 Información del usuario */}
              {user && (
                <View style={styles.userInfo}>
                  <Text style={styles.userRole}>
                    {user.role === 'ADMIN' ? '👑 Administrador' :
                      user.role === 'CLIENT' ? '👤 Cliente' :
                        user.role === 'ACCOUNTING' ? '💰 Contabilidad' :
                          user.role === 'CUSTOMER_SERVICE' ? '🎧 Servicio al Cliente' :
                            '👤 Usuario'}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              )}
            </View>
          </View>

          <ModernCard variant="elevated" style={styles.loginCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Iniciar Sesión</Text>
              <Text style={styles.cardSubtitle}>
                Accede a tu cuenta para continuar
              </Text>
            </View>

            <View style={styles.formContainer}>
              <AuthInput
                label="Email"
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Text style={styles.inputIcon}>📧</Text>}
              />

              <AuthInput
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                isPassword
                leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              <ModernButton
                title={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                onPress={handleLogin}
                variant="primary"
                size="lg"
                isLoading={isLoading}
                isDisabled={isLoading}
                fullWidth
                style={styles.loginButton}
              />
            </View>
          </ModernCard>

          <View style={styles.actionsContainer}>
            <ModernCard variant="outlined" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>👥</Text>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Gestión de Clientes</Text>
                  <Text style={styles.actionDescription}>
                    Administrar perfiles y datos de clientes
                  </Text>
                </View>
              </View>
              <ModernButton
                title="Ver Clientes"
                onPress={() => navigation.navigate('Clients')}
                variant="primary"
                size="md"
              />
            </ModernCard>

            <ModernCard variant="filled" style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>🚪</Text>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Cerrar Sesión</Text>
                  <Text style={styles.actionDescription}>
                    Salir de la aplicación de forma segura
                  </Text>
                </View>
              </View>
              <ModernButton
                title="Cerrar Sesión"
                onPress={logout}
                variant="ghost"
                size="md"
              />
            </ModernCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 32,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  loginCard: {
    marginBottom: 24,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    gap: 4,
  },
  inputIcon: {
    fontSize: 18,
  },
  loginButton: {
    marginTop: 24,
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  userInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  userRole: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;