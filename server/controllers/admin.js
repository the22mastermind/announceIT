/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import models from '../models/models';
import messages from '../utils/messages';

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
