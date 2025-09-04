import { COLORS } from '@/constants';
import * as React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '@/components/Button/Button';
import Input from '@/components/Button/Input';
import { isValidEmail } from '@/utils';

export function HomeScreen() {
  console.log('HomeScreen component rendered');

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome! 🎉</Text>
          <Text style={styles.subtitle}>React Native Template</Text>
          <Text style={styles.description}>
            Sign in to access the application
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            containerStyle={styles.inputContainer}
          />

          <Button
            title={isLoading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
  },
});

export default HomeScreen;