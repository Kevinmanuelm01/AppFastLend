// 👥 Navegador de Clientes - Stack de pantallas de gestión de clientes

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ClientListScreen,
  ClientDetailsScreen,
  ClientCreateScreen,
  ClientEditScreen,
  ClientBankAccessScreen,
} from '../screens/client';
import { COLORS } from '../constants';
import type { ClientStackParamList } from '../types/client';

// 🎯 Crear stack navigator
const Stack = createNativeStackNavigator<ClientStackParamList>();

// 🎨 Componente ClientNavigator
const ClientNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ClientList"
      screenOptions={{
        headerShown: false, // Ocultamos headers para diseño personalizado
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: 'slide_from_right', // Animación suave
      }}
    >
      {/* 📋 Lista de clientes */}
      <Stack.Screen
        name="ClientList"
        component={ClientListScreen}
        options={{
          title: 'Gestión de Clientes',
        }}
      />

      {/* 👤 Detalles del cliente */}
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetailsScreen}
        options={{
          title: 'Detalles del Cliente',
          animation: 'slide_from_right',
        }}
      />

      {/* ➕ Crear cliente */}
      <Stack.Screen
        name="ClientCreate"
        component={ClientCreateScreen}
        options={{
          title: 'Nuevo Cliente',
          animation: 'slide_from_bottom',
        }}
      />

      {/* ✏️ Editar cliente */}
      <Stack.Screen
        name="ClientEdit"
        component={ClientEditScreen}
        options={{
          title: 'Editar Cliente',
          animation: 'slide_from_right',
        }}
      />

      {/* 🏦 Acceso bancario */}
      <Stack.Screen
        name="ClientBankAccess"
        component={ClientBankAccessScreen}
        options={{
          title: 'Acceso Bancario',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

ClientNavigator.displayName = 'ClientNavigator';

export { ClientNavigator };
export default ClientNavigator;