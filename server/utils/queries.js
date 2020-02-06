/* eslint-disable no-else-return */
import bcrypt from 'bcrypt';
import pool from '../config/db';

/**
 * @param {string} email
 * @returns {boolean} true | false
 * @description Checks if user is registered
 */
const isUserRegistered = async (email) => {
  // Check if email of user is registered
  const registered = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (registered.rows.length !== 0) {
    return true;
  }
  return false;
};

/**
 * @param {object} data
 * @returns {object} userData
 * @description Persist new user data in database
 */
const signupUser = async (data) => {
  const user = await pool.query('INSERT INTO users(first_name,last_name,email,phonenumber,address,password,status,isadmin,createdon) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING*',
    [
      data.firstname,
      data.lastname,
      data.email,
      data.phone,
      data.address,
      data.password,
      data.status,
      data.isAdmin,
      data.createdon,
    ]);
  return user;
};

/**
 * @param {integer} userId
 * @returns {boolean} true | false
 * @description Check if user is allowed to create or update announcements
 */
const canCreateUpdateAnnouncements = async (id) => {
  const user = await pool.query('SELECT status FROM users WHERE id=$1', [id]);
  if (user.rows.length === 0) {
    return false;
  } else if (user.rows[0].status === 'blacklisted') {
    return false;
  } else {
    return true;
  }
};

/**
 * @param {string} title
 * @param {integer} owner
 * @returns {boolean} true | false
 * @description Check if user has already created an announcement of the same title
 */
const doesAnnouncementExists = async (title, owner) => {
  const announcement = await pool.query('SELECT * FROM announcements WHERE title=$1 and owner=$2', [title, owner]);
  if (announcement.rows.length !== 0) {
    return true;
  }
  return false;
};

/**
 * @param {object} data
 * @returns {object} announcement
 * @description Persist new announcement data in database
 */
const saveAnnouncement = async (data) => {
  const announcement = await pool.query('INSERT INTO announcements(title,text,start_date,end_date,status,owner,createdon) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING*',
    [
      data.title,
      data.description,
      data.startdate,
      data.enddate,
      data.status,
      data.owner,
      data.createdon,
    ]);
  return announcement;
};

/**
 * @param {integer} id
 * @param {integer} owner
 * @returns {boolean} true | false
 * @description Check if a specific announcement was created by a specific user
 */
const fetchMyAnnouncement = async (id, owner) => {
  const announcement = await pool.query('SELECT * FROM announcements WHERE id=$1 and owner=$2', [id, owner]);
  if (announcement.rows.length !== 0) {
    return true;
  }
  return false;
};

/**
 * @param {object} data
 * @returns {object} announcement
 * @description update announcement details in database
 */
const updateAnnouncement = async (data) => {
  const announcement = await pool.query('UPDATE announcements SET text=$1,start_date=$2,end_date=$3 WHERE id=$4 and owner=$5 RETURNING*',
    [
      data.description,
      data.startdate,
      data.enddate,
      data.announcementId,
      data.owner,
    ]);
  return announcement;
};

/**
 * @param {integer} id
 * @param {integer} owner
 * @returns {object} announcement
 * @description Retrieve a specific announcement that was created by a specific user
 */
const retrieveAnnouncement = async (id, owner) => {
  const announcement = await pool.query('SELECT * FROM announcements WHERE id=$1 and owner=$2', [id, owner]);
  return announcement;
};

/**
 * @param {integer} id
 * @returns {object} announcement
 * @description Retrieve a specific announcement from the database
 */
const checkAnnouncement = async (id) => {
  const announcement = await pool.query('SELECT * FROM announcements WHERE id=$1', [id]);
  return announcement;
};

/**
 * @param {integer} id
 * @returns {object} announcement
 * @description Delete a specific announcement from the database
 */
const dropAnnouncement = async (id) => {
  const announcement = await pool.query('DELETE FROM announcements WHERE id=$1 RETURNING*',
    [id]);
  return announcement;
};

/**
 * @param {integer} id
 * @returns {object} announcements
 * @description Retrieve all announcements that were created by a specific user
 */
const fetchAllMyAnnouncements = async (id) => {
  const announcements = await pool.query('SELECT * FROM announcements WHERE owner=$1', [id]);
  return announcements;
};

/**
 * @returns {object} announcements
 * @description Retrieve all announcements from all users sorted by last created
 */
const fetchAllUsersAnnouncements = async () => {
  const announcements = await pool.query('SELECT * FROM announcements ORDER BY createdon DESC');
  return announcements;
};

/**
 * @param {string} announcementStatus
 * @param {integer} announcementId
 * @returns {object} announcement
 * @description Update the status of a specific announcement
 */
const updateAnnouncementStatus = async (announcementStatus, announcementId) => {
  const announcement = await pool.query('UPDATE announcements SET status=$1 WHERE id=$2 RETURNING*',
    [
      announcementStatus,
      announcementId,
    ]);
  return announcement;
};

/**
 * @param {integer} id
 * @param {boolean} role
 * @returns {object} user
 * @description Check if a specific user is registered and is not an admin
 */
const doesUserExist = async (id, role) => {
  const user = await pool.query('SELECT * FROM users WHERE id=$1 and isadmin!=$2', [id, role]);
  return user;
};

/**
 * @param {string} newStatus
 * @param {integer} id
 * @returns {object} user
 * @description Update the status of a specific user
 */
const updateUserStatus = async (newStatus, id) => {
  const user = await pool.query('UPDATE users SET status=$1 WHERE id=$2 RETURNING*',
    [
      newStatus,
      id,
    ]);
  return user;
};

/**
 * @param {string} email
 * @returns {boolean} true | false
 * @description Checks if the password provided matches the one in records
 */
async function arePasswordsMatching(email, password) {
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const response = await bcrypt.compare(password, user.rows[0].password);
  return response;
}

/**
 * @param {string} password
 * @returns {boolean} true | false
 * @description Save the new password of a user
 */
const updateUserPassword = async (password, email) => {
  const user = await pool.query('UPDATE users SET password=$1 WHERE email=$2 RETURNING*',
    [
      password,
      email,
    ]);
  if (user.rows.length !== 0) {
    return true;
  }
  return false;
};

export default {
  isUserRegistered,
  signupUser,
  canCreateUpdateAnnouncements,
  doesAnnouncementExists,
  saveAnnouncement,
  fetchMyAnnouncement,
  updateAnnouncement,
  fetchAllUsersAnnouncements,
  fetchAllMyAnnouncements,
  retrieveAnnouncement,
  checkAnnouncement,
  dropAnnouncement,
  updateAnnouncementStatus,
  doesUserExist,
  updateUserStatus,
  updateUserPassword,
  arePasswordsMatching,
};
