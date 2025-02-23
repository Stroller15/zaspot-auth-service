// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        ignores: ["node_modules", "dist", "eslint.config.mjs"],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            // 'no-console': 'error',
            "dot-notation": "error",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-unused-vars": "off",
            // "no-unused-vars": "error",
        },
    },
);
