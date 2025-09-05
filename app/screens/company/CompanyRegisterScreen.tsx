// 🏢 Pantalla de Registro de Empresas - Versión mejorada

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
  DocumentType,
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
  companyType: yup
    .string()
    .required('El tipo de entidad es obligatorio')
    .oneOf(Object.values(CompanyType), 'Selecciona un tipo válido'),
  
  // Campos condicionales para Persona Jurídica
  firstName: yup
    .string()
    .when('companyType', {
      is: CompanyType.PERSONA_JURIDICA,
      then: (schema) => schema.required('El nombre es obligatorio').min(2, 'Mínimo 2 caracteres'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  lastName: yup
    .string()
    .when('companyType', {
      is: CompanyType.PERSONA_JURIDICA,
      then: (schema) => schema.required('El apellido es obligatorio').min(2, 'Mínimo 2 caracteres'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  // Campos condicionales para Empresa Comercial
  businessName: yup
    .string()
    .when('companyType', {
      is: CompanyType.EMPRESA_COMERCIAL,
      then: (schema) => schema.required('El nombre comercial es obligatorio').min(2, 'Mínimo 2 caracteres'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  legalName: yup
    .string()
    .when('companyType', {
      is: CompanyType.EMPRESA_COMERCIAL,
      then: (schema) => schema.required('La razón social es obligatoria').min(2, 'Mínimo 2 caracteres'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  documentType: yup
    .string()
    .required('El tipo de documento es obligatorio')
    .oneOf(Object.values(DocumentType), 'Selecciona un tipo válido'),
  
  documentNumber: yup
    .string()
    .required('El número de documento es obligatorio')
    .min(8, 'Mínimo 8 caracteres'),
  
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
  
  registrationDate: yup
    .string()
    .required('La fecha de registro es obligatoria')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  
  companyFoundationDate: yup
    .string()
    .required('La fecha de creación de la empresa es obligatoria')
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
    .min(1, 'Debe tener al menos 1 empleado')
    .max(10000, 'Número de empleados muy alto')
    .nullable(),
  
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
    .min(0, 'Los ingresos no pueden ser negativos')
    .nullable(),
  
  // Representante legal (condicional para empresas comerciales)
  legalRepresentative: yup.object().when('companyType', {
    is: CompanyType.EMPRESA_COMERCIAL,
    then: (schema) => schema.shape({
      firstName: yup
        .string()
        .required('El nombre del representante es obligatorio')
        .min(2, 'Mínimo 2 caracteres'),
      
      lastName: yup
        .string()
        .required('El apellido del representante es obligatorio')
        .min(2, 'Mínimo 2 caracteres'),
      
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
        .min(2, 'Mínimo 2 caracteres'),
      
      documentType: yup
        .string()
        .required('El tipo de documento es obligatorio')
        .oneOf(Object.values(DocumentType), 'Selecciona un tipo válido'),
      
      documentNumber: yup
        .string()
        .required('El número de documento es obligatorio')
        .min(8, 'Mínimo 8 caracteres'),
    }),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// 🏢 Componente principal
export const CompanyRegisterScreen: React.FC = () => {
  const navigation = useNavigation<CompanyRegisterScreenNavigationProp>();
  const { registerCompany, isLoading, error } = useCompany();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

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
      companyType: CompanyType.PERSONA_JURIDICA,
      documentType: DocumentType.CEDULA,
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
        documentType: DocumentType.CEDULA,
        documentNumber: '',
      },
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
  });

  // 👀 Observar el tipo de empresa seleccionado
  const selectedCompanyType = watch('companyType');

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

  // 🎨 Renderizar selector de tipo de empresa
  const renderCompanyTypeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Tipo de Entidad *</Text>
      <Controller
        control={control}
        name="companyType"
        render={({ field: { onChange, value } }) => (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                value === CompanyType.PERSONA_JURIDICA && styles.optionButtonSelected,
              ]}
              onPress={() => onChange(CompanyType.PERSONA_JURIDICA)}
            >
              <Text style={[
                styles.optionText,
                value === CompanyType.PERSONA_JURIDICA && styles.optionTextSelected,
              ]}>
                👤 Persona Jurídica
              </Text>
              <Text style={styles.optionDescription}>
                Persona individual con actividad comercial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                value === CompanyType.EMPRESA_COMERCIAL && styles.optionButtonSelected,
              ]}
              onPress={() => onChange(CompanyType.EMPRESA_COMERCIAL)}
            >
              <Text style={[
                styles.optionText,
                value === CompanyType.EMPRESA_COMERCIAL && styles.optionTextSelected,
              ]}>
                🏢 Empresa Comercial
              </Text>
              <Text style={styles.optionDescription}>
                Empresa constituida legalmente
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors.companyType && (
        <Text style={styles.errorText}>{errors.companyType.message}</Text>
      )}
    </View>
  );

  // 🎨 Renderizar paso 1: Tipo de entidad y datos básicos
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🏢 Información de la Entidad</Text>
      
      {renderCompanyTypeSelector()}

      {selectedCompanyType === CompanyType.PERSONA_JURIDICA && (
        <>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Nombres *"
                placeholder="Ingresa tus nombres"
                value={value || ''}
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
                label="Apellidos *"
                placeholder="Ingresa tus apellidos"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                leftIcon={<Text>👤</Text>}
              />
            )}
          />
        </>
      )}

      {selectedCompanyType === CompanyType.EMPRESA_COMERCIAL && (
        <>
          <Controller
            control={control}
            name="businessName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Nombre de la Empresa *"
                placeholder="Ej: Mi Empresa SRL"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessName?.message}
                leftIcon={<Text>🏢</Text>}
              />
            )}
          />
          
          <Controller
            control={control}
            name="legalName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Razón Social *"
                placeholder="Nombre legal completo"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.legalName?.message}
                leftIcon={<Text>📋</Text>}
              />
            )}
          />
        </>
      )}

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
        {errors.documentType && (
          <Text style={styles.errorText}>{errors.documentType.message}</Text>
        )}
      </View>

      <Controller
        control={control}
        name="documentNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Número de Documento *"
            placeholder="123456789"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.documentNumber?.message}
            leftIcon={<Text>📄</Text>}
            keyboardType="numeric"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 2: Información de contacto
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📞 Información de Contacto</Text>
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Email *"
            placeholder="empresa@ejemplo.com"
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
            placeholder="+1 (809) 123-4567"
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
        name="website"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Sitio Web (Opcional)"
            placeholder="https://www.empresa.com"
            value={value || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.website?.message}
            leftIcon={<Text>🌐</Text>}
            keyboardType="url"
            autoCapitalize="none"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 3: Fechas importantes
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📅 Fechas Importantes</Text>
      
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
            leftIcon={<Text>📅</Text>}
            helperText="Fecha de registro en el sistema (YYYY-MM-DD)"
          />
        )}
      />
      
      <Controller
        control={control}
        name="companyFoundationDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Fecha de Creación de la Empresa *"
            placeholder="2020-06-10"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.companyFoundationDate?.message}
            leftIcon={<Text>🏗️</Text>}
            helperText="Fecha de constitución de la empresa (YYYY-MM-DD)"
          />
        )}
      />
    </View>
  );

  // 🎨 Renderizar paso 4: Ubicación
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📍 Ubicación del Establecimiento</Text>
      
      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label="Dirección del Establecimiento *"
            placeholder="Calle Principal #123, Sector Centro"
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

  // 🎨 Renderizar paso 5: Representante legal (si es empresa comercial)
  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {selectedCompanyType === CompanyType.EMPRESA_COMERCIAL 
          ? '👤 Representante Legal' 
          : '✅ Confirmación'}
      </Text>
      
      {selectedCompanyType === CompanyType.EMPRESA_COMERCIAL && (
        <>
          <Controller
            control={control}
            name="legalRepresentative.firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Nombre del Representante *"
                placeholder="Juan"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.legalRepresentative?.firstName?.message}
                leftIcon={<Text>👤</Text>}
              />
            )}
          />
          
          <Controller
            control={control}
            name="legalRepresentative.lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Apellido del Representante *"
                placeholder="Pérez"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.legalRepresentative?.lastName?.message}
                leftIcon={<Text>👤</Text>}
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
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.legalRepresentative?.position?.message}
                leftIcon={<Text>💼</Text>}
              />
            )}
          />
        </>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>📋 Resumen del Registro</Text>
        <Text style={styles.summaryText}>
          Revisa toda la información antes de enviar el registro.
        </Text>
        <Text style={styles.summaryNote}>
          💡 Certificado de registro mercantil es opcional y puede ser agregado posteriormente.
        </Text>
      </View>
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
      case 5:
        return renderStep5();
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
                Completa la información para registrar tu entidad
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
  selectorContainer: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  optionTextSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  pickerTextSelected: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: `${COLORS.primary}10`,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  summaryNote: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
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
  backButtonIcon: {
    fontSize: 18,
    color: COLORS.primary,
    marginRight: 4,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
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
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1,
  },
});

export default CompanyRegisterScreen;