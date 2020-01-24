/* eslint-disable object-shorthand */
import dotenv from 'dotenv';
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models/models';
import helper from '../helpers/helper';
import validation from '../middleware/validation';
import messages from '../utils/messages';

dotenv.config();

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

exports.userSignup = (req, res) => {
  // Joi Validation
  const { error } = validation.validateSignUp(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  const id = helper.getNewId(models.users);
  const data = {
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    password: req.body.password.trim(),
    confirmpassword: req.body.confirmpassword.trim(),
    isAdmin: req.body.isadmin ? req.body.isadmin : false,
  };
  // Check if passwords are matching
  const match = helper.matchPasswords(data.password, data.confirmpassword);
  if (!match) {
    return res.status(400).json({
      status: 400,
      error: messages.passwordsNoMatch,
    });
  }
  // Check if user has already signed up
  const myUser = models.users.find((user) => user.email === data.email);
  if (myUser) {
    return res.status(400).json({
      status: 400,
      error: messages.userExists,
    });
  }
  // Encrypt password
  return bcrypt.hash(data.password, 10, (err, hash) => {
    if (hash) {
      // Sign up the user
      const newUser = {
        id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: hash,
        isAdmin: data.isAdmin,
        status: 'active',
        registered: moment().format('LLLL'),
      };
      models.users.push(newUser);
      return res.status(201).json({
        status: 201,
        message: messages.successfulSignup,
        data: {
          id: id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          isAdmin: newUser.isAdmin,
          status: newUser.status,
          registered: newUser.registered,
        },
      });
    }
  });
};
