const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";

function signAuthToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateResetToken() {
  return [...Array(32)]
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join("");
}

module.exports = { signAuthToken, verifyAuthToken, generateResetToken };
