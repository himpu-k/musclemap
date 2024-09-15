// eslint.config.js
import eslintPluginNode from 'eslint-plugin-node'

export default [
  {
    ignores: ['node_modules/**'], // Ignore node_modules and other unwanted directories
  },
  {
    files: ['**/*.js'], // Lint all JavaScript files
    languageOptions: {
      ecmaVersion: 2021, // Use ECMAScript 2021 features
      sourceType: 'module', // Enable ES modules
      globals: { // Define environment globals
        require: 'readonly', // Node.js global variable
        process: 'readonly', // Node.js global variable
        module: 'readonly', // Node.js global variable
        __dirname: 'readonly', // Node.js global variable
      },
    },
    plugins: {
      node: eslintPluginNode  // Use ES module import for the plugin
    },
    rules: {
      'indent': ['error', 2],  // Enforce 2-space indentation
      'linebreak-style': 'off',  // Enforce Unix line endings
      'quotes': ['error', 'single'],  // Enforce single quotes
      'semi': ['error', 'never'],  // Disallow semicolons
      'eqeqeq': 'error',  // Require strict equality
      'no-trailing-spaces': 'error',  // Disallow trailing spaces
      'object-curly-spacing': ['error', 'always'],  // Require spaces inside curly braces
      'arrow-spacing': ['error', { 'before': true, 'after': true }],  // Enforce spacing around arrow functions
      'no-console': 'off',  // Allow console.log (useful for development)

      // Disable problematic rule
      'node/no-unsupported-features/es-syntax': 'off',  // Turn off the rule causing issues
    },
  },
]
