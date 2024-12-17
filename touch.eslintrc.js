module.exports = {
    extends: ['next'],
    parserOptions: {
      babelOptions: {
        presets: [require.resolve('next/babel')],
      },
    },
    ignorePatterns: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']
  }