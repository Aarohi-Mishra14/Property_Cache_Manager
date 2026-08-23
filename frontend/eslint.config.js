import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                console: 'readonly',
                document: 'readonly',
                window: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                AbortController: 'readonly',
                URLSearchParams: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
];