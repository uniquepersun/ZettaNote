import js from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  { ignores: ['node_modules', 'dist', 'scripts', '.env', 'logs'] },
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // Code Quality Rules
      'no-console': 'error', // Force use of logger instead of console
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',

      // JSDoc Rules - Enforce documentation (warnings to allow gradual improvement)
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: false,
            ClassDeclaration: true,
            ArrowFunctionExpression: false, // Too strict for inline functions
          },
          contexts: [
            'ExportNamedDeclaration > FunctionDeclaration',
            'ExportDefaultDeclaration > FunctionDeclaration',
          ],
        },
      ],
      'jsdoc/require-description': 'off', // Optional - description in comment is enough
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'off', // Optional - param name should be self-documenting
      'jsdoc/require-returns': [
        'warn',
        {
          forceReturnsWithAsync: false,
          forceRequireReturn: false, // Don't require @returns for void functions
        },
      ],
      'jsdoc/require-returns-description': 'off', // Optional
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'warn',
      'jsdoc/valid-types': 'warn',
      'jsdoc/no-undefined-types': 'off', // Too strict - allows custom types
    },
  },
];
