/**
 * AppFastLend - Aplicación de Préstamos Rápida y Segura
 * 
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './app/contexts/AuthContextSimple';
import Routes from './app/routes/Routes';
import { COLORS } from './app/constants';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <Routes />
    </AuthProvider>
  );
}

export default App;
