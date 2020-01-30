/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import moment from 'moment';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';
import auth from '../middleware/auth';

// eslint-disable-next-line func-names
const createAnnouncement = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateCreateAnnouncement(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  // Retrieve token info
  const myToken = await auth.myToken(req);
  const data = {
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    startdate: moment(req.body.startdate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    enddate: moment(req.body.enddate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    status: 'pending',
    owner: myToken.id,
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
  // Save announcement
  const newAnnouncement = await queries.saveAnnouncement(data);
  return res.status(201).json({
    status: 201,
    message: messages.announcementCreated,
    data: newAnnouncement.rows[0],
  });
};

const updateAnnouncement = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateUpdateAnnouncement(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  // Retrieve token info
  const myToken = await auth.myToken(req);
  // Generate new id
  const data = {
    description: req.body.description.trim(),
    startdate: moment(req.body.startdate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    enddate: moment(req.body.enddate.trim(), 'MM-DD-YYYY HH:mm').format('x'),
    owner: myToken.id,
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
  // Update announcement
  const updateAnnouncement = await queries.updateAnnouncement(data);
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
    data: updateAnnouncement.rows[0],
  });
};

const viewSpecificAnnouncement = async (req, res) => {
  // Retrieve token info
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

export default {
  createAnnouncement,
  updateAnnouncement,
  viewSpecificAnnouncement,
};
