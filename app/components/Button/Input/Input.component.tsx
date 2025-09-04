import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import type { InputProps } from '../../../types';
import { COLORS, TYPOGRAPHY_STYLES, SPACING } from '../../../constants';

interface CustomInputProps extends InputProps {
  style?: any;
  containerStyle?: any;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  containerStyle,
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getInputStyle = () => {
    const baseStyles = {
      ...styles.input,
      ...(isFocused ? styles.inputFocused : {}),
      ...(error ? styles.inputError : {}),
      ...style,
    };

    return baseStyles;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY_STYLES.subtitle2,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...TYPOGRAPHY_STYLES.input,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  eyeText: {
    fontSize: 16,
  },
  errorText: {
    ...TYPOGRAPHY_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});