import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { ButtonProps } from '../../../types';
import { COLORS, TYPOGRAPHY_STYLES, SPACING } from '../../../constants';

interface CustomButtonProps extends ButtonProps {
  style?: any;
  textStyle?: any;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: CustomButtonProps) {
  const getButtonStyle = () => {
    const baseStyles = {
      ...styles.button,
      ...(variant === 'primary' ? styles.buttonPrimary : {}),
      ...(variant === 'secondary' ? styles.buttonSecondary : {}),
      ...(variant === 'outline' ? styles.buttonOutline : {}),
      ...(size === 'small' ? styles.buttonSmall : {}),
      ...(size === 'large' ? styles.buttonLarge : {}),
      ...(disabled || loading ? styles.disabled : {}),
      ...style,
    };

    return baseStyles;
  };

  const getTextStyle = () => {
    const baseStyles = {
      ...styles.buttonText,
      ...(variant === 'primary' ? styles.buttonTextPrimary : {}),
      ...(variant === 'secondary' ? styles.buttonTextSecondary : {}),
      ...(variant === 'outline' ? styles.buttonTextOutline : {}),
      ...(size === 'small' ? styles.textSmall : {}),
      ...(size === 'large' ? styles.textLarge : {}),
      ...textStyle,
    };

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : '#3b82f6'}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    ...TYPOGRAPHY_STYLES.button,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonSmall: {
    height: 36,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  buttonLarge: {
    height: 56,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  disabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  buttonText: {
    ...TYPOGRAPHY_STYLES.button,
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
    fontWeight: '600',
  },
});
