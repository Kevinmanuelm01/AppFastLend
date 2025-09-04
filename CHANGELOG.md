# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.0.0] - 2024-12-19

### 🚀 Actualización Mayor - Versiones Estables Más Recientes

### Agregado
- **Path mapping** completo configurado en TypeScript, Metro y Babel
- **React Native Reanimated 3.18.0** para animaciones de alto rendimiento
- Nuevos scripts de desarrollo y build optimizados:
  - `yarn start:reset` - Metro con cache limpio
  - `yarn test:watch` - Tests en modo watch
  - `yarn test:coverage` - Tests con coverage
  - `yarn build:android` - Build de producción Android
  - `yarn clean` - Limpieza completa del proyecto
  - `yarn type-check` - Verificación de tipos TypeScript
- **Jest setup** mejorado con mocks preconfigurados
- **ESLint config** modernizado con Airbnb style guide
- Configuración de **Husky** para pre-commit hooks

### Actualizado
#### Dependencias Principales
- **React Native**: `0.75.4` → `0.81.1`
- **React Navigation**: `6.1.18` → `7.1.17`
- **React Navigation Stack**: `6.11.0` → `7.3.26`
- **TanStack Query**: `5.59.0` → `5.86.0`
- **TypeScript**: `5.0.4` → `5.9.2`
- **React Native Screens**: `3.35.0` → `4.16.0`
- **React Native Safe Area Context**: `4.14.0` → `5.6.1`
- **React Native MMKV**: `3.0.2` → `3.3.1`
- **React Native Unistyles**: `2.10.0` → `3.0.10`

#### Dependencias de Desarrollo
- **Babel Core**: `7.20.0` → `7.28.3`
- **ESLint**: `8.19.0` → `9.34.0`
- **Jest**: `29.6.3` → `30.1.3`
- **Prettier**: `2.8.8` → `3.6.2`
- **React Native Babel Preset**: `0.75.4` → `0.81.1`
- **React Native ESLint Config**: `0.75.4` → `0.81.1`
- **React Native Metro Config**: `0.75.4` → `0.81.1`
- **React Native TypeScript Config**: `0.75.4` → `0.81.1`
- **TanStack ESLint Plugin**: `5.59.1` → `5.86.0`

#### Configuraciones Android
- **Build Tools**: `34.0.0` → `35.0.0`
- **Compile SDK**: `34` → `35`
- **Target SDK**: `34` → `35`
- **Min SDK**: `23` → `24`
- **NDK**: `26.1.10909125` → `27.0.12077973`
- **Kotlin**: `1.9.24` → `2.1.0`

### Mejorado
- **TypeScript configuration** con paths mapping y configuración más estricta
- **Metro configuration** con alias para imports absolutos
- **Babel configuration** con module resolver para path mapping
- **Jest configuration** con mejores transformIgnorePatterns
- **Package.json scripts** más completos y útiles para desarrollo
- **README.md** completamente reescrito con información detallada
- Estructura de proyecto más organizada y escalable

### Compatibilidad
- **Node.js**: >= 18 → >= 20 (actualizado para mejor rendimiento y características modernas)
- **Yarn**: 3.6.4 (sin cambios)
- Totalmente compatible con las últimas herramientas de desarrollo de React Native

### Notas de Migración
Para proyectos existentes que usen versiones anteriores:

1. Actualizar dependencias con `yarn install`
2. Ejecutar `cd ios && pod install` para iOS
3. Limpiar builds anteriores con `yarn clean`
4. Verificar que el código compile con `yarn type-check`
5. Ejecutar tests con `yarn test`

---

## [0.0.6] - Versión Anterior
- Configuración inicial con React Native 0.75.4
- Configuración básica de TypeScript
- React Navigation 6
- TanStack Query 5.59
- Configuración básica de ESLint y Prettier
