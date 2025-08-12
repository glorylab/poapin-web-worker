import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // React Router 7 specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow console for debugging in development
      'no-console': 'warn',
    },
  },
  {
    // Server-side files can use console for logging
    files: ['**/entry.server.tsx', '**/entry.server.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Node.js scripts configuration
    files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off', // Allow console in scripts
      'no-undef': 'error',
    },
  },
  {
    // Ignore build outputs and config files
    ignores: [
      'build/**',
      'dist/**',
      'node_modules/**',
      '.wrangler/**',
      '.react-router/**', // Auto-generated React Router types
      'wrangler.toml',
      'wrangler.jsonc',
      'worker-configuration.d.ts', // Auto-generated Cloudflare types
    ],
  }
);
