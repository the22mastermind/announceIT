/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import moment from 'moment';
import jwt from 'jsonwebtoken';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';

// eslint-disable-next-line func-names
const createAnnouncement = async (req, res) => {
  // Joi Validation
  const { error } = validation.validateCreateAnnouncement(req.body);
  if (error) {
    return utils.returnError(res, codes.statusCodes.badRequest, error.details[0].message);
  }
  // Retrieve token info
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
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
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Generate new id
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
  // Update announcement
  const updateAnnouncement = await queries.updateAnnouncement(data);
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
    data: updateAnnouncement.rows[0],
  });
};

export default {
  createAnnouncement,
  updateAnnouncement,
};
