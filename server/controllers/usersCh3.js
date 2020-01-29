/* eslint-disable object-shorthand */
import moment from 'moment';
import bcrypt from 'bcrypt';
import helper from '../helpers/helper';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';

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
      //
      return res.status(201).json({
        status: 201,
        message: messages.successfulSignup,
        data: saveUser.rows[0],
      });
    }
  });
};

export default {
  userSignup,
};
