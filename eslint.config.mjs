import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import storybookPlugin from 'eslint-plugin-storybook';

export default [
  {
    ignores: [
      '**/node_modules',
      '**/**.config.js',
      '**/**.config.mjs',
      '**/jest.config.ts',
      '**/**.spec.ts',
      '**/**.spec.tsx',
      '**/dist',
      '**/storybook-static',
      '**/coverage',
      '**/*.generated.ts',
      '**/.cursor',
      'setupTests.ts',
    ],
  },

  js.configs.recommended,

  {
    files: ['tools/**/*.mjs', 'fixtures/**/*.{mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.*?.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: 'readonly',
      },
    },

    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': tsPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      tailwindcss: tailwindPlugin,
      storybook: storybookPlugin,
    },

    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...tailwindPlugin.configs.recommended.rules,
      ...storybookPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'error',
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
      'import/named': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/enforces-shorthand': 'error',

      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-empty': 'error',

      'no-constant-condition': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^__',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
];
