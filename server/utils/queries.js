import pool from '../config/db';

const isUserRegistered = async (email) => {
  // Check if email of user is registered
  const registered = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (registered.rows.length !== 0) {
    return true;
  }
  return false;
};

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

const canCreateUpdateAnnouncements = async (id) => {
  const user = await pool.query('SELECT status FROM users WHERE id=$1', [id]);
  return user.rows[0].status;
};

const doesAnnouncementExists = async (title, owner) => {
  const announcement = await pool.query('SELECT * FROM announcements WHERE title=$1 and owner=$2', [title, owner]);
  if (announcement.rows.length !== 0) {
    return true;
  }
  return false;
};

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

export default {
  isUserRegistered,
  signupUser,
  canCreateUpdateAnnouncements,
  doesAnnouncementExists,
  saveAnnouncement,
};
