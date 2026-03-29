require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = ( user ) => {
  return jwt.sign(
    { 
      id: user._id,
      username: user.username,
    }, 
    process.env.TOKEN_KEY, 
    {
      expiresIn: "1d",
    }
  );
};