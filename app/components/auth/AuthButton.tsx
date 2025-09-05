// 🔘 Componente AuthButton - Botón especializado para autenticación

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface AuthButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  fullWidth?: boolean;
  style?: object;
  textStyle?: object;
}

// 🎨 Componente AuthButton
const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  loadingText,
  fullWidth = true,
  style,
  textStyle,
  onPress,
  ...touchableProps
}) => {
  // 🎭 Animación de escala para feedback táctil
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // 🎯 Manejar press in (cuando se toca)
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // 🎯 Manejar press out (cuando se suelta)
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // 🎨 Obtener estilos según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
        };
      case 'ghost':
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText,
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
    }
  };

  // 🎨 Obtener estilos según tamaño
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
        };
      case 'medium':
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
        };
    }
  };

  // 🎨 Estilos dinámicos
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const disabled = isDisabled || isLoading;

  // 🎨 Estilo del contenedor
  const containerStyle = [
    styles.baseContainer,
    variantStyles.container,
    sizeStyles.container,
    fullWidth && styles.fullWidth,
    disabled && styles.disabledContainer,
    style,
  ];

  // 🎨 Estilo del texto
  const textStyleCombined = [
    styles.baseText,
    variantStyles.text,
    sizeStyles.text,
    disabled && styles.disabledText,
    textStyle,
  ];

  // 🎯 Manejar press
  const handlePress = (event: any) => {
    if (!disabled && onPress) {
      onPress(event);
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
      }}
    >
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        {...touchableProps}
      >
        {/* 🎨 Contenido del botón */}
        <View style={styles.contentContainer}>
          {/* 🎨 Icono izquierdo */}
          {leftIcon && !isLoading && (
            <View style={styles.leftIconContainer}>
              {leftIcon}
            </View>
          )}

          {/* ⏳ Indicador de carga */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size={size === 'small' ? 'small' : 'small'}
                color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : COLORS.primary}
              />
            </View>
          )}

          {/* 📝 Texto del botón */}
          <Text style={textStyleCombined}>
            {isLoading && loadingText ? loadingText : title}
          </Text>

          {/* 🎨 Icono derecho */}
          {rightIcon && !isLoading && (
            <View style={styles.rightIconContainer}>
              {rightIcon}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  // Estilos base
  baseContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },

  // Variantes de color
  primaryContainer: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: COLORS.secondary,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: COLORS.primary,
  },
  dangerContainer: {
    backgroundColor: COLORS.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },

  // Tamaños
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  smallText: {
    fontSize: 14,
  },
  mediumContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  mediumText: {
    fontSize: 16,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  largeText: {
    fontSize: 18,
  },

  // Estados deshabilitado
  disabledContainer: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    opacity: 0.7,
  },

  // Iconos
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  loadingContainer: {
    marginRight: 8,
  },
});

AuthButton.displayName = 'AuthButton';

export default AuthButton;