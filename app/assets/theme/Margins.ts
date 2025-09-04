/**
 * Estilos de spacing (margins y paddings) globales
 * Basados en las métricas del sistema de diseño
 */

import { StyleSheet } from 'react-native';
import { METRICS, SPACING } from './Metrics';

// Estilos de padding
export const PADDING_STYLES = StyleSheet.create({
  // Padding uniforme
  pXs: { padding: SPACING.xs },
  pSm: { padding: SPACING.sm },
  pMd: { padding: SPACING.md },
  pLg: { padding: SPACING.lg },
  pXl: { padding: SPACING.xl },
  pXxl: { padding: SPACING.xxl },
  
  // Padding específico
  p0: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
  
  // Padding vertical
  pVerticalXs: { paddingVertical: SPACING.xs },
  pVerticalSm: { paddingVertical: SPACING.sm },
  pVerticalMd: { paddingVertical: SPACING.md },
  pVerticalLg: { paddingVertical: SPACING.lg },
  pVerticalXl: { paddingVertical: SPACING.xl },
  
  // Padding horizontal
  pHorizontalXs: { paddingHorizontal: SPACING.xs },
  pHorizontalSm: { paddingHorizontal: SPACING.sm },
  pHorizontalMd: { paddingHorizontal: SPACING.md },
  pHorizontalLg: { paddingHorizontal: SPACING.lg },
  pHorizontalXl: { paddingHorizontal: SPACING.xl },
  
  // Padding direccional
  pTopXs: { paddingTop: SPACING.xs },
  pTopSm: { paddingTop: SPACING.sm },
  pTopMd: { paddingTop: SPACING.md },
  pTopLg: { paddingTop: SPACING.lg },
  pTopXl: { paddingTop: SPACING.xl },
  pTopXxl: { paddingTop: SPACING.xxl },
  
  pBottomXs: { paddingBottom: SPACING.xs },
  pBottomSm: { paddingBottom: SPACING.sm },
  pBottomMd: { paddingBottom: SPACING.md },
  pBottomLg: { paddingBottom: SPACING.lg },
  pBottomXl: { paddingBottom: SPACING.xl },
  
  pLeftXs: { paddingLeft: SPACING.xs },
  pLeftSm: { paddingLeft: SPACING.sm },
  pLeftMd: { paddingLeft: SPACING.md },
  pLeftLg: { paddingLeft: SPACING.lg },
  pLeftXl: { paddingLeft: SPACING.xl },
  pLeftXxl: { paddingLeft: SPACING.xxl },
  
  pRightXs: { paddingRight: SPACING.xs },
  pRightSm: { paddingRight: SPACING.sm },
  pRightMd: { paddingRight: SPACING.md },
  pRightLg: { paddingRight: SPACING.lg },
  pRightXl: { paddingRight: SPACING.xl },
  pRight0: { paddingRight: 0 },
});

// Estilos de margin
export const MARGIN_STYLES = StyleSheet.create({
  // Margin uniforme
  mXs: { margin: SPACING.xs },
  mSm: { margin: SPACING.sm },
  mMd: { margin: SPACING.md },
  mLg: { margin: SPACING.lg },
  mXl: { margin: SPACING.xl },
  mXxl: { margin: SPACING.xxl },
  
  // Margin cero
  m0: {
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0,
  },
  
  // Margin vertical
  mVerticalXs: { marginVertical: SPACING.xs },
  mVerticalSm: { marginVertical: SPACING.sm },
  mVerticalMd: { marginVertical: SPACING.md },
  mVerticalLg: { marginVertical: SPACING.lg },
  mVerticalXl: { marginVertical: SPACING.xl },
  
  // Margin horizontal
  mHorizontalXs: { marginHorizontal: SPACING.xs },
  mHorizontalSm: { marginHorizontal: SPACING.sm },
  mHorizontalMd: { marginHorizontal: SPACING.md },
  mHorizontalLg: { marginHorizontal: SPACING.lg },
  mHorizontalXl: { marginHorizontal: SPACING.xl },
  lateralMargin: { marginHorizontal: SPACING.lg }, // Legacy
  
  // Margin direccional
  mTopXs: { marginTop: SPACING.xs },
  mTopSm: { marginTop: SPACING.sm },
  mTopMd: { marginTop: SPACING.md },
  mTopLg: { marginTop: SPACING.lg },
  mTopXl: { marginTop: SPACING.xl },
  
  mBottomXs: { marginBottom: SPACING.xs },
  mBottomSm: { marginBottom: SPACING.sm },
  mBottomMd: { marginBottom: SPACING.md },
  mBottomLg: { marginBottom: SPACING.lg },
  mBottomXl: { marginBottom: SPACING.xl },
  mBottomXxl: { marginBottom: SPACING.xxl },
  
  mLeftXs: { marginLeft: SPACING.xs },
  mLeftSm: { marginLeft: SPACING.sm },
  mLeftMd: { marginLeft: SPACING.md },
  mLeftLg: { marginLeft: SPACING.lg },
  mLeftXl: { marginLeft: SPACING.xl },
  mLeft0: { marginLeft: 0 },
  
  mRightXs: { marginRight: SPACING.xs },
  mRightSm: { marginRight: SPACING.sm },
  mRightMd: { marginRight: SPACING.md },
  mRightLg: { marginRight: SPACING.lg },
  mRightXl: { marginRight: SPACING.xl },
  mRightXxl: { marginRight: SPACING.xxl },
});

// Estilos legacy para compatibilidad
const LegacyStyles = StyleSheet.create({
  small: { margin: METRICS.small },
  medium: { margin: METRICS.medium },
  large: { margin: METRICS.large },
  xLarge: { margin: METRICS.xLarge },
});

// Export por defecto (combina padding y margin)
export default {
  ...PADDING_STYLES,
  ...MARGIN_STYLES,
  ...LegacyStyles,
};
