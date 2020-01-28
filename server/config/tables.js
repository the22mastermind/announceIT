/* eslint-disable no-console */
import pool from './db';

pool.on('connect', () => {
  console.log('Connected to PSQL DB');
});

// Drop Tables
const drop = () => {
  const users = 'DROP TABLE IF EXISTS users CASCADE;';
  const announcements = 'DROP TABLE IF EXISTS announcements CASCADE;';
  const flags = 'DROP TABLE IF EXISTS flags CASCADE;';
  const con = `${users}; ${announcements}; ${flags};`;

  pool.query(con)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

// Create Tables
const create = () => {
  const queryUsers = `CREATE TABLE IF NOT EXISTS users(
      id serial PRIMARY KEY,
      first_name varchar NOT NULL,
      last_name varchar NULL,
      email varchar UNIQUE NOT NULL,
      phoneNumber varchar (13) UNIQUE NOT NULL,
      address varchar NOT NULL,
      password varchar NOT NULL,
      status varchar NOT NULL,
      is_admin boolean NOT NULL,
      createdon timestamptz NOT NULL
      );`;

  const queryAnnouncement = `CREATE TABLE IF NOT EXISTS announcements (
      id serial PRIMARY KEY,
      picture varchar NULL,
      title varchar NOT NULL,
      text varchar NOT NULL,
      start_date timestamptz NOT NULL,
      end_date timestamptz NOT NULL,
      status varchar NOT NULL,
      owner int REFERENCES users(id) ON DELETE CASCADE,
      createdon timestamptz NOT NULL
      );`;

  const queryFlags = `CREATE TABLE IF NOT EXISTS flags (
      id serial PRIMARY KEY,
      announcement_id int REFERENCES announcements(id) ON DELETE CASCADE,
      reason varchar NOT NULL,
      description varchar NOT NULL,
      createdon timestamptz NOT NULL
      );`;

  const execute = `
    ${queryUsers};
    ${queryAnnouncement};
    ${queryFlags};
    `;

  pool.query(execute)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
};

export {
  drop,
  create,
};

require('make-runnable');
