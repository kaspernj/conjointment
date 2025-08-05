module.exports = {
  root: true,
  extends: ["universe/native", "universe/web"],
  ignorePatterns: ["build"],
  rules: {
    "eqeqeq": "off",
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: false,
        objectWrap: "collapse",
        printWidth: 160,
        semi: false,
        trailingComma: "none"
      }
    ],
    "react-hooks/rules-of-hooks": "off"
  }
}
