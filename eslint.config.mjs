// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, prettier, {
  files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx', '**/*.mjs'],
  ignores: ['**/backup/*', '**/old/*'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  rules: {
    'max-len': [1, { code: 100 }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
  },
});
