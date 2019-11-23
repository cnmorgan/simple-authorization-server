const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const URI = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: URI,
  ssl: true
});

pool.on("connect", () => {
  console.log("Database connected...");
});

module.exports = {
  pool: pool,

  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      if (err) console.log(err);
      else
        console.log("executed query", { text, duration, rows: res.rowCount });
      callback(err, res);
    });
  }
};
