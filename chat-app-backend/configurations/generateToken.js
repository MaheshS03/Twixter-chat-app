const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN} = require('../configurations/config')

const generateToken = (id) => {
  return jwt.sign({ id }, ACCESS_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
