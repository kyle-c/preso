import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '.agents/**',
      '.claude/**',
      '.next/**',
      'node_modules/**',
      'notion-preso/**',
      'figma-plugin/**',
      'uxguidelines/**',
      'designsystem/**',
      'scripts/**',
      'tests/**',
      '*.zip',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-console': 'off',
      'no-dupe-else-if': 'off',
      'no-empty': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]
