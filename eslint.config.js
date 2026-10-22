import solid from 'eslint-plugin-solid/configs/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['docker/**', '.output/**', '.vinxi/**', '.nitro/**']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [solid, tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
]);
