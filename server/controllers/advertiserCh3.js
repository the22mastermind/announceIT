/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import moment from 'moment';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description Advertiser creates a new announcement
 */
const createAnnouncement = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateCreateAnnouncement(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const data = {
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    startdate: moment(req.body.startdate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    enddate: moment(req.body.enddate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    status: 'pending',
    owner: req.userData.id,
    createdon: moment().format('LLLL'),
  };
  // Check if dates are valid
  const areDatesValid = utils.checkDates(data.startdate, data.enddate);
  if (!areDatesValid) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.expiredDates);
  }
  // Check if user has permission to create announcements
  const hasPermission = await queries.canCreateUpdateAnnouncements(data.owner);
  if (!hasPermission) {
    return utils.returnError(res, codes.statusCodes.unauthorized, messages.blacklisted);
  }
  // Check if announcement exists already (title and creator)
  const announcement = await queries.doesAnnouncementExists(data.title, data.owner);
  if (announcement) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.announcementExists);
  }
  const { startdate, enddate, ...temp } = data;
  const newData = {
    ...temp,
    startdate: moment(data.startdate, 'x').format('YYYY-MM-DD HH:mm'),
    enddate: moment(data.enddate, 'x').format('YYYY-MM-DD HH:mm'),
  };
  // Save announcement
  const newAnnouncement = await queries.saveAnnouncement(newData);
  return res.status(201).json({
    status: 201,
    message: messages.announcementCreated,
    data: newAnnouncement.rows[0],
  });
};

/**
 * @param {object} announcementId
 * @param {object} res
 * @returns {object} object
 * @description Advertiser updates an existing announcement
 */
const updateAnnouncement = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateUpdateAnnouncement(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  const data = {
    description: req.body.description.trim(),
    startdate: moment(req.body.startdate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    enddate: moment(req.body.enddate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    owner: req.userData.id,
    announcementId: req.params.id,
  };
  // Check if dates are valid
  const areDatesValid = utils.checkDates(data.startdate, data.enddate);
  if (!areDatesValid) {
    return utils.returnError(res, codes.statusCodes.badRequest, messages.expiredDates);
  }
  // Check if user has permission to create announcements
  const hasPermission = await queries.canCreateUpdateAnnouncements(data.owner);
  if (!hasPermission) {
    return utils.returnError(res, codes.statusCodes.unauthorized, messages.blacklisted);
  }
  // Check if announcement exists already (title and creator)
  const announcement = await queries.fetchMyAnnouncement(data.announcementId, data.owner);
  if (!announcement) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementNotFound);
  }
  const { startdate, enddate, ...temp } = data;
  const newData = {
    ...temp,
    startdate: moment(data.startdate, 'x').format('YYYY-MM-DD HH:mm'),
    enddate: moment(data.enddate, 'x').format('YYYY-MM-DD HH:mm'),
  };
  // Update announcement
  const updateAnnouncement = await queries.updateAnnouncement(newData);
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
    data: updateAnnouncement.rows[0],
  });
};

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 * @description Advertiser view all my announcements
 */
const viewAllAnnouncements = async (req, res) => {
  // Check and retrieve announcements
  const announcements = await queries.fetchAllMyAnnouncements(req.userData.id);
  if (announcements.rows.length === 0) {
    return res.status(404).json({
      status: 404,
      error: messages.announcementDoesntExist,
    });
  }
  return res.status(200).json({
    status: 200,
    data: announcements.rows,
  });
};

/**
 * @param {object} announcementId
 * @param {object} res
 * @returns {object} object
 * @description Advertiser view a specific announcement
 */
const viewSpecificAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = await queries.retrieveAnnouncement(parseInt(announcementId, 10), req.userData.id);
  if (announcement.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  return res.status(200).json({
    status: 200,
    data: announcement.rows[0],
  });
};

/**
 * @param {object} announcementStatus
 * @param {object} res
 * @returns {object} object
 * @description Advertiser view all announcements of a specific status
 */
const viewAnnouncementsOfState = async (req, res) => {
  const { announcementStatus } = req.params;
  // Check and retrieve announcement
  const announcements = await queries.fetchAllMyAnnouncements(req.userData.id);
  if (announcements.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  const sortedAnnouncements = announcements.rows.filter(({ status }) => status === announcementStatus);
  if (sortedAnnouncements.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  return res.status(200).json({
    status: 200,
    data: sortedAnnouncements,
  });
};

export default {
  createAnnouncement,
  updateAnnouncement,
  viewAllAnnouncements,
  viewSpecificAnnouncement,
  viewAnnouncementsOfState,
};
