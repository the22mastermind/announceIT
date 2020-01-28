/* eslint-disable import/no-mutable-exports */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connection = '';

if (process.env.DATABASE_URL) {
  connection = new pg.Pool({ connectionString: process.env.DATABASE_URL });
} else {
  connection = new pg.Pool({ connectionString: 'postgres://postgres:1992@localhost:5432/announceit' });
}

export default connection;
