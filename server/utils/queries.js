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

export default {
  isUserRegistered,
  signupUser,
};
