import validation from './validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';

exports.checkUserId = (req, res, next) => {
  // Check if userid is an integer
  const { error } = validation.validateUserId(req.params);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.invalidUserId);
  }
  next();
};
