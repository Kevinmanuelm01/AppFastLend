const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'app'),
      '@components': path.resolve(__dirname, 'app/components'),
      '@screens': path.resolve(__dirname, 'app/screens'),
      '@hooks': path.resolve(__dirname, 'app/hooks'),
      '@services': path.resolve(__dirname, 'app/services'),
      '@utils': path.resolve(__dirname, 'app/utils'),
      '@assets': path.resolve(__dirname, 'app/assets'),
    },
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  watchFolders: [path.resolve(__dirname, 'app')],
};

module.exports = mergeConfig(defaultConfig, config);