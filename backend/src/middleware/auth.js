const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header('x-auth-token');

  // Allow token via query (for SSE)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure structure exists
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};