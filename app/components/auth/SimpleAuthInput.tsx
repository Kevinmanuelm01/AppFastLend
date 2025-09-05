// 📝 Componente SimpleAuthInput - Versión optimizada sin animaciones complejas

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface SimpleAuthInputProps extends Omit<TextInputProps, 'style'> {
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

export interface SimpleAuthInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
}

// 🎨 Componente SimpleAuthInput
const SimpleAuthInput = forwardRef<SimpleAuthInputRef, SimpleAuthInputProps>((
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

  // 🎯 Manejar focus
  const handleFocus = () => {
    setIsFocused(true);
    textInputProps.onFocus?.({} as any);
  };

  // 🎯 Manejar blur
  const handleBlur = () => {
    setIsFocused(false);
    textInputProps.onBlur?.({} as any);
  };

  // 🎯 Manejar cambio de texto
  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  // 🎯 Toggle visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 🎨 Sincronizar valor interno con prop externo
  React.useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // 🎨 Determinar si el label debe estar arriba
  const isLabelUp = isFocused || inputValue.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 📝 Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
            borderWidth: error ? 2 : isFocused ? 2 : 1,
          },
        ]}
      >
        {/* 🔤 Label */}
        <Text
          style={[
            styles.label,
            {
              top: isLabelUp ? -8 : 18,
              fontSize: isLabelUp ? 12 : 16,
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
        </Text>

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
      </View>

      {/* ❌ Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, errorStyle]}>
            ⚠️ {error}
          </Text>
        </View>
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

SimpleAuthInput.displayName = 'SimpleAuthInput';

export default SimpleAuthInput;
