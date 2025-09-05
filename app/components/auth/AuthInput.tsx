// 📝 Componente AuthInput - Input especializado para autenticación

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInputProps,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  errorStyle?: object;
  showPasswordToggle?: boolean;
  required?: boolean;
  helperText?: string;
}

export interface AuthInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
}

// 🎨 Componente AuthInput
const AuthInput = forwardRef<AuthInputRef, AuthInputProps>((
  {
    label,
    error,
    leftIcon,
    rightIcon,
    isPassword = false,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    showPasswordToggle = true,
    required = false,
    helperText,
    value,
    onChangeText,
    ...textInputProps
  },
  ref
) => {
  // 🏪 Estados locales
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  
  // 🎭 Animaciones
  const [labelAnimation] = useState(new Animated.Value(value ? 1 : 0));
  const [borderAnimation] = useState(new Animated.Value(0));
  const [errorAnimation] = useState(new Animated.Value(0));

  // 📱 Referencia del input
  const inputRef = React.useRef<TextInput>(null);

  // 🎯 Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => {
      setInputValue('');
      onChangeText?.('');
    },
    getValue: () => inputValue,
  }));

  // 🎨 Animación del label
  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // 🎨 Animación del borde
  const animateBorder = (toValue: number) => {
    Animated.timing(borderAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // 🎨 Animación del error
  const animateError = (toValue: number) => {
    Animated.timing(errorAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // 🎯 Manejar focus
  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(1);
    animateBorder(1);
    textInputProps.onFocus?.({} as any);
  };

  // 🎯 Manejar blur
  const handleBlur = () => {
    setIsFocused(false);
    if (!inputValue) {
      animateLabel(0);
    }
    animateBorder(0);
    textInputProps.onBlur?.({} as any);
  };

  // 🎯 Manejar cambio de texto
  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
    
    if (text && !isFocused) {
      animateLabel(1);
    } else if (!text && !isFocused) {
      animateLabel(0);
    }
  };

  // 🎯 Toggle visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 🎨 Efectos de animación para errores
  React.useEffect(() => {
    if (error) {
      animateError(1);
    } else {
      animateError(0);
    }
  }, [error]);

  // 🎨 Estilos dinámicos
  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -8],
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const errorOpacity = errorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const errorTranslateY = errorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 📝 Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? COLORS.error : borderColor,
            borderWidth: error ? 2 : isFocused ? 2 : 1,
          },
        ]}
      >
        {/* 🔤 Label animado */}
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: error
                ? COLORS.error
                : isFocused
                ? COLORS.primary
                : COLORS.text.secondary,
            },
            labelStyle,
          ]}
        >
          {label}
          {required && (
            <Text style={styles.required}> *</Text>
          )}
        </Animated.Text>

        {/* 🎯 Contenedor del input */}
        <View style={styles.inputWrapper}>
          {/* 🎨 Icono izquierdo */}
          {leftIcon && (
            <View style={styles.leftIconContainer}>
              {leftIcon}
            </View>
          )}

          {/* 📝 Input de texto */}
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              {
                paddingLeft: leftIcon ? 40 : 12,
                paddingRight: (isPassword && showPasswordToggle) || rightIcon ? 40 : 12,
              },
              inputStyle,
            ]}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword && !isPasswordVisible}
            placeholderTextColor={COLORS.text.light}
            selectionColor={COLORS.primary}
            {...textInputProps}
          />

          {/* 👁️ Toggle de contraseña */}
          {isPassword && showPasswordToggle && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
            >
              <Text style={styles.passwordToggle}>
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 🎨 Icono derecho */}
          {rightIcon && !isPassword && (
            <View style={styles.rightIconContainer}>
              {rightIcon}
            </View>
          )}
        </View>
      </Animated.View>

      {/* ❌ Mensaje de error */}
      {error && (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: errorOpacity,
              transform: [{ translateY: errorTranslateY }],
            },
          ]}
        >
          <Text style={[styles.errorText, errorStyle]}>
            ⚠️ {error}
          </Text>
        </Animated.View>
      )}

      {/* 💡 Texto de ayuda */}
      {helperText && !error && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>
            💡 {helperText}
          </Text>
        </View>
      )}
    </View>
  );
});

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: COLORS.background,
    minHeight: 56,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 12,
    backgroundColor: COLORS.background,
    paddingHorizontal: 4,
    fontWeight: '500',
    zIndex: 1,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: 16,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggle: {
    fontSize: 18,
  },
  errorContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
  },
  helperContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;