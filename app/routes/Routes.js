import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/Home/Home';
import { DashboardScreen } from '../screens/Dashboard';
import { AuthNavigator } from './AuthNavigator';
import { CompanyNavigator } from './CompanyNavigator';
import { ClientNavigator } from './ClientNavigator';
import { useAuth } from '../contexts/AuthContext';
import { CompanyProvider } from '../contexts/CompanyContext';
import { ClientProvider } from '../contexts/ClientContext';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

function Routes() {
  const { authState } = useAuth();
  const { user, isLoading } = authState;

  // Mostrar loading mientras se verifica el estado de autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <CompanyProvider>
      <ClientProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              // Usuario autenticado - Mostrar pantallas principales
              <>
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Main" component={HomeScreen} />
                <Stack.Screen name="Company" component={CompanyNavigator} />
                <Stack.Screen name="Clients" component={ClientNavigator} />
              </>
            ) : (
              // Usuario no autenticado - Mostrar pantallas de autenticación
              <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ClientProvider>
    </CompanyProvider>
  );
}

export default Routes;
