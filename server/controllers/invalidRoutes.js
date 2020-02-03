import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description Handle all invalid routes
 */
const handleInvalidRoutes = async (req, res) => utils.returnError(res, codes.statusCodes.notFound, messages.invalidRoutes);

export default {
  handleInvalidRoutes,
};
