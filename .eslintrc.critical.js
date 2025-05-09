// ESLint configuration that only enforces critical rules
module.exports = {
  "extends": ["./.eslintrc.local.js"],
  "rules": {
    // Keep only critical rules as errors, downgrade everything else
    "react-hooks/rules-of-hooks": "error", // Critical: Hook rules must be followed
    "no-unused-vars": "warn",
    "no-undef": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/no-anonymous-default-export": "warn",
    // Downgrade all other warnings
    "react-hooks/exhaustive-deps": "warn",
    "testing-library/no-wait-for-multiple-assertions": "warn",
    "testing-library/no-container": "warn", 
    "testing-library/no-node-access": "warn",
    "import/first": "warn",
    "jsx-a11y/anchor-is-valid": "warn"
  }
}
