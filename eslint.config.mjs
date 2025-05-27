// eslint.config.mjs
import globals from "globals";
import js from "@eslint/js";
import tseslint from 'typescript-eslint'; // Assuming typescript-eslint is installed as per previous interactions

export default tseslint.config(
  {
    // Global ignores
    ignores: ["node_modules/", "dist/", "coverage/", "public/"],
  },
  // Base recommended ESLint rules
  js.configs.recommended,

  // Configuration block to provide type information for type-aware rules.
  // This should apply to all files that will be linted by rules from recommendedTypeChecked.
  {
    files: ["**/*.js", "**/*.mjs"], // Include .mjs files here
    languageOptions: {
      parser: tseslint.parser, // Explicitly set the parser
      parserOptions: {
        project: true, // This tells ESLint to look for tsconfig.json
        tsconfigRootDir: import.meta.dirname, // Sets the root for tsconfig.json discovery
      },
    },
  },

  // Now, spread the recommendedTypeChecked configurations.
  // These will use the parserOptions established in the block above for matching files.
  ...tseslint.configs.recommendedTypeChecked,

  // General configuration for all JavaScript files in the project
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022, // Or your project's target ECMAScript version
      sourceType: "commonjs", // Set CommonJS as the module system for .js files
      globals: {
        ...globals.node, // Add Node.js global variables (process, console, Buffer, __dirname, etc.)
        // Add any other project-wide custom globals if necessary
      },
      // parserOptions are inherited from the block above for these JS files
    },
    rules: {
      // Disable rules that conflict with CommonJS or are too strict for JS files
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      // Type-aware rules like await-thenable will now work.
      // Adjust strictness of other type-aware rules for JS if needed:
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",

      // Rule for async promise executors
      "no-async-promise-executor": "warn", // Consider "error" for stricter enforcement

      // You can add or override other rules here
      // 'no-console': 'warn',
    }
  },

  // Configuration specifically for test files
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js", "**/*.simple.test.js", "e2e/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Add Jest global variables (describe, test, expect, jest, beforeEach, etc.)
      }
    },
    rules: {
      // You might want to relax some rules in test files, e.g.
      // "@typescript-eslint/no-unsafe-assignment": "off",
      // "@typescript-eslint/no-explicit-any": "off",
    }
  },

  // If you have actual TypeScript files (.ts), you would have a block for them
  // where `sourceType` is "module" and TypeScript-specific rules are enforced.
  // {
  //   files: ["**/*.ts"],
  //   languageOptions: {
  //     sourceType: "module",
  //     parserOptions: { // Ensure this is set for TS files if using type-aware linting
  //       project: true,
  //       tsconfigRootDir: import.meta.dirname,
  //     },
  //   },
  //   rules: { /* TypeScript specific rules */ }
  // }
);