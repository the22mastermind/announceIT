/* eslint-disable no-console */
import pool from './db';

pool.on('connect', () => {
  console.log('Connected to DB');
});

// Drop Tables
const drop = () => {
  const dropUsersTable = 'DROP TABLE IF EXISTS users CASCADE;';
  const dropAnnouncementsTable = 'DROP TABLE IF EXISTS announcements CASCADE;';
  const dropFlagsTable = 'DROP TABLE IF EXISTS flags CASCADE;';
  const dropTables = `${dropUsersTable}; ${dropAnnouncementsTable}; ${dropFlagsTable};`;

  pool.query(dropTables, () => {
    pool.end();
  });

  pool.on('remove', () => {
    process.exit(0);
  });
};

// Create Tables
const create = () => {
  const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY,
      first_name varchar NOT NULL,
      last_name varchar NULL,
      email varchar UNIQUE NOT NULL,
      phonenumber varchar (13) NOT NULL,
      address varchar NOT NULL,
      password varchar NOT NULL,
      status varchar NOT NULL,
      isadmin boolean NOT NULL,
      createdon timestamptz NOT NULL
      );`;

  const createAnnouncementTable = `CREATE TABLE IF NOT EXISTS announcements (
      id serial PRIMARY KEY,
      picture varchar NULL,
      title varchar NOT NULL,
      text varchar NOT NULL,
      start_date varchar NOT NULL,
      end_date varchar NOT NULL,
      status varchar NOT NULL,
      owner int REFERENCES users(id) ON DELETE CASCADE,
      createdon timestamptz NOT NULL
      );`;

  const createFlagsTable = `CREATE TABLE IF NOT EXISTS flags (
      id serial PRIMARY KEY,
      announcement_id int REFERENCES announcements(id) ON DELETE CASCADE,
      reason varchar NOT NULL,
      description varchar NOT NULL,
      createdon timestamptz NOT NULL
      );`;

  const createTables = `
    ${createUsersTable};
    ${createAnnouncementTable};
    ${createFlagsTable};
    `;

  pool.query(createTables, () => {
    pool.end();
  });

  pool.on('remove', () => {
    process.exit(0);
  });
};

export {
  drop,
  create,
};

require('make-runnable');
