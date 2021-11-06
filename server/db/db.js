import pg from 'pg';

const db = new pg.Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "kpopop",
});

export default db;