/* eslint-disable no-console */
import moment from 'moment';
import { generate } from 'generate-password';
import nodemailer from 'nodemailer';
import models from '../models/models';
import messages from './messages';

// Check if user has permission to create announcements
const userCanCreateAnnouncements = (id) => {
  const myUser = models.users.find((user) => user.id === id && user.status === 'active');
  if (myUser) {
    return true;
  }
  return false;
};

// Check if announcement exists (title and creator)
const announcementExists = (newTitle, creator) => {
  const announcement = models.announcements.find(({ title, owner }) => title === newTitle && owner === creator);
  if (announcement) {
    return true;
  }
  return false;
};

// Check if startdate and enddate are not in the past
const checkDates = (start, end) => {
  const now = moment().add(15, 'minutes');
  if (start < moment(now).format('x') || end < moment(now).format('x')) {
    return false;
  }
  if (start > end) {
    return false;
  }
  return true;
};

// Check if announcement exists (id)
const fetchAnnouncement = (announcementId) => {
  const announcement = models.announcements.find(({ id }) => id === announcementId);
  return announcement;
};

// Retrieve announcements of a specific status
const fetchAnnouncementsByStatus = (state) => {
  const announcements = models.announcements.filter(({ status }) => status === state);
  return announcements;
};

// Retrieve announcements of a specific status
const fetchAllMyAnnouncements = (id) => {
  const announcements = models.announcements.filter(({ owner }) => owner === id);
  return announcements;
};

// Fetch user announcement (announcementId, owner)
const fetchUserAnnouncement = (announcementId, creator) => {
  const announcement = models.announcements.find(({ id, owner }) => id === announcementId && owner === creator);
  return announcement;
};

// Check if user exists
const userExists = (id) => {
  const userData = models.users.find((user) => user.id === id);
  return userData;
};

// Return error messages
const returnError = (res, code, errorMessage) => res.status(code).json({
  status: code,
  error: errorMessage,
});

/**
 * @returns {string} newPassword
 * @description Generate new random password
 */
const generatePassword = () => {
  const newPassword = generate({
    length: 8,
    numbers: true,
    symbols: false,
    uppercase: true,
  });
  return newPassword;
};

const sendEmailWrapper = async (mailOptions) => new Promise((resolve) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
});

/**
 * @param {string} recipientEmail
 * @param {string} newPassword
 * @returns {boolean} true | false
 * @description Send new password to user via email
 */
const emailPassword = async (recipientEmail, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: 'AnnounceIT: Password Reset',
    text: `${messages.passwordResetEmailBody} ${newPassword}`,
  };
  const response = await sendEmailWrapper(mailOptions);
  return response;
};

export default {
  userCanCreateAnnouncements,
  announcementExists,
  checkDates,
  fetchAnnouncement,
  fetchAnnouncementsByStatus,
  fetchAllMyAnnouncements,
  fetchUserAnnouncement,
  userExists,
  returnError,
  generatePassword,
  emailPassword,
};
