import validation from './validation';
import messages from '../utils/messages';

module.exports = (req, res, next) => {
  // Check if state is among: 'pending', 'accepted', 'declined', 'active', 'deactivated
  const { error } = validation.validateState(req.params);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  next();
};
