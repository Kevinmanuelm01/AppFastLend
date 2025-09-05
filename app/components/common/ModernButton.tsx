// 🔘 Componente ModernButton - Botón con diseño moderno global

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../../constants';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          ...SHADOWS.colored,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          ...SHADOWS.md,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primary,
          ...SHADOWS.sm,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
          ...SHADOWS.md,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          ...SHADOWS.md,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          ...SHADOWS.colored,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          minHeight: 36,
        };
      case 'md':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          minHeight: 44,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          minHeight: 52,
        };
      case 'xl':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          minHeight: 60,
        };
      default:
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          minHeight: 44,
        };
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return { color: COLORS.text.inverse };
      case 'outline':
        return { color: COLORS.primary };
      case 'ghost':
        return { color: COLORS.text.primary };
      default:
        return { color: COLORS.text.inverse };
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: FONT_SIZES.sm };
      case 'md':
        return { fontSize: FONT_SIZES.md };
      case 'lg':
        return { fontSize: FONT_SIZES.lg };
      case 'xl':
        return { fontSize: FONT_SIZES.xl };
      default:
        return { fontSize: FONT_SIZES.md };
    }
  };

  const disabled = isDisabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {leftIcon && !isLoading && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}
        
        {isLoading && (
          <View style={styles.leftIcon}>
            <ActivityIndicator
              size="small"
              color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.text.inverse}
            />
          </View>
        )}
        
        <Text
          style={[
            styles.text,
            getTextVariantStyles(),
            getTextSizeStyles(),
            textStyle,
          ]}
        >
          {title}
        </Text>
        
        {rightIcon && !isLoading && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: FONT_WEIGHTS.semibold,
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: SPACING.xs,
  },
  rightIcon: {
    marginLeft: SPACING.xs,
  },
});

export default ModernButton;