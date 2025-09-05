// 🧭 Navegador de Autenticación - Stack de pantallas de auth

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen, ProfileScreen } from '../screens/auth';
import { COLORS } from '../constants';
import type { AuthStackParamList } from '../types/auth';

// 🎯 Crear stack navigator
const Stack = createNativeStackNavigator<AuthStackParamList>();

// 🎨 Componente AuthNavigator
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // Ocultamos headers para diseño personalizado
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: 'slide_from_right', // Animación suave
      }}
    >
      {/* 🔐 Pantalla de Login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Iniciar Sesión',
        }}
      />

      {/* 📝 Pantalla de Registro */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Crear Cuenta',
          animation: 'slide_from_bottom', // Animación diferente para registro
        }}
      />

      {/* 🔑 Pantalla de Recuperar Contraseña */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Recuperar Contraseña',
          animation: 'slide_from_bottom',
        }}
      />

      {/* 👤 Pantalla de Perfil */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />

      {/* TODO: Agregar cuando se implementen */}
      {/* 
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Recuperar Contraseña',
          animation: 'fade',
        }}
      />
      
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'Restablecer Contraseña',
        }}
      />
      */}
    </Stack.Navigator>
  );
};

AuthNavigator.displayName = 'AuthNavigator';

export { AuthNavigator };
export default AuthNavigator;