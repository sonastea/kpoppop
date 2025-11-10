// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/backup/**',
      '**/old/**',
      '**/.next/**',
      '**/coverage/**',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        ...globals.es2021,
      },
    },
    rules: {
      'max-len': ['warn', { code: 100 }],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
