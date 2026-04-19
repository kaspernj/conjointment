const {FlatCompat} = require("@eslint/eslintrc")

const compat = new FlatCompat({
  baseDirectory: __dirname
})

module.exports = [
  {
    ignores: ["build/**"]
  },
  ...compat.config({
    extends: ["universe/native", "universe/web"],
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
      "node/handle-callback-err": "off",
      "react-hooks/rules-of-hooks": "off"
    }
  })
]
