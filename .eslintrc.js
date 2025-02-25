import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.all,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'packages/**/dist/**',
      'packages/grabber/out.js',
      'uikit/platform-components/state.js'
    ],
    rules: {
      'sort-keys': 'off',
      'sort-imports': 'off',
      'func-style': 'off',
      'one-var': 'off',
      'no-invalid-this': 'off',
      'no-unused-vars': ['error', { args: 'after-used' }],
      'consistent-return': 'off',
      'id-length': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      camelcase: ['error', { properties: 'never' }],
      'max-statements': 'off',
      'max-lines': 'off',
      'max-params': 'off',
      'max-lines-per-function': 'off',
      'capitalized-comments': 'off',
      'no-warning-comments': 'off',
      'no-underscore-dangle': 'off',
      'no-alert': 'off',
      'no-nested-ternary': 'off',
      'no-console': 'off',
      'no-inline-comments': 'off',
      'no-plusplus': 'off',
      'no-eq-null': 'off',
      complexity: 'off',
      'class-methods-use-this': 'off',
      eqeqeq: ['error', 'smart']
    }
  }
]
