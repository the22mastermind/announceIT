import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';
import validation from '../middleware/validation';

const viewAllUsersAnnouncements = async (req, res) => {
  // Retrieve announcements
  const announcements = await queries.fetchAllUsersAnnouncements();
  if (announcements.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  return res.status(200).json({
    status: 200,
    data: announcements.rows,
  });
};

const deleteAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = await queries.checkAnnouncement(parseInt(announcementId, 10));
  if (announcement.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  // Delete announcement
  const delAnnnouncement = await queries.dropAnnouncement(parseInt(announcementId, 10));
  return res.status(200).json({
    status: 200,
    message: messages.announcementDeleted,
    data: delAnnnouncement.rows[0],
  });
};

const changeAnnouncementStatus = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateState(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const { announcementId } = req.params;
  const { announcementStatus } = req.body;
  // Check and retrieve announcement
  const announcement = await queries.checkAnnouncement(parseInt(announcementId, 10));
  if (announcement.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  // Update announcement status
  const updateAnnouncement = await queries.updateAnnouncementStatus(announcementStatus, announcementId);
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
    data: updateAnnouncement.rows[0],
  });
};

const changeUserStatus = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateUserStatus(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const { id } = req.params;
  const { userStatus } = req.body;
  const role = true;
  // Check if user exists
  const user = await queries.doesUserExist(parseInt(id, 10), role);
  if (user.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.userDoesntExist);
  }
  // If user exists, check if they are not already blacklisted
  if (user.rows[0].status === 'blacklisted' && userStatus === 'blacklisted') {
    return utils.returnError(res, codes.statusCodes.conflict, messages.userIsBlacklisted);
  }
  // If user exists, check if they are not already whitelisted
  if (user.rows[0].status === 'active' && userStatus === 'active') {
    return utils.returnError(res, codes.statusCodes.conflict, messages.userIsActive);
  }
  // Update user status
  const updateStatus = await queries.updateUserStatus(userStatus, parseInt(id, 10));
  const { password, ...newUserData } = updateStatus.rows[0];
  return res.status(200).json({
    status: 200,
    message: messages.userStatusUpdateSuccessful,
    data: newUserData,
  });
};

export default {
  viewAllUsersAnnouncements,
  deleteAnnouncement,
  changeAnnouncementStatus,
  changeUserStatus,
};
