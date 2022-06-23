module.exports = {
  extends: ['react-app'],
  settings: {
    react: {
      version: '999.999.999',
    },
  },
  overrides: [
    {
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
};
