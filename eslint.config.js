import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['*.d.ts', '**/coverage', '**/dist']),
    {
        extends: [
            eslint.configs.recommended,
            ...typescriptEslint.configs.recommended,
            ...eslintPluginVue.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: typescriptEslint.parser,
            },
        },
        rules: {
            semi: ['error', 'always'],

            'comma-dangle': ['error', 'never'],

            'object-curly-spacing': ['error', 'always'],

            'space-before-function-paren': ['error', 'always'],
        },
    },
]);