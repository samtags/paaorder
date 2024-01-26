module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.js', '.json', '.png'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
