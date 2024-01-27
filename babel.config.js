module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    // 'react-native-reanimated/plugin', // THIS HAS TO BE LISTED LAST
  ],
  env: {
    development: {
      plugins: [],
    },
  },
  plugins: [
    // ['react-native-dotenv'],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.jsx',
          '.android.jsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
