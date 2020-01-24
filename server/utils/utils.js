import moment from 'moment';
import models from '../models/models';

// Check if user has permission to create announcements
exports.userCanCreateAnnouncements = (id) => {
  const myUser = models.users.find((user) => user.id === id && user.status === 'active');
  if (myUser) {
    return true;
  }
  return false;
};

// Check if announcement exists already (title and creator)
exports.announcementExists = (newTitle, creator) => {
  const announcement = models.announcements.find(({ title, owner }) => title === newTitle && owner === creator);
  if (announcement) {
    return true;
  }
  return false;
};

// Check if startdate and enddate are not in the past
exports.checkDates = (start, end) => {
  const now = moment().add(15, 'minutes');
  if (start < moment(now).format('x') || end < moment(now).format('x')) {
    return false;
  }
  if (start > end) {
    return false;
  }
  return true;
};

// Check if announcement exists already (title and creator)
exports.fetchAnnouncement = (announcementId) => {
  const announcement = models.announcements.find(({ id }) => id === announcementId);
  return announcement;
};

// Retrieve announcements of a specific status
exports.fetchAnnouncementsByStatus = (state) => {
  const announcements = models.announcements.filter(({ status }) => status === state);
  return announcements;
};
