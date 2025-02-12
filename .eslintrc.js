module.exports = {
  extends: [
    "next", 
    "plugin:prettier/recommended", // Add Prettier's recommended configuration
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Disable unused variable warnings
  },
};
