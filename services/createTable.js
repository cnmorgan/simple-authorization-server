const { pool } = require("./db");

var query = `CREATE TABLE IF NOT EXISTS
    users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(355) NOT NULL,
    email VARCHAR (355) UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP);`;

pool
  .query(query)
  .then(res => {
    console.log(res);
    console.log("Table created!");
  })
  .catch(err => {
    console.log(err);
    console.log("Table creation failed...");
  });

query = `CREATE TABLE IF NOT EXISTS
    tokens(
        token VARCHAR(355) NOT NULL
    );`;

pool
  .query(query)
  .then(res => {
    console.log(res);
    console.log("Table created!");
    pool.end();
  })
  .catch(err => {
    console.log(err);
    console.log("Table creation failed...");
    pool.end();
  });
