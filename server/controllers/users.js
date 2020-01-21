import moment from 'moment';
import models from '../models/models';
import helper from '../helpers/helper';
import validation from '../middleware/validation';

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
  };
  // Check if passwords are matching
  const match = helper.matchPasswords(data.password, data.confirmpassword);
  if (!match) {
    return res.status(400).json({
      status: 400,
      error: 'Please make sure your passwords are matching',
    });
  }
  // Check if user has already signed up
  const myUser = models.users.find((user) => user.email === data.email);
  if (myUser) {
    return res.status(400).json({
      status: 400,
      error: 'User already registered. Please use a different email or reset your password',
    });
  }
  // Encrypt password
  // Sign up the user
  const newUser = {
    id,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    phone: data.phone,
    address: data.address,
    password: data.password,
    isAdmin: false,
    registered: moment().format('LLLL'),
  };
  models.users.push(newUser);
  return res.status(201).json({
    status: 201,
    data: {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      isAdmin: false,
      registered: newUser.registered,
    },
  });
};
