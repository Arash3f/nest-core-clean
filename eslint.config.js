// eslint.config.cjs
const { resolve } = require("path")
const tseslint = require("typescript-eslint")
const simpleImportSort = require("eslint-plugin-simple-import-sort")
const prettierPlugin = require("eslint-plugin-prettier")
const prettierConfig = require("eslint-config-prettier")

module.exports = tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "documentation",
      "coverage",
      "*.config.js",
      "*.config.cjs",
      "**/*.spec.ts",
      "**/*.test.ts",
      "tests/utils/graphql/**",
      "swagger/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          resolve(process.cwd(), "./tsconfig.json"),
          resolve(process.cwd(), "./tsconfig.spec.json"),
        ],
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["camelCase", "UPPER_CASE", "PascalCase"] },
        { selector: "function", format: ["camelCase"] },
        { selector: "class", format: ["PascalCase"] },
      ],
      "prettier/prettier": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
)
