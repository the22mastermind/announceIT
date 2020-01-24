/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import models from '../models/models';
import messages from '../utils/messages';
import utils from '../utils/utils';
import validation from '../middleware/validation';

exports.viewAllUsersAnnouncements = (req, res) => {
  // Retrieve announcements
  const { announcements } = models;
  if (announcements.length === 0) {
    return res.status(404).json({
      status: 404,
      error: messages.announcementDoesntExist,
    });
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
    return res.status(404).json({
      status: 404,
      error: messages.announcementDoesntExist,
    });
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
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = utils.fetchAnnouncement(parseInt(announcementId, 10));
  if (!announcement) {
    return res.status(404).json({
      status: 404,
      error: messages.announcementDoesntExist,
    });
  }
  announcement.status = req.body.announcementStatus;
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
  });
};
