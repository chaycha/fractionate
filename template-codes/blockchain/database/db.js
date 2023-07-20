const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "psql456",
  host: "localhost",
  port: 5432,
  database: "fractionate",
});

module.exports = pool;
