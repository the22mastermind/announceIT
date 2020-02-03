/* eslint-disable import/no-mutable-exports */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

let connection = '';

if (process.env.DATABASE_URL) {
  connection = new pg.Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
  connection = new pg.Pool({ connectionString: process.env.TESTDBURL });
} else {
  connection = new pg.Pool({ connectionString: process.env.DEVDBURL });
}

export default connection;
