const { defineConfig } = require("@optum/i18n");

module.exports = defineConfig({
  entry: "locales/en_US.json",
  entryLocale: "en_US",
  output: "locales",
  outputLocales: ["zh_CN", "ja_JP", "es_ES"],
});
