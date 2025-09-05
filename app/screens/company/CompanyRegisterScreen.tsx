// 🏢 Pantalla de Registro de Empresas - App de Préstamos

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 📱 Importaciones locales
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthCard from '../../components/auth/AuthCard';
import { useCompany } from '../../contexts/CompanyContext';
import { COLORS } from '../../constants';
import {
  CompanyRegistrationData,
  CompanyType,
  IndustryType,
  CompanySize,
  CompanyStackParamList,
} from '../../types/company';

// 🎯 Tipo de navegación
type CompanyRegisterScreenNavigationProp = NativeStackNavigationProp<
  CompanyStackParamList,
  'CompanyRegistration'
>;

// 📋 Schema de validación con Yup
const companyRegistrationSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre de la empresa es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  legalName: yup
    .string()
    .required('La razón social es obligatoria')
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(150, 'La razón social no puede exceder 150 caracteres'),
  
  taxId: yup
    .string()
    .required('El RNC/Cédula es obligatorio')
    .matches(/^[0-9]{9,11}$/, 'El RNC/Cédula debe tener entre 9 y 11 dígitos'),
  
  email: yup
    .string()
    .required('El email es obligatorio')
    .email('Ingresa un email válido'),
  
  phone: yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^[0-9+\-\s()]{10,15}$/, 'Ingresa un teléfono válido'),
  
  website: yup
    .string()
    .url('Ingresa una URL válida')
    .nullable(),
  
  companyType: yup
    .string()
    .required('El tipo de empresa es obligatorio')
    .oneOf(Object.values(CompanyType), 'Selecciona un tipo válido'),
  
  registrationNumber: yup
    .string()
    .required('El número de registro es obligatorio')
    .min(5, 'El número de registro debe tener al menos 5 caracteres'),
  
  registrationDate: yup
    .string()
    .required('La fecha de registro es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  
  industry: yup
    .string()
    .required('La industria es obligatoria')
    .oneOf(Object.values(IndustryType), 'Selecciona una industria válida'),
  
  companySize: yup
    .string()
    .required('El tamaño de empresa es obligatorio')
    .oneOf(Object.values(CompanySize), 'Selecciona un tamaño válido'),
  
  employeeCount: yup
    .number()
    .required('El número de empleados es obligatorio')
    .min(1, 'Debe tener al menos 1 empleado')
    .max(10000, 'Número de empleados muy alto'),
  
  address: yup.object().shape({
    street: yup
      .string()
      .required('La dirección es obligatoria')
      .min(10, 'La dirección debe ser más específica'),
    
    city: yup
      .string()
      .required('La ciudad es obligatoria')
      .min(2, 'Ingresa una ciudad válida'),
    
    state: yup
      .string()
      .required('La provincia es obligatoria')
      .min(2, 'Ingresa una provincia válida'),
    
    zipCode: yup
      .string()
      .required('El código postal es obligatorio')
      .matches(/^[0-9]{5}$/, 'El código postal debe tener 5 dígitos'),
    
    country: yup
      .string()
      .required('El país es obligatorio')
      .min(2, 'Ingresa un país válido'),
  }),
  
  annualRevenue: yup
    .number()
    .required('Los ingresos anuales son obligatorios')
    .min(0, 'Los ingresos no pueden ser negativos'),
  
  legalRepresentative: yup.object().shape({
    firstName: yup
      .string()
      .required('El nombre del representante es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    
    lastName: yup
      .string()
      .required('El apellido del representante es obligatorio')
      .min(2, 'El apellido debe tener al menos 2 caracteres'),
    
    email: yup
      .string()
      .required('El email del representante es obligatorio')
      .email('Ingresa un email válido'),
    
    phone: yup
      .string()
      .required('El teléfono del representante es obligatorio')
      .matches(/^[0-9+\-\s()]{10,15}$/, 'Ingresa un teléfono válido'),
    
    position: yup
      .string()
      .required('El cargo del representante es obligatorio')
      .min(2, 'El cargo debe tener al menos 2 caracteres'),
  }),
});

// 🏢 Componente principal
export const CompanyRegisterScreen: React.FC = () => {
  const navigation = useNavigation<CompanyRegisterScreenNavigationProp>();
  const { registerCompany, isLoading, error } = useCompany();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // 📋 Configuración del formulario
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<CompanyRegistrationData>({
    resolver: yupResolver(companyRegistrationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      companyType: CompanyType.LLC,
      industry: IndustryType.OTHER,
      companySize: CompanySize.SMALL,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'República Dominicana',
      },
      legalRepresentative: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        documentType: 'DNI' as const,
        documentNumber: '',
      },
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
  });

  // 📝 Manejar envío del formulario
  const onSubmit = async (data: CompanyRegistrationData) => {
    try {
      await registerCompany(data);
      
      Alert.alert(
          '🎉 ¡Empresa Registrada!',
          'Tu empresa ha sido registrada exitosamente. Recibirás una notificación cuando sea verificada.',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.goBack(),
            },
          ]
        );
    } catch (error) {
      Alert.alert(
        '❌ Error',
        'Hubo un problema al registrar la empresa. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  // 🔄 Navegar entre pasos
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

  // 📋 Obtener campos por paso
  const getFieldsForStep = (step: number): (keyof CompanyRegistrationData | string)[] => {
    switch (step) {
      case 1:
        return ['name', 'legalName', 'taxId', 'email', 'phone', 'website'];
      case 2:
        return ['companyType', 'registrationNumber', 'registrationDate', 'industry', 'companySize', 'employeeCount'];
      case 3:
        return ['address', 'annualRevenue'];
      case 4:
        return ['legalRepresentative'];
      default:
        return [];
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

  // 🎨 Renderizar paso 1: Información básica
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📋 Información Básica</Text>
      
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Nombre Comercial *"
            placeholder="Ej: Mi Empresa SRL"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            leftIcon="business-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="legalName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Razón Social *"
            placeholder="Nombre legal de la empresa"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalName?.message}
            leftIcon="document-text-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="taxId"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="RNC/Cédula *"
            placeholder="123456789"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.taxId?.message}
            leftIcon="card-outline"
            keyboardType="numeric"
          />
        )}
      />
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Email Corporativo *"
            placeholder="empresa@ejemplo.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            leftIcon="mail-outline"
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
            placeholder="+1 (809) 123-4567"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />
        )}
      />
      
      <Controller
        control={control}
        name="website"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Sitio Web"
            placeholder="https://www.empresa.com"
            value={value || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.website?.message}
            leftIcon="globe-outline"
            keyboardType="url"
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 2: Información legal
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>⚖️ Información Legal</Text>
      
      {/* Aquí irían los selectores para tipo de empresa, industria, etc. */}
      {/* Por simplicidad, usando inputs de texto */}
      
      <Controller
        control={control}
        name="registrationNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Número de Registro *"
            placeholder="REG-123456"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.registrationNumber?.message}
            leftIcon="receipt-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="registrationDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Fecha de Registro *"
            placeholder="2024-01-15"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.registrationDate?.message}
            leftIcon="calendar-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="employeeCount"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Número de Empleados *"
            placeholder="25"
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(parseInt(text) || 0)}
            onBlur={onBlur}
            error={errors.employeeCount?.message}
            leftIcon="people-outline"
            keyboardType="numeric"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 3: Dirección y finanzas
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🏢 Dirección y Finanzas</Text>
      
      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Dirección *"
            placeholder="Calle Principal #123, Sector Centro"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.street?.message}
            leftIcon="location-outline"
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
            leftIcon="business-outline"
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
            leftIcon="map-outline"
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
            leftIcon="mail-outline"
            keyboardType="numeric"
          />
        )}
      />
      
      <Controller
        control={control}
        name="annualRevenue"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Ingresos Anuales (RD$) *"
            placeholder="5000000"
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(parseFloat(text) || 0)}
            onBlur={onBlur}
            error={errors.annualRevenue?.message}
            leftIcon="cash-outline"
            keyboardType="numeric"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 4: Representante legal
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>👤 Representante Legal</Text>
      
      <Controller
        control={control}
        name="legalRepresentative.firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Nombre *"
            placeholder="Juan"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalRepresentative?.firstName?.message}
            leftIcon="person-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="legalRepresentative.lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Apellido *"
            placeholder="Pérez"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalRepresentative?.lastName?.message}
            leftIcon="person-outline"
          />
        )}
      />
      
      <Controller
        control={control}
        name="legalRepresentative.email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Email *"
            placeholder="juan.perez@empresa.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalRepresentative?.email?.message}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      
      <Controller
        control={control}
        name="legalRepresentative.phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Teléfono *"
            placeholder="+1 (809) 123-4567"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalRepresentative?.phone?.message}
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />
        )}
      />
      
      <Controller
        control={control}
        name="legalRepresentative.position"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Cargo *"
            placeholder="Gerente General"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.legalRepresentative?.position?.message}
            leftIcon="briefcase-outline"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar contenido del paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  // 🎨 Renderizar botones de navegación
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Text style={styles.backButtonIcon}>‹</Text>
          <Text style={styles.backButtonText}>Anterior</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.spacer} />
      
      {currentStep < totalSteps ? (
        <AuthButton
          title="Siguiente"
          onPress={nextStep}
          style={styles.nextButton}
        />
      ) : (
        <AuthButton
          title={isLoading ? "Registrando..." : "Registrar Empresa"}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
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
        <AuthCard>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>🏢 Registro de Empresa</Text>
              <Text style={styles.subtitle}>
                Completa la información para registrar tu empresa
              </Text>
            </View>
          </View>

          {renderProgressIndicator()}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {renderCurrentStep()}
          {renderNavigationButtons()}
        </AuthCard>
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
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backIcon: {
    marginRight: 15,
    padding: 5,
  },
  backIconText: {
    fontSize: 24,
    color: COLORS.text.primary,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  backButtonIcon: {
    fontSize: 18,
    color: COLORS.primary,
    marginRight: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
    marginLeft: 15,
  },
  submitButton: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default CompanyRegisterScreen;