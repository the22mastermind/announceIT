/* eslint-disable import/no-mutable-exports */
import pg from 'pg';

let connection = '';

if (process.env.DATABASE_URL) {
  connection = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  console.log('PROD?: ', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'test') {
  connection = new pg.Pool({ connectionString: 'postgres://postgres:1992@localhost:5432/announceit_test' });
  console.log('ENV: ', process.env.NODE_ENV);
} else {
  connection = new pg.Pool({ connectionString: 'postgres://postgres:1992@localhost:5432/announceit' });
  console.log('DEV?: ', process.env.NODE_ENV);
}

export default connection;
