import jwt from 'jsonwebtoken';
import messages from '../utils/messages';

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  if (req.userData.isAdmin !== true) {
    return res.status(401).json({
      status: 401,
      error: messages.noAminRights,
    });
  }
  next();
};
