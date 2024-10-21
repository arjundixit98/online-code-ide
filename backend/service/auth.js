const jwt = require("jsonwebtoken");
const secret = "Arjun$123@$";

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    secret
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
