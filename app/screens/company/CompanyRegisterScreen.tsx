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
  Animated,
  Dimensions,
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

// 📱 Obtener dimensiones de pantalla
const { width: screenWidth } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  // 🎭 Animación de entrada
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

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
      // Animación de salida y entrada
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  // 🎨 Renderizar indicador de progreso
  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Paso {currentStep} de {totalSteps}
        </Text>
        <Text style={styles.progressPercentage}>
          {Math.round((currentStep / totalSteps) * 100)}%
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      {/* Indicadores de pasos */}
      <View style={styles.stepIndicators}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index + 1 <= currentStep ? styles.stepDotActive : styles.stepDotInactive,
            ]}
          >
            <Text style={[
              styles.stepDotText,
              index + 1 <= currentStep ? styles.stepDotTextActive : styles.stepDotTextInactive,
            ]}>
              {index + 1}
            </Text>
          </View>
        ))}
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
    return (
      <Animated.View
        style={[
          styles.stepContentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {(() => {
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
        })()}
      </Animated.View>
    );
  };

  // 🎨 Renderizar botones de navegación
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={prevStep}
          activeOpacity={0.8}
        >
          <View style={styles.backButtonContent}>
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Anterior</Text>
          </View>
        </TouchableOpacity>
      )}
      
      <View style={styles.spacer} />
      
      {currentStep < totalSteps ? (
        <AuthButton
          title={
            <Text style={styles.nextButtonText}>
              Siguiente →
            </Text>
          }
          onPress={nextStep}
          style={styles.nextButton}
        />
      ) : (
        <AuthButton
          title={isLoading ? "Registrando..." : "Registrar Empresa"}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          style={styles.submitButton}
          leftIcon={!isLoading && <Text style={styles.submitIcon}>✓</Text>}
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
        <View style={styles.modernCard}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Registro de Empresa</Text>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  modernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backIcon: {
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backIconText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '700',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepDotActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  stepDotInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepDotTextActive: {
    color: '#ffffff',
  },
  stepDotTextInactive: {
    color: '#94a3b8',
  },
  stepContentContainer: {
    flex: 1,
  },
  stepContainer: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionButtonSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  optionTextSelected: {
    color: '#3b82f6',
  },
  optionDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  pickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  pickerTextSelected: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#f0f9ff',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 22,
  },
  summaryNote: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 8,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: '#10b981',
  },
  submitIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default CompanyRegisterScreen;