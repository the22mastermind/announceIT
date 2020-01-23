/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import messages from '../utils/messages';

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userData = decoded;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        error: messages.noToken,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: `Authentication failed. ${error.name} ${error.message}`,
    });
  }
};
