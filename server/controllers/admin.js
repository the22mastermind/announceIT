/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import models from '../models/models';
import messages from '../utils/messages';
import utils from '../utils/utils';
import validation from '../middleware/validation';
import codes from '../utils/codes';

exports.viewAllUsersAnnouncements = (req, res) => {
  // Retrieve announcements
  const { announcements } = models;
  if (announcements.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  return res.status(200).json({
    status: 200,
    data: announcements,
  });
};

exports.deleteAnnouncement = (req, res) => {
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = utils.fetchAnnouncement(parseInt(announcementId, 10));
  if (!announcement) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  const index = models.announcements.indexOf(announcement);
  models.announcements.splice(index, 1);
  return res.status(200).json({
    status: 200,
    message: messages.announcementDeleted,
  });
};

exports.changeAnnouncementStatus = (req, res) => {
  // Joi Validation
  const { error } = validation.validateState(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = utils.fetchAnnouncement(parseInt(announcementId, 10));
  if (!announcement) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  announcement.status = req.body.announcementStatus;
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
  });
};

exports.blacklistUser = (req, res) => {
  // Joi Validation
  const { error } = validation.validateUserStatus(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const { id } = req.params;
  const { userStatus } = req.body;
  // Check if user exists
  const user = utils.userExists(parseInt(id, 10));
  if (!user) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.userDoesntExist);
  }
  // If user exists, check if they are not already blacklisted
  if (user.status === 'blacklisted' && userStatus === 'blacklisted') {
    return utils.returnError(res, codes.statusCodes.conflict, messages.userIsBlacklisted);
  }
  // If user exists, check if they are not already whitelisted
  if (user.status === 'active' && userStatus === 'active') {
    return utils.returnError(res, codes.statusCodes.conflict, messages.userIsActive);
  }
  // Update user status
  user.status = userStatus;
  return res.status(200).json({
    status: 200,
    message: messages.userStatusUpdateSuccessful,
  });
};
