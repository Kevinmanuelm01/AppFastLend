module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './app',
          '@components': './app/components',
          '@screens': './app/screens',
          '@hooks': './app/hooks',
          '@services': './app/services',
          '@utils': './app/utils',
          '@assets': './app/assets',
        },
      },
    ],
  ],
};
