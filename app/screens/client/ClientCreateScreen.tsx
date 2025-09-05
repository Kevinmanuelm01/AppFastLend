// 📝 Pantalla de Crear Cliente - Formulario completo

import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthInput, AuthButton } from '../../components/auth';
import { ModernCard } from '../../components/common';
import { useClient } from '../../contexts/ClientContext';
import { COLORS, SPACING } from '../../constants';
import {
  ClientFormData,
  ClientStackParamList,
  DocumentType,
  EmploymentType,
  BankType,
} from '../../types/client';

// 🎯 Tipo de navegación
type ClientCreateScreenNavigationProp = NativeStackNavigationProp<
  ClientStackParamList,
  'ClientCreate'
>;

// 📋 Schema de validación
const clientSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),
  lastName: yup
    .string()
    .required('Apellido es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),
  email: yup
    .string()
    .required('Email es obligatorio')
    .email('Email inválido'),
  phone: yup
    .string()
    .required('Teléfono es obligatorio')
    .matches(/^[+]?[0-9\s\-\(\)]{10,}$/, 'Teléfono inválido'),
  dateOfBirth: yup
    .string()
    .required('Fecha de nacimiento es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  documentNumber: yup
    .string()
    .required('Número de documento es obligatorio')
    .min(8, 'Mínimo 8 caracteres'),
  address: yup.object().shape({
    street: yup.string().required('Dirección es obligatoria'),
    city: yup.string().required('Ciudad es obligatoria'),
    state: yup.string().required('Provincia es obligatoria'),
    zipCode: yup.string().required('Código postal es obligatorio'),
    country: yup.string().required('País es obligatorio'),
  }),
  employmentInfo: yup.object().shape({
    company: yup.string().required('Empresa es obligatoria'),
    position: yup.string().required('Cargo es obligatorio'),
    monthlyIncome: yup
      .number()
      .required('Ingresos mensuales son obligatorios')
      .min(1, 'Debe ser mayor a 0'),
  }),
  bankingInfo: yup.object().shape({
    accountNumber: yup
      .string()
      .required('Número de cuenta es obligatorio')
      .min(8, 'Mínimo 8 dígitos'),
  }),
});

// 🎨 Componente principal
export const ClientCreateScreen: React.FC = () => {
  const navigation = useNavigation<ClientCreateScreenNavigationProp>();
  const { createClient, isLoading } = useClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // 📋 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientSchema) as any,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      documentType: DocumentType.CEDULA,
      documentNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'República Dominicana',
      },
      employmentInfo: {
        company: '',
        position: '',
        monthlyIncome: 0,
        employmentType: EmploymentType.FULL_TIME,
      },
      bankingInfo: {
        primaryBank: BankType.BANCO_POPULAR,
        accountNumber: '',
        accountType: 'SAVINGS',
      },
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsAlerts: false,
        language: 'es',
      },
    },
  });

  // 📝 Enviar formulario
  const onSubmit = async (data: ClientFormData) => {
    try {
      await createClient(data);
      
      Alert.alert(
        '✅ Cliente Creado',
        'El cliente ha sido registrado exitosamente.',
        [
          {
            text: 'Ver Cliente',
            onPress: () => navigation.navigate('ClientList'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo crear el cliente.');
    }
  };

  // 🔄 Navegación entre pasos
  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 🎨 Renderizar indicador de progreso
  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Paso {currentStep} de {totalSteps}
      </Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );

  // 🎨 Renderizar paso 1: Información personal
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>👤 Información Personal</Text>
      
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Nombre *"
            placeholder="Juan"
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
            placeholder="Pérez"
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
            placeholder="juan@email.com"
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
            placeholder="+1-809-123-4567"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            leftIcon={<Text>📱</Text>}
            keyboardType="phone-pad"
          />
        )}
      />
      
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Fecha de Nacimiento *"
            placeholder="1990-01-15"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.dateOfBirth?.message}
            leftIcon={<Text>📅</Text>}
            helperText="Formato: YYYY-MM-DD"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 2: Documentación
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📄 Documentación</Text>
      
      {/* Selector de tipo de documento */}
      <View style={styles.selectorContainer}>
        <Text style={styles.inputLabel}>Tipo de Documento *</Text>
        <Controller
          control={control}
          name="documentType"
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              {Object.values(DocumentType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    value === type && styles.pickerOptionSelected,
                  ]}
                  onPress={() => onChange(type)}
                >
                  <Text style={[
                    styles.pickerText,
                    value === type && styles.pickerTextSelected,
                  ]}>
                    {type === DocumentType.CEDULA ? 'Cédula' :
                     type === DocumentType.RNC ? 'RNC' :
                     type === DocumentType.PASSPORT ? 'Pasaporte' : 'Licencia'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="documentNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Número de Documento *"
            placeholder="001-1234567-8"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.documentNumber?.message}
            leftIcon={<Text>📄</Text>}
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 3: Dirección
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📍 Dirección</Text>
      
      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Dirección *"
            placeholder="Calle Principal #123"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.street?.message}
            leftIcon={<Text>📍</Text>}
            multiline
          />
        )}
      />
      
      <Controller
        control={control}
        name="address.city"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Ciudad *"
            placeholder="Santo Domingo"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.city?.message}
            leftIcon={<Text>🏙️</Text>}
          />
        )}
      />
      
      <Controller
        control={control}
        name="address.state"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Provincia *"
            placeholder="Distrito Nacional"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.state?.message}
            leftIcon={<Text>🗺️</Text>}
          />
        )}
      />
      
      <Controller
        control={control}
        name="address.zipCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Código Postal *"
            placeholder="10101"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.zipCode?.message}
            leftIcon={<Text>📮</Text>}
            keyboardType="numeric"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 4: Información laboral y bancaria
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>💼 Información Laboral y Bancaria</Text>
      
      <Controller
        control={control}
        name="employmentInfo.company"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Empresa *"
            placeholder="Empresa ABC SRL"
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
            placeholder="Gerente de Ventas"
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
            placeholder="50000"
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(Number(text) || 0)}
            onBlur={onBlur}
            error={errors.employmentInfo?.monthlyIncome?.message}
            leftIcon={<Text>💰</Text>}
            keyboardType="numeric"
          />
        )}
      />

      {/* Selector de banco */}
      <View style={styles.selectorContainer}>
        <Text style={styles.inputLabel}>Banco Principal *</Text>
        <Controller
          control={control}
          name="bankingInfo.primaryBank"
          render={({ field: { onChange, value } }) => (
            <View style={styles.bankGrid}>
              {Object.values(BankType).filter(bank => bank !== BankType.OTHER).map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={[
                    styles.bankOption,
                    value === bank && styles.bankOptionSelected,
                  ]}
                  onPress={() => onChange(bank)}
                >
                  <Text style={styles.bankEmoji}>🏦</Text>
                  <Text style={[
                    styles.bankText,
                    value === bank && styles.bankTextSelected,
                  ]}>
                    {getBankLabel(bank)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="bankingInfo.accountNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Número de Cuenta *"
            placeholder="123456789"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.bankingInfo?.accountNumber?.message}
            leftIcon={<Text>🏦</Text>}
            keyboardType="numeric"
          />
        )}
      />

      <Controller
        control={control}
        name="internalNotes"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Notas Internas (Opcional)"
            placeholder="Observaciones sobre el cliente..."
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
  );

  // 🎨 Renderizar contenido del paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  // 🎨 Renderizar botones de navegación
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Text style={styles.backButtonText}>← Anterior</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.spacer} />
      
      {currentStep < totalSteps ? (
        <AuthButton
          title="Siguiente →"
          onPress={nextStep}
          variant="primary"
          size="medium"
          style={styles.nextButton}
        />
      ) : (
        <AuthButton
          title={isLoading ? "Creando..." : "Crear Cliente"}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          variant="success"
          size="medium"
          style={styles.submitButton}
        />
      )}
    </View>
  );

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
            <TouchableOpacity 
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Nuevo Cliente</Text>
              <Text style={styles.subtitle}>
                Registra un nuevo cliente en el sistema
              </Text>
            </View>
          </View>

          {renderProgressIndicator()}
          {renderCurrentStep()}
          {renderNavigationButtons()}
        </ModernCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 🎨 Función auxiliar
const getBankLabel = (bank: BankType): string => {
  switch (bank) {
    case BankType.BANCO_POPULAR: return 'Popular';
    case BankType.BANCO_RESERVAS: return 'BanReservas';
    case BankType.BANCO_BHD: return 'BHD León';
    case BankType.BANESCO: return 'Banesco';
    case BankType.BANCO_SANTA_CRUZ: return 'Santa Cruz';
    case BankType.BANCO_PROMERICA: return 'Promerica';
    default: return 'Otro';
  }
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
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepContainer: {
    marginBottom: SPACING.lg,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  selectorContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pickerTextSelected: {
    color: '#FFFFFF',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  bankOption: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  bankOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  bankEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  bankText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  bankTextSelected: {
    color: COLORS.primary,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    paddingHorizontal: SPACING.lg,
  },
  submitButton: {
    paddingHorizontal: SPACING.lg,
  },
});

export default ClientCreateScreen;