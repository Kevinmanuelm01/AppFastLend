// 🔐 Componente BiometricButton - Botones de autenticación biométrica

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface BiometricButtonProps {
  type: 'fingerprint' | 'faceid';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// 🎨 Componente BiometricButton
const BiometricButton: React.FC<BiometricButtonProps> = ({
  type,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  // 🎯 Obtener icono y texto según el tipo
  const getBiometricData = () => {
    switch (type) {
      case 'fingerprint':
        return {
          icon: '👆',
          text: 'Huella',
        };
      case 'faceid':
        return {
          icon: '📱',
          text: 'Face ID',
        };
      default:
        return {
          icon: '🔐',
          text: 'Biométrico',
        };
    }
  };

  const { icon, text } = getBiometricData();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.icon, textStyle]}>{icon}</Text>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.6,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
});

BiometricButton.displayName = 'BiometricButton';

export default BiometricButton;
