// 🏦 Dashboard Principal - Pantalla principal después del login

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

// 🎯 Tipos
interface Account {
  id: string;
  name: string;
  type: string;
  number: string;
  balance: number;
  available: boolean;
}

// 🎨 Componente DashboardScreen
const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  // 🏦 Datos mock de cuentas
  const accounts: Account[] = [
    {
      id: '1',
      name: 'Cuenta Corriente',
      type: 'Corriente',
      number: '****1234',
      balance: 25750.5,
      available: true,
    },
    {
      id: '2',
      name: 'Cuenta de Ahorros',
      type: 'Ahorros',
      number: '****5678',
      balance: 68500,
      available: true,
    },
    {
      id: '3',
      name: 'Cuenta Empresarial',
      type: 'Empresarial',
      number: '****9012',
      balance: 185400.75,
      available: true,
    },
  ];

  // 🧮 Calcular saldo total
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // 🎯 Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // 🎯 Formatear número de cuenta
  const formatAccountNumber = (number: string) => {
    return number.replace(/\d(?=\d{4})/g, '*');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* 📱 Header con saldo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowBalance(!showBalance)}
          >
            <Text style={styles.eyeIcon}>👁️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <Text style={styles.balanceAmount}>
            {showBalance ? formatCurrency(totalBalance) : '••••••••'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 🏦 Mis Cuentas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Cuentas</Text>
            <Text style={styles.accountCount}>{accounts.length} cuentas</Text>
          </View>

          <View style={styles.accountsList}>
            {accounts.map((account) => (
              <TouchableOpacity key={account.id} style={styles.accountCard}>
                <View style={styles.accountIcon}>
                  <Text style={styles.accountIconText}>💳</Text>
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountDetails}>
                    {account.type} • {formatAccountNumber(account.number)}
                  </Text>
                </View>

                <View style={styles.accountBalance}>
                  <Text style={styles.balanceAmount}>
                    {showBalance ? formatCurrency(account.balance) : '••••••'}
                  </Text>
                  <Text style={styles.availableText}>Disponible</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ⚡ Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>+</Text>
              </View>
              <Text style={styles.actionTitle}>Solicitar</Text>
              <Text style={styles.actionSubtitle}>Producto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, styles.actionIconSecondary]}>
                <Text style={styles.actionIconTextSecondary}>📄</Text>
              </View>
              <Text style={styles.actionTitle}>Pagar</Text>
              <Text style={styles.actionSubtitle}>Servicios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 🧭 Navegación inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>↔️</Text>
          <Text style={styles.navText}>Transferir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ecf0f1',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  balanceSection: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#bdc3c7',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  accountCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  accountsList: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountIconText: {
    fontSize: 20,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  accountDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  availableText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconSecondary: {
    backgroundColor: '#ecf0f1',
  },
  actionIconText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
  actionIconTextSecondary: {
    fontSize: 20,
    color: '#2c3e50',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#2c3e50',
    fontWeight: '600',
  },
});

DashboardScreen.displayName = 'DashboardScreen';

export default DashboardScreen;
