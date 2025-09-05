// 🎨 Componente ModernCard - Tarjeta con diseño moderno global

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '../../constants';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  style,
  variant = 'default',
  shadow = 'md',
  padding = 'lg',
  radius = 'lg',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: COLORS.surface,
          ...SHADOWS.lg,
        };
      case 'outlined':
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
          ...SHADOWS.sm,
        };
      case 'filled':
        return {
          backgroundColor: COLORS.backgroundSecondary,
          ...SHADOWS.sm,
        };
      default:
        return {
          backgroundColor: COLORS.surface,
          ...SHADOWS[shadow],
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: SPACING.sm };
      case 'md':
        return { padding: SPACING.md };
      case 'lg':
        return { padding: SPACING.lg };
      case 'xl':
        return { padding: SPACING.xl };
      default:
        return { padding: SPACING.lg };
    }
  };

  const getRadiusStyles = () => {
    return { borderRadius: BORDER_RADIUS[radius] };
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        getPaddingStyles(),
        getRadiusStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default ModernCard;