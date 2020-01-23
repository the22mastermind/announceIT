import validation from './validation';
import messages from '../utils/messages';

module.exports = (req, res, next) => {
  // Check if param is an integer
  const { error } = validation.validateId(req.params);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: messages.invalidAnnouncementId,
    });
  }
  next();
};
