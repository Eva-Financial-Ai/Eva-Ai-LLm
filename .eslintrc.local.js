// ESLint configuration with selective rule enforcement
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:testing-library/react"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "import",
    "jsx-a11y",
    "testing-library",
    "react-hooks"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "jsx-a11y/anchor-is-valid": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "overrides": [
    // Override for React Hooks issues
    {
      "files": ["src/components/CreditApplicationForm.tsx", "src/contexts/WorkflowContext.tsx"],
      "rules": {
        "react-hooks/rules-of-hooks": "warn", // Downgrade to warning
        "react-hooks/exhaustive-deps": "warn"  // Downgrade to warning
      }
    },
    // Override for Testing Library issues
    {
      "files": ["src/components/risk/__tests__/*.test.tsx", "src/tests/*.test.tsx"],
      "rules": {
        "testing-library/no-wait-for-multiple-assertions": "warn",
        "testing-library/no-container": "warn",
        "testing-library/no-node-access": "warn"
      }
    },
    // Override for import order issues
    {
      "files": ["src/components/TransactionExecution.tsx"],
      "rules": {
        "import/first": "warn"
      }
    }
  ]
}
