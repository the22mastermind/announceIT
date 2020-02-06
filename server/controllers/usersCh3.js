/* eslint-disable object-shorthand */
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import helper from '../helpers/helper';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';
import pool from '../config/db';

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description User sign up
 */
const userSignup = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateSignUp(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
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
    return utils.returnError(res, codes.statusCodes.badRequest, messages.passwordsNoMatch);
  }
  // Check if user has already signed up
  const myUser = await queries.isUserRegistered(data.email);
  if (myUser) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.userExists);
  }
  // Encrypt password
  return bcrypt.hash(data.password, 10, async (err, hash) => {
    if (hash) {
      // Payload destructure and spread
      const { confirmpassword, ...parsedData } = data;
      const newUser = {
        ...parsedData,
        password: hash,
        status: 'active',
        createdon: moment().format('LLLL'),
      };
      // Save to db
      const saveUser = await queries.signupUser(newUser);
      const { password, ...user } = saveUser.rows[0];
      return res.status(201).json({
        status: 201,
        message: messages.successfulSignup,
        data: user,
      });
    }
  });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description User sign in
 */
const userSignin = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateSignin(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const data = {
    email: req.body.email.trim(),
    password: req.body.password.trim(),
  };
  // Check if user has already signed up
  const myUser = await pool.query('SELECT * FROM users WHERE email=$1', [data.email]);
  if (myUser.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.userDoesntExist);
  }
  // Check if password is valid
  return bcrypt.compare(data.password, myUser.rows[0].password, (err, result) => {
    if (result) {
      // Create token
      const token = jwt.sign(
        {
          id: myUser.rows[0].id,
          firstname: myUser.rows[0].firstname,
          email: myUser.rows[0].email,
          isAdmin: myUser.rows[0].isadmin,
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
          id: myUser.rows[0].id,
          firstname: myUser.rows[0].firstname,
          lastname: myUser.rows[0].lastname,
          email: myUser.rows[0].email,
          phone: myUser.rows[0].phone,
          address: myUser.rows[0].address,
          isadmin: myUser.rows[0].isadmin,
          status: myUser.rows[0].status,
          createdon: myUser.rows[0].createdon,
        },
      });
    }
    return utils.returnError(res, codes.statusCodes.unauthorized, messages.invalidCredentials);
  });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description User password reset
 */
const userPasswordReset = async (req, res) => {
  // Joi Validation
  const { error } = validation.validatePasswordReset(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const data = {
    email: req.body.email.trim(),
    password: req.body.password,
    new_password: req.body.new_password,
  };
  // Check if user has already signed up
  const myUser = await queries.isUserRegistered(data.email);
  if (!myUser) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.userDoesntExist);
  }
  if (data.password === undefined) {
    // Generate new password
    const newPassword = await utils.generatePassword();
    // Send new password via email
    const emailPassword = await utils.emailPassword(data.email, newPassword);
    if (!emailPassword) {
      return utils.returnError(res, codes.statusCodes.badRequest, messages.passwordResetFailed);
    }
    console.log('EMAIL SENT ');
    // Encrypt password
    return bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (hash) {
        // Save password in database
        const updateUser = await queries.updateUserPassword(hash, data.email);
        if (!updateUser) {
          return utils.returnError(res, codes.statusCodes.badRequest, messages.passwordResetFailed);
        }
        return res.status(200).json({
          status: 200,
          message: messages.passwordResetSuccessful,
        });
      }
      return res.status(400).json({
        status: 400,
        message: messages.passwordResetFailed,
      });
    });
  }
  // Check if password matches saved one before resetting it
  const match = await queries.arePasswordsMatching(data.email, data.password.trim());
  if (!match) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.passwordsNoMatchExisting);
  }
  if (data.new_password === undefined) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.noNewPassword);
  }
  // Encrypt new password
  return bcrypt.hash(data.new_password.trim(), 10, async (err, hash) => {
    if (hash) {
      // Save password in database
      const updateUser = await queries.updateUserPassword(hash, data.email);
      if (!updateUser) {
        return utils.returnError(res, codes.statusCodes.badRequest, messages.passwordResetFailed);
      }
      return res.status(200).json({
        status: 200,
        message: messages.passwordResetSuccessful,
      });
    }
  });
};

export default {
  userSignup,
  userSignin,
  userPasswordReset,
};
