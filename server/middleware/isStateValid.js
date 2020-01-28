import validation from './validation';
import codes from '../utils/codes';
import utils from '../utils/utils';

module.exports = (req, res, next) => {
  // Check if state is among: 'pending', 'accepted', 'declined', 'active', 'deactivated
  const { error } = validation.validateState(req.params);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  next();
};
