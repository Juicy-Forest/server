const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                global: "readonly"
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            ...prettier.rules,
            "no-console": "warn",
            "no-unused-vars": "warn",
            "prefer-const": "error",
            eqeqeq: "error",
            "no-var": "error",
            semi: ["error", "always"],
            indent: ["error", 4],
            "comma-dangle": ["error", "never"],
            "no-trailing-spaces": "error"
        },
        plugins: {
            prettier: prettierPlugin
        }
    },
    {
        ignores: ["node_modules/**", "dist/**", "build/**", ".git/**"]
    }
];
