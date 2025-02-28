const jwt = require('jsonwebtoken');
const config = require('../routes/config');

//authentication function
const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }
    const decodedAccessToken = jwt.verify(accessToken, config.accessTokenSecret);
    req.userId = decodedAccessToken.userId;
    req.role = decodedAccessToken.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid access token' });
  }
};
 //authorization function
const authorize = (roles = []) => {
  return async (req, res, next) => {
    try {
      const userRole = req.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { authenticate, authorize };
