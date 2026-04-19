const {FlatCompat} = require("@eslint/eslintrc")
const path = require("path")

const compat = new FlatCompat({
  baseDirectory: __dirname
})

module.exports = [
  {
    ignores: ["build/**"]
  },
  ...compat.config(require(path.join(__dirname, ".eslintrc.js")))
]
