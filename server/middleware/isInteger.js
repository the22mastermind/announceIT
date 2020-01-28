import validation from './validation';
import messages from '../utils/messages';
import codes from '../utils/codes';
import utils from '../utils/utils';

module.exports = (req, res, next) => {
  // Check if param is an integer
  const { error } = validation.validateId(req.params);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.invalidAnnouncementId);
  }
  next();
};
