/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
import moment from 'moment';
import jwt from 'jsonwebtoken';
import models from '../models/models';
import helper from '../helpers/helper';
import validation from '../middleware/validation';
import messages from '../utils/messages';
import utils from '../utils/utils';

// eslint-disable-next-line func-names
exports.createAnnouncement = (req, res) => {
  // Joi Validation
  const { error } = validation.validateCreateAnnouncement(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
  }
  // Retrieve token info
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Generate new id
  const id = helper.getNewId(models.announcements);
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
    return res.status(400).json({
      status: 400,
      error: messages.expiredDates,
    });
  }
  // Check if user has permission to create announcements
  const hasPermission = utils.userCanCreateAnnouncements(data.owner);
  if (!hasPermission) {
    return res.status(401).json({
      status: 401,
      error: messages.blacklisted,
    });
  }
  // Check if announcement exists already (title and creator)
  const announcement = utils.announcementExists(data.title, data.owner);
  if (announcement) {
    return res.status(400).json({
      status: 400,
      error: messages.announcementExists,
    });
  }
  // Save announcement
  const newAnnouncement = {
    id,
    title: data.title,
    description: data.description,
    startdate: data.startdate,
    enddate: data.enddate,
    status: data.status,
    owner: data.owner,
    createdon: data.createdon,
  };
  models.announcements.push(newAnnouncement);
  return res.status(201).json({
    status: 201,
    message: messages.announcementCreated,
    data: newAnnouncement,
  });
};

exports.updateAnnouncement = (req, res) => {
  // Joi Validation
  const { error } = validation.validateUpdateAnnouncement(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });
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
    return res.status(400).json({
      status: 400,
      error: messages.expiredDates,
    });
  }
  // Check if user has permission to update announcements
  const hasPermission = utils.userCanCreateAnnouncements(data.owner);
  if (!hasPermission) {
    return res.status(401).json({
      status: 401,
      error: messages.notAllowed,
    });
  }
  // Check and retrieve announcement
  const announcement = utils.fetchAnnouncement(parseInt(data.announcementId, 10));
  if (!announcement) {
    return res.status(404).json({
      status: 404,
      error: messages.announcementNotFound,
    });
  }
  // Update announcement
  const newAnnouncement = {
    id: announcement.id,
    title: announcement.title,
    description: data.description,
    startdate: data.startdate,
    enddate: data.enddate,
    status: announcement.status,
    owner: data.owner,
  };
  announcement.description = newAnnouncement.description;
  announcement.startdate = newAnnouncement.startdate;
  announcement.enddate = newAnnouncement.enddate;
  return res.status(200).json({
    status: 200,
    message: messages.announcementUpdatetd,
    data: newAnnouncement,
  });
};
