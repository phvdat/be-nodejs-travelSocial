const jwtHelper = require('../Helper/jwt.helper');

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || 'phamvandat.hcmut@gmail.com';

const isAuth = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      req.jwtDeecoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
  } else {
    return res.status(403).json({ message: 'No token provided.' });
  }
};

module.exports = { isAuth };
