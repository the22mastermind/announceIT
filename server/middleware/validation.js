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

export default {
  validateSignin,
};
