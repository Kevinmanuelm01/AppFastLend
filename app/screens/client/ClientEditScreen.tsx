// ✏️ Pantalla de Editar Cliente - Formulario de edición

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackRouteProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton } from '../../components/auth';
import { ModernCard } from '../../components/common';
import { useClient } from '../../contexts/ClientContext';
import { COLORS, SPACING } from '../../constants';
import {
  Client,
  ClientFormData,
  ClientStackParamList,
  DocumentType,
  EmploymentType,
  BankType,
} from '../../types/client';

// 🎯 Tipos de navegación
type ClientEditScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  'ClientEdit'
>;

type ClientEditScreenRouteProp = NativeStackRouteProp<
  ClientStackParamList,
  'ClientEdit'
>;

// 📋 Schema de validación (mismo que crear)
const clientEditSchema = yup.object().shape({
  firstName: yup.string().required('Nombre es obligatorio').min(2, 'Mínimo 2 caracteres'),
  lastName: yup.string().required('Apellido es obligatorio').min(2, 'Mínimo 2 caracteres'),
  email: yup.string().required('Email es obligatorio').email('Email inválido'),
  phone: yup.string().required('Teléfono es obligatorio'),
  dateOfBirth: yup.string().required('Fecha de nacimiento es obligatoria'),
  documentNumber: yup.string().required('Número de documento es obligatorio'),
  address: yup.object().shape({
    street: yup.string().required('Dirección es obligatoria'),
    city: yup.string().required('Ciudad es obligatoria'),
    state: yup.string().required('Provincia es obligatoria'),
    zipCode: yup.string().required('Código postal es obligatorio'),
  }),
  employmentInfo: yup.object().shape({
    company: yup.string().required('Empresa es obligatoria'),
    position: yup.string().required('Cargo es obligatorio'),
    monthlyIncome: yup.number().required('Ingresos son obligatorios').min(1, 'Debe ser mayor a 0'),
  }),
  bankingInfo: yup.object().shape({
    accountNumber: yup.string().required('Número de cuenta es obligatorio'),
  }),
});

// 🎨 Componente principal
export const ClientEditScreen: React.FC = () => {
  const navigation = useNavigation<ClientEditScreenNavigationProp>();
  const route = useRoute<ClientEditScreenRouteProp>();
  const { clientId } = route.params;
  
  const { getClient, updateClient, isLoading: contextLoading } = useClient();
  
  // 🎯 Estados locales
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 📋 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientEditSchema) as any,
    mode: 'onChange',
  });

  // 🔄 Cargar cliente al montar
  useEffect(() => {
    loadClient();
  }, [clientId]);

  // 📖 Cargar datos del cliente
  const loadClient = async () => {
    try {
      setIsLoading(true);
      const clientData = await getClient(clientId);
      
      if (clientData) {
        setClient(clientData);
        
        // Llenar formulario con datos existentes
        reset({
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          dateOfBirth: clientData.dateOfBirth,
          documentType: clientData.documentType,
          documentNumber: clientData.documentNumber,
          address: clientData.address,
          employmentInfo: clientData.employmentInfo,
          monthlyExpenses: clientData.monthlyExpenses,
          otherIncome: clientData.otherIncome,
          bankingInfo: clientData.bankingInfo,
          internalNotes: clientData.internalNotes,
          preferences: clientData.preferences,
        });
      } else {
        Alert.alert('❌ Error', 'Cliente no encontrado.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading client:', error);
      Alert.alert('❌ Error', 'No se pudo cargar el cliente.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Guardar cambios
  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSaving(true);
      
      await updateClient(clientId, data);
      
      Alert.alert(
        '✅ Cliente Actualizado',
        'Los datos del cliente han sido actualizados exitosamente.',
        [
          {
            text: 'Ver Cliente',
            onPress: () => navigation.navigate('ClientDetails', { clientId }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo actualizar el cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  // 🔄 Cancelar edición
  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        '⚠️ Cambios sin Guardar',
        '¿Estás seguro que deseas salir? Se perderán los cambios.',
        [
          { text: 'Continuar Editando', style: 'cancel' },
          { text: 'Salir sin Guardar', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ModernCard variant="elevated" style={styles.formCard}>
          {/* 🎨 Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={handleCancel}>
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Editar Cliente</Text>
              <Text style={styles.subtitle}>
                {client?.firstName} {client?.lastName}
              </Text>
            </View>
          </View>

          {/* 📝 Formulario */}
          <View style={styles.form}>
            {/* 👤 Información personal */}
            <Text style={styles.sectionTitle}>👤 Información Personal</Text>
            
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Nombre *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  leftIcon={<Text>👤</Text>}
                />
              )}
            />
            
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Apellido *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  leftIcon={<Text>👤</Text>}
                />
              )}
            />
            
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Email *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Text>📧</Text>}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Teléfono *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  leftIcon={<Text>📱</Text>}
                  keyboardType="phone-pad"
                />
              )}
            />

            {/* 💼 Información laboral */}
            <Text style={styles.sectionTitle}>💼 Información Laboral</Text>
            
            <Controller
              control={control}
              name="employmentInfo.company"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Empresa *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.employmentInfo?.company?.message}
                  leftIcon={<Text>🏢</Text>}
                />
              )}
            />
            
            <Controller
              control={control}
              name="employmentInfo.position"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Cargo *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.employmentInfo?.position?.message}
                  leftIcon={<Text>💼</Text>}
                />
              )}
            />
            
            <Controller
              control={control}
              name="employmentInfo.monthlyIncome"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Ingresos Mensuales (DOP) *"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(Number(text) || 0)}
                  onBlur={onBlur}
                  error={errors.employmentInfo?.monthlyIncome?.message}
                  leftIcon={<Text>💰</Text>}
                  keyboardType="numeric"
                />
              )}
            />

            {/* 📝 Notas internas */}
            <Text style={styles.sectionTitle}>📝 Notas Internas</Text>
            
            <Controller
              control={control}
              name="internalNotes"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  label="Observaciones (Opcional)"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  leftIcon={<Text>📝</Text>}
                  multiline
                  helperText="Solo visible para empleados internos"
                />
              )}
            />
          </View>

          {/* 🎯 Botones de acción */}
          <View style={styles.actionButtons}>
            <AuthButton
              title="❌ Cancelar"
              onPress={handleCancel}
              variant="outline"
              size="large"
              style={styles.cancelButton}
            />
            
            <AuthButton
              title={isSaving ? "Guardando..." : "💾 Guardar Cambios"}
              onPress={handleSubmit(onSubmit)}
              isLoading={isSaving || contextLoading}
              isDisabled={!isValid || !isDirty || isSaving}
              variant="primary"
              size="large"
              style={styles.saveButton}
            />
          </View>
        </ModernCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  formCard: {
    padding: SPACING.lg,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backIcon: {
    marginRight: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundSecondary,
  },
  backIconText: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

export default ClientEditScreen;