import Joi from '@hapi/joi';

function validateSignin(user) {
  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9] |[a-zA-Z0-9]+$/).min(8).max(15)
      .required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(user, schema, options);
}

function validateSignUp(user) {
  const schema = {
    firstname: Joi.string().min(3).max(30).required(),
    lastname: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().regex(/^[+][0-9]+$/).min(13).max(13)
      .required(),
    address: Joi.string().min(3).max(50).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9] |[a-zA-Z0-9]+$/).min(8).max(15)
      .required(),
    confirmpassword: Joi.string().regex(/^[a-zA-Z0-9] |[a-zA-Z0-9]+$/).min(8).max(15)
      .required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(user, schema, options);
}

export default {
  validateSignin,
  validateSignUp,
};
