/* eslint-disable object-shorthand */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models/models';
import validation from '../middleware/validation';
import messages from '../utils/messages';

// eslint-disable-next-line func-names
exports.userSignin = (req, res) => {
  // Joi Validation
  const { error } = validation.validateSignin(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  const data = {
    email: req.body.email.trim(),
    password: req.body.password.trim(),
  };
  // Check if user has already signed up
  const myUser = models.users.find((user) => user.email === data.email);
  if (!myUser) {
    return res.status(400).json({
      status: 400,
      error: messages.invalidCredentials,
    });
  }
  // Check if password is valid
  return bcrypt.compare(data.password, myUser.password, (err, result) => {
    if (result) {
      // Create token
      const token = jwt.sign(
        {
          id: myUser.id,
          firstname: myUser.firstname,
          email: myUser.email,
          isAdmin: myUser.isAdmin,
        },
        process.env.JWT_KEY,
        {
          expiresIn: '30d',
        },
      );
      return res.status(200).json({
        status: 200,
        message: messages.successfulLogin,
        data: {
          token: token,
          id: myUser.id,
          firstname: myUser.firstname,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          address: myUser.address,
          isAdmin: myUser.isAdmin,
          status: myUser.status,
          registered: myUser.registered,
        },
      });
    }
    return res.status(401).json({
      status: 401,
      error: messages.invalidCredentials,
    });
  });
};
