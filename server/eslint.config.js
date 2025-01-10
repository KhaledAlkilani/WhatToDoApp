import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,js}"], // Server-specific files
    languageOptions: {
      ecmaVersion: 2020,
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
