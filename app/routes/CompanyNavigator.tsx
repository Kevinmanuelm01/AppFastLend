// 🏢 Navegador de Empresas - Stack de pantallas de empresas

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CompanyRegisterScreen } from '../screens/company/CompanyRegisterScreen';
import { COLORS } from '../constants';
import type { CompanyStackParamList } from '../types/company';

// 🎯 Crear stack navigator
const Stack = createNativeStackNavigator<CompanyStackParamList>();

// 🎨 Componente CompanyNavigator
const CompanyNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CompanyRegistration"
      screenOptions={{
        headerShown: false, // Ocultamos headers para diseño personalizado
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: 'slide_from_right', // Animación suave
      }}
    >
      {/* 🏢 Pantalla de Registro de Empresa */}
      <Stack.Screen
        name="CompanyRegistration"
        component={CompanyRegisterScreen}
        options={{
          title: 'Registrar Empresa',
        }}
      />

      {/* TODO: Agregar más pantallas cuando se implementen */}
      {/* 
      <Stack.Screen
        name="CompanyList"
        component={CompanyListScreen}
        options={{
          title: 'Mis Empresas',
        }}
      />
      
      <Stack.Screen
        name="CompanyDetails"
        component={CompanyDetailsScreen}
        options={{
          title: 'Detalles de Empresa',
        }}
      />
      
      <Stack.Screen
        name="CompanyEdit"
        component={CompanyEditScreen}
        options={{
          title: 'Editar Empresa',
        }}
      />
      */}
    </Stack.Navigator>
  );
};

CompanyNavigator.displayName = 'CompanyNavigator';

export { CompanyNavigator };
export default CompanyNavigator;