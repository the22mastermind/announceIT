import Joi from '@hapi/joi';

/**
 * @param {string} email
 * @param {string} password
 * @returns {object} object
 * @description User sign in validation
 */
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

/**
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} phone
 * @param {string} address
 * @param {string} password
 * @param {string} confirmpassword
 * @param {boolean} isadmin
 * @returns {object} object
 * @description User sign up validation
 */
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
    isadmin: Joi.boolean().optional(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(user, schema, options);
}

/**
 * @param {string} title
 * @param {string} description
 * @param {string} startdate
 * @param {string} enddate
 * @returns {object} object
 * @description Create announcement validation
 */
function validateCreateAnnouncement(data) {
  const schema = {
    title: Joi.string().min(10).max(30).required(),
    description: Joi.string().min(100).max(1000).required(),
    startdate: Joi.string().min(10).max(16).required(),
    enddate: Joi.string().min(10).max(16).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(data, schema, options);
}

/**
 * @param {string} description
 * @param {string} startdate
 * @param {string} enddate
 * @returns {object} object
 * @description Update announcement validation
 */
function validateUpdateAnnouncement(data) {
  const schema = {
    description: Joi.string().min(100).max(1000).required(),
    startdate: Joi.string().min(10).max(16).required(),
    enddate: Joi.string().min(10).max(16).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(data, schema, options);
}

/**
 * @param {string} announcementId
 * @returns {object} object
 * @description Announcement id validation
 */
function validateId(id) {
  const schema = {
    announcementId: Joi.number().min(1).max(100000).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(id, schema, options);
}

/**
 * @param {string} announcementStatus
 * @returns {object} object
 * @description Announcement status validation
 */
function validateState(state) {
  const schema = {
    announcementStatus: Joi.string().valid(['pending', 'accepted', 'declined', 'active', 'deactivated']).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(state, schema, options);
}

/**
 * @param {string} id
 * @returns {object} object
 * @description User id validation
 */
function validateUserId(id) {
  const schema = {
    id: Joi.number().min(1).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(id, schema, options);
}

/**
 * @param {string} userStatus
 * @returns {object} object
 * @description User status validation
 */
function validateUserStatus(state) {
  const schema = {
    userStatus: Joi.string().valid(['blacklisted', 'active']).required(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(state, schema, options);
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} confirmpassword
 * @returns {object} object
 * @description User reset password validation
 */
function validatePasswordReset(data) {
  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9] |[a-zA-Z0-9]+$/).min(8).max(15)
      .optional(),
    new_password: Joi.string().regex(/^[a-zA-Z0-9] |[a-zA-Z0-9]+$/).min(8).max(15)
      .optional(),
  };
  const options = {
    language: {
      key: '{{key}} ',
    },
  };
  return Joi.validate(data, schema, options);
}

export default {
  validateSignin,
  validateSignUp,
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateId,
  validateState,
  validateUserId,
  validateUserStatus,
  validatePasswordReset,
};
