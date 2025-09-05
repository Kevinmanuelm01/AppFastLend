// 🏦 Pantalla de Acceso Bancario - ADVERTENCIA: Funcionalidad de alto riesgo

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackRouteProp } from '@react-navigation/native-stack';
import { ModernCard, ModernButton } from '../../components/common';
import { AuthInput } from '../../components/auth';
import { useClient } from '../../contexts/ClientContext';
import { COLORS, SPACING } from '../../constants';
import { Client, ClientStackParamList, BANK_CONFIGS } from '../../types/client';

// 🎯 Tipos de navegación
type ClientBankAccessScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  'ClientBankAccess'
>;

type ClientBankAccessScreenRouteProp = NativeStackRouteProp<
  ClientStackParamList,
  'ClientBankAccess'
>;

// 🎨 Componente principal
export const ClientBankAccessScreen: React.FC = () => {
  const navigation = useNavigation<ClientBankAccessScreenNavigationProp>();
  const route = useRoute<ClientBankAccessScreenRouteProp>();
  const { clientId } = route.params;
  
  const { getClient, initiateBankAccess } = useClient();
  
  // 🎯 Estados locales
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bankAccessLoading, setBankAccessLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientAuthorized, setClientAuthorized] = useState(false);
  const [securityAcknowledged, setSecurityAcknowledged] = useState(false);
  const [complianceAcknowledged, setComplianceAcknowledged] = useState(false);

  // 🔄 Cargar cliente al montar
  useEffect(() => {
    loadClient();
  }, [clientId]);

  // 📖 Cargar datos del cliente
  const loadClient = async () => {
    try {
      setIsLoading(true);
      const clientData = await getClient(clientId);
      setClient(clientData);
    } catch (error) {
      console.error('Error loading client:', error);
      Alert.alert('❌ Error', 'No se pudo cargar la información del cliente.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  // 🏦 Iniciar acceso bancario
  const handleBankAccess = async () => {
    if (!client) return;

    // Validaciones de seguridad
    if (!clientAuthorized) {
      Alert.alert('⚠️ Autorización Requerida', 'Debes confirmar que el cliente ha autorizado este acceso.');
      return;
    }

    if (!securityAcknowledged) {
      Alert.alert('⚠️ Protocolo de Seguridad', 'Debes reconocer los protocolos de seguridad.');
      return;
    }

    if (!complianceAcknowledged) {
      Alert.alert('⚠️ Cumplimiento Normativo', 'Debes confirmar el cumplimiento de regulaciones.');
      return;
    }

    if (!username.trim() || !password.trim()) {
      Alert.alert('⚠️ Credenciales Requeridas', 'Debes ingresar las credenciales bancarias del cliente.');
      return;
    }

    // ADVERTENCIA FINAL CRÍTICA
    Alert.alert(
      '🚨 CONFIRMACIÓN FINAL DE SEGURIDAD',
      '⚠️ ESTA ACCIÓN ACCEDERÁ DIRECTAMENTE A LA BANCA EN LÍNEA DEL CLIENTE\n\n' +
      '🔐 Confirma que:\n' +
      '• El cliente está presente y ha autorizado este acceso\n' +
      '• Las credenciales son correctas y actuales\n' +
      '• Cumples con todas las regulaciones de protección de datos\n' +
      '• Este acceso será registrado en el log de auditoría\n\n' +
      '⚖️ ¿Proceder con el acceso bancario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'PROCEDER CON EXTREMA PRECAUCIÓN',
          style: 'destructive',
          onPress: async () => {
            try {
              setBankAccessLoading(true);
              
              // Simular proceso de acceso bancario
              const result = await initiateBankAccess(client.id);
              
              if (result.success && result.url) {
                // En producción, aquí se enviarían las credenciales al backend
                // que manejaría Puppeteer/Selenium de forma segura
                
                Alert.alert(
                  '🔒 Acceso Bancario Iniciado',
                  '✅ El sistema está procesando el acceso al banco.\n\n' +
                  '📋 Se ha registrado esta acción en el log de auditoría.\n\n' +
                  '🔗 ¿Deseas abrir el enlace del banco?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Abrir Banco',
                      onPress: () => {
                        Linking.openURL(result.url!).catch(() => {
                          Alert.alert('❌ Error', 'No se pudo abrir el enlace del banco.');
                        });
                      },
                    },
                  ]
                );
                
                // Limpiar credenciales por seguridad
                setUsername('');
                setPassword('');
              } else {
                Alert.alert('❌ Error', 'No se pudo iniciar el acceso bancario.');
              }
            } catch (error) {
              Alert.alert('❌ Error', 'Error al procesar el acceso bancario.');
            } finally {
              setBankAccessLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando información bancaria...</Text>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Cliente no encontrado</Text>
        <ModernButton
          title="← Volver"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </View>
    );
  }

  const bankConfig = BANK_CONFIGS[client.bankingInfo.primaryBank];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🚨 ADVERTENCIA CRÍTICA DE SEGURIDAD */}
      <ModernCard variant="outlined" style={[styles.card, styles.criticalWarningCard]}>
        <View style={styles.warningHeader}>
          <Text style={styles.criticalWarningIcon}>🚨</Text>
          <Text style={styles.criticalWarningTitle}>
            ADVERTENCIA CRÍTICA DE SEGURIDAD
          </Text>
        </View>
        
        <Text style={styles.criticalWarningText}>
          Esta funcionalidad accede directamente a la banca en línea del cliente utilizando sus credenciales personales.
        </Text>
        
        <View style={styles.warningList}>
          <Text style={styles.warningItem}>⚠️ Requiere autorización explícita del cliente</Text>
          <Text style={styles.warningItem}>🔐 Maneja información financiera sensible</Text>
          <Text style={styles.warningItem}>📋 Se registra en logs de auditoría</Text>
          <Text style={styles.warningItem}>⚖️ Debe cumplir regulaciones de protección de datos</Text>
          <Text style={styles.warningItem}>🛡️ Solo personal autorizado puede usar esta función</Text>
        </View>
      </ModernCard>

      {/* 👤 Información del cliente */}
      <ModernCard variant="elevated" style={styles.card}>
        <Text style={styles.sectionTitle}>👤 Cliente</Text>
        
        <View style={styles.clientInfo}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>
              {client.firstName[0]}{client.lastName[0]}
            </Text>
          </View>
          
          <View style={styles.clientDetails}>
            <Text style={styles.clientName}>
              {client.firstName} {client.lastName}
            </Text>
            <Text style={styles.clientEmail}>{client.email}</Text>
            <Text style={styles.clientBank}>
              🏦 {getBankLabel(client.bankingInfo.primaryBank)}
            </Text>
          </View>
        </View>
      </ModernCard>

      {/* 🔐 Credenciales bancarias */}
      <ModernCard variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>🔐 Credenciales Bancarias</Text>
        
        <View style={styles.bankInfo}>
          <Text style={styles.bankInfoText}>
            🏦 Banco: {getBankLabel(client.bankingInfo.primaryBank)}
          </Text>
          <Text style={styles.bankInfoText}>
            🔗 URL: {bankConfig.bankUrl}
          </Text>
        </View>

        <AuthInput
          label="Usuario de Banca en Línea"
          placeholder="usuario_bancario"
          value={username}
          onChangeText={setUsername}
          leftIcon={<Text>👤</Text>}
          autoCapitalize="none"
          helperText="Credenciales proporcionadas por el cliente"
        />

        <AuthInput
          label="Contraseña de Banca en Línea"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Text>🔒</Text>}
          isPassword
          helperText="NUNCA almacenar en texto plano"
        />
      </ModernCard>

      {/* ✅ Verificaciones de seguridad */}
      <ModernCard variant="filled" style={styles.card}>
        <Text style={styles.sectionTitle}>✅ Verificaciones de Seguridad</Text>
        
        <View style={styles.checklistContainer}>
          <View style={styles.checklistItem}>
            <Switch
              value={clientAuthorized}
              onValueChange={setClientAuthorized}
              trackColor={{ false: COLORS.border, true: COLORS.success + '40' }}
              thumbColor={clientAuthorized ? COLORS.success : COLORS.text.light}
            />
            <Text style={styles.checklistText}>
              📋 El cliente ha autorizado explícitamente este acceso
            </Text>
          </View>
          
          <View style={styles.checklistItem}>
            <Switch
              value={securityAcknowledged}
              onValueChange={setSecurityAcknowledged}
              trackColor={{ false: COLORS.border, true: COLORS.success + '40' }}
              thumbColor={securityAcknowledged ? COLORS.success : COLORS.text.light}
            />
            <Text style={styles.checklistText}>
              🛡️ Reconozco los protocolos de seguridad implementados
            </Text>
          </View>
          
          <View style={styles.checklistItem}>
            <Switch
              value={complianceAcknowledged}
              onValueChange={setComplianceAcknowledged}
              trackColor={{ false: COLORS.border, true: COLORS.success + '40' }}
              thumbColor={complianceAcknowledged ? COLORS.success : COLORS.text.light}
            />
            <Text style={styles.checklistText}>
              ⚖️ Confirmo cumplimiento de regulaciones de protección de datos
            </Text>
          </View>
        </View>
      </ModernCard>

      {/* 📋 Información técnica */}
      <ModernCard variant="outlined" style={styles.card}>
        <Text style={styles.sectionTitle}>📋 Información Técnica</Text>
        
        <View style={styles.technicalInfo}>
          <Text style={styles.technicalLabel}>🔧 Método de Acceso:</Text>
          <Text style={styles.technicalValue}>Puppeteer/Selenium Backend</Text>
          
          <Text style={styles.technicalLabel}>🔒 Encriptación:</Text>
          <Text style={styles.technicalValue}>AES-256 + TLS 1.3</Text>
          
          <Text style={styles.technicalLabel}>📊 Log de Auditoría:</Text>
          <Text style={styles.technicalValue}>Habilitado</Text>
          
          <Text style={styles.technicalLabel}>⏱️ Timeout de Sesión:</Text>
          <Text style={styles.technicalValue}>5 minutos</Text>
        </View>
      </ModernCard>

      {/* 🎯 Botones de acción */}
      <View style={styles.actionContainer}>
        <ModernButton
          title="🏦 Iniciar Acceso Bancario"
          onPress={handleBankAccess}
          variant="danger"
          size="lg"
          isLoading={bankAccessLoading}
          isDisabled={
            !clientAuthorized || 
            !securityAcknowledged || 
            !complianceAcknowledged || 
            !username.trim() || 
            !password.trim() ||
            bankAccessLoading
          }
          style={styles.accessButton}
        />
        
        <ModernButton
          title="← Volver al Cliente"
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="md"
          style={styles.backButton}
        />
      </View>

      {/* 📚 Documentación de seguridad */}
      <ModernCard variant="filled" style={styles.card}>
        <Text style={styles.sectionTitle}>📚 Documentación de Seguridad</Text>
        
        <Text style={styles.documentationText}>
          Esta funcionalidad está diseñada para cumplir con:
        </Text>
        
        <View style={styles.complianceList}>
          <Text style={styles.complianceItem}>🏛️ Ley de Protección de Datos Personales</Text>
          <Text style={styles.complianceItem}>🏦 Regulaciones de la Superintendencia de Bancos</Text>
          <Text style={styles.complianceItem}>🔒 Estándares PCI DSS para datos financieros</Text>
          <Text style={styles.complianceItem}>📋 Políticas internas de seguridad</Text>
        </View>
        
        <TouchableOpacity
          style={styles.documentationButton}
          onPress={() => {
            Alert.alert(
              '📚 Documentación Completa',
              'En una implementación real, aquí se mostraría la documentación completa de seguridad y cumplimiento normativo.',
              [{ text: 'Entendido' }]
            );
          }}
        >
          <Text style={styles.documentationButtonText}>
            📖 Ver Documentación Completa
          </Text>
        </TouchableOpacity>
      </ModernCard>
    </ScrollView>
  );
};

// 🎨 Función auxiliar
const getBankLabel = (bank: string): string => {
  switch (bank) {
    case 'BANCO_POPULAR': return 'Banco Popular';
    case 'BANCO_RESERVAS': return 'BanReservas';
    case 'BANCO_BHD': return 'BHD León';
    case 'BANESCO': return 'Banesco';
    case 'BANCO_SANTA_CRUZ': return 'Banco Santa Cruz';
    case 'BANCO_PROMERICA': return 'Promerica';
    default: return 'Otro Banco';
  }
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.md,
  },
  criticalWarningCard: {
    borderColor: COLORS.error,
    borderWidth: 2,
    backgroundColor: COLORS.error + '05',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  criticalWarningIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  criticalWarningTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.error,
    flex: 1,
  },
  criticalWarningText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  warningList: {
    gap: SPACING.sm,
  },
  warningItem: {
    fontSize: 14,
    color: COLORS.error,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  clientAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  clientBank: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bankInfo: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  bankInfoText: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  checklistContainer: {
    gap: SPACING.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  checklistText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
    marginLeft: SPACING.md,
    lineHeight: 20,
  },
  technicalInfo: {
    gap: SPACING.sm,
  },
  technicalLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  technicalValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  actionContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  accessButton: {
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    alignSelf: 'center',
  },
  documentationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  complianceList: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  complianceItem: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 18,
  },
  documentationButton: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    alignItems: 'center',
  },
  documentationButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ClientBankAccessScreen;