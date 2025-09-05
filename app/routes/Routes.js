import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/Home/Home';
import { AuthNavigator } from './AuthNavigator';
import { CompanyNavigator } from './CompanyNavigator';
import { useAuth } from '../contexts/AuthContext';
import { CompanyProvider } from '../contexts/CompanyContext';
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Usuario autenticado - Mostrar pantallas principales
            <>
              <Stack.Screen name="Main" component={HomeScreen} />
              <Stack.Screen name="Company" component={CompanyNavigator} />
            </>
          ) : (
            // Usuario no autenticado - Mostrar pantallas de autenticación
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </CompanyProvider>
  );
}

export default Routes;
