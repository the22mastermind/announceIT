import validation from './validation';
import messages from '../utils/messages';

module.exports = (req, res, next) => {
  // Check if userid is an integer
  const { error } = validation.validateUserId(req.params);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: messages.invalidUserId,
    });
  }
  next();
};
