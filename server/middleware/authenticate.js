/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userData = decoded;
      next();
    } else {
      return utils.returnError(res, codes.statusCodes.unauthorized, messages.noToken);
    }
  } catch (error) {
    const errorMessage = `Authentication failed. ${error.name} ${error.message}`;
    return utils.returnError(res, codes.statusCodes.badRequest, errorMessage);
  }
};
