import jwt from 'jsonwebtoken';
import messages from '../utils/messages';
import codes from '../utils/codes';
import utils from '../utils/utils';

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  if (req.userData.isAdmin !== true) {
    return utils.returnError(res, codes.statusCodes.unauthorized, messages.noAminRights);
  }
  next();
};
