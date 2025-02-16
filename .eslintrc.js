module.exports = {
  extends: [
    "next", 
    "plugin:prettier/recommended", // Add Prettier's recommended configuration
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "on", // Disable unused variable warnings
  },
};
