const js = require('@eslint/js')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const globals = require('globals')
const reactRefresh = require('eslint-plugin-react-refresh')
const babelParser = require('@babel/eslint-parser')

module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser, // Use Babel ESLint parser here
      parserOptions: {
        requireConfigFile: false, // No need for a Babel config file
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
        babelOptions: {
          plugins: ['@babel/plugin-syntax-jsx'], // Ensure Babel plugin for JSX is enabled
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    ignores: ['**/dist/**', '.eslintrc.cjs', '**/node_modules/**', 'vite.config.js'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      indent: ['error', 2],
      'linebreak-style': ['error', 'windows'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'no-unused-vars': 0,

      // React-specific rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,

       'no-multiple-empty-lines': [
        'error', 
        { 
          max: 1,   // Maximum 1 empty line allowed between code
          maxEOF: 0, // No empty lines at the end of files
          maxBOF: 0, // No empty lines at the beginning of files
        }
      ]
    },
  },
]
