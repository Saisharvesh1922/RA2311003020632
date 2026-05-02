require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

module.exports = {
  PORT: process.env.PORT || 3000,
  BEARER_TOKEN: process.env.BEARER_TOKEN,
};
