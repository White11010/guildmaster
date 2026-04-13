import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['*.d.ts', '**/coverage', '**/dist']),

  {
    files: ['**/*.{ts,vue}'],

    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.strictTypeChecked,
      ...typescriptEslint.configs.stylisticTypeChecked,
      ...eslintPluginVue.configs['flat/recommended'],
      prettier // 🔥 отключает конфликтующие правила
    ],

    plugins: {
      prettier: prettierPlugin
    },

    languageOptions: {
      parser: vueParser, // 🔥 ВАЖНО: основной parser для .vue

      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,

      parserOptions: {
        parser: typescriptEslint.parser, // 🔥 TS внутри Vue
        extraFileExtensions: ['.vue'],   // 🔥 фикс ошибки
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },

    rules: {
      'prettier/prettier': 'error',
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-unused-vars': 'off',

      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
          allowSeparatedGroups: true
        }
      ],

      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off'
    }
  },
  {
    files: ['**/*.d.ts'],

    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]);