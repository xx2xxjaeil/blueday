module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    camelcase: 'off',
    'consistent-return': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-default': 'off',
    'import/no-unresolved': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-await-in-loop': 'off',
    'no-bitwise': 'off',
    'no-else-return': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-exports': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*']
      }
    ],
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'one-var': 'off',
    'prefer-template': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-prop-types': 'warn',
    'func-style': ['error', 'expression'],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ]
  }
};
