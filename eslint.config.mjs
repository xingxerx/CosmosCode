// eslint.config.mjs
import globals from "globals";
import js from "@eslint/js";

export default [
  {
    // Global ignores
    ignores: ["node_modules/", "dist/", "coverage/", "public/"],
  },
  // Base recommended ESLint rules
  js.configs.recommended,

  // General configuration for all JavaScript files in the project
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Common JavaScript rules
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off", // Changed from warn to off
      "no-async-promise-executor": "warn",
    }
  },

  // Configuration specifically for CommonJS files
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        jest: "readonly",
        expect: "readonly",
        fail: "readonly",
      },
    },
  },

  // Configuration specifically for test files
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js", "**/*.simple.test.js", "e2e/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      }
    },
    rules: {
      // Relax some rules in test files
      "no-console": "off",
      "no-unused-vars": "off", // Relax unused vars in tests
    }
  },
];
