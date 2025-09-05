// 🃏 Componente AuthCard - Contenedor principal para pantallas de autenticación

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';

// 🎯 Tipos del componente
interface AuthCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  showShadow?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

// 🎨 Componente AuthCard
const AuthCard: React.FC<AuthCardProps> = ({
  children,
  style,
  contentStyle,
  scrollable = true,
  keyboardAvoiding = true,
  showShadow = true,
  padding = 'large',
}) => {
  // 🎨 Obtener estilos de padding
  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone;
      case 'small':
        return styles.paddingSmall;
      case 'medium':
        return styles.paddingMedium;
      case 'large':
        return styles.paddingLarge;
      default:
        return styles.paddingLarge;
    }
  };

  // 🎨 Estilos del contenedor
  const containerStyle = [
    styles.container,
    showShadow && styles.shadow,
    getPaddingStyles(),
    style,
  ];

  // 🎨 Contenido base
  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  // 🎨 Contenido con scroll si es necesario
  const scrollableContent = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  // 🎨 Contenido con KeyboardAvoidingView si es necesario
  const finalContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {scrollableContent}
    </KeyboardAvoidingView>
  ) : (
    scrollableContent
  );

  return (
    <View style={containerStyle}>
      {finalContent}
    </View>
  );
};

// 🎨 Estilos del componente
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  // Variantes de padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 16,
  },
  paddingMedium: {
    padding: 24,
  },
  paddingLarge: {
    padding: 32,
  },
});

AuthCard.displayName = 'AuthCard';

export default AuthCard;