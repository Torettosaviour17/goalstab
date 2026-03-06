const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Try Authorization header (Bearer token)
  let token = req.header("Authorization");
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remove "Bearer " prefix
  }
  // Fallback to custom x-auth-token header
  if (!token) {
    token = req.header("x-auth-token");
  }
  // Also check query parameter (for SSE)
  if (!token && req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
