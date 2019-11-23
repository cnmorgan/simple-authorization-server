var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
const db = require("../services/db");
const { authenticateToken } = require("../services/functions");

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.get("/", (req, res) => {
  res.status(200).send("API Running");
});

router.post("/", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  //check for a valid request
  if (username === undefined || password === undefined || email === undefined) {
    return res.sendStatus(400);
  }

  //check for valid email
  if (!emailRegex.test(email.toLowerCase())) {
    return res.status(400).send("Invalid email");
  }

  //Check if user already exists
  db.query(
    `SELECT * FROM users WHERE email = '${email}'`,
    [],
    (err, response) => {
      if (err) console.log(err);

      if (response.rows.length > 0) {
        return res.status(400).send("User with that email already exits");
      } else {
        //Add user to database if one with the email was not found
        bcrypt.hash(password, 10, (err, hash) => {
          db.query(
            `INSERT INTO users (username, password, email, created_on)
                    VALUES
                    ('${username}','${hash}','${email}', to_timestamp(${Date.now() /
              1000.0}));`,
            [],
            err => {
              if (err) {
                console.log("User creation failed");
                return res.sendStatus(500);
              } else {
                console.log("User creation successful!");
                return res.sendStatus(201);
              }
            }
          );
        });
      }
    }
  );
});

router.delete("/", authenticateToken, (req, res) => {
  db.query(
    `DELETE FROM users
            WHERE user_id = ${req.user.user_id}`,
    [],
    (err, response) => {
      if (err) return res.sendStatus(500);
      else {
        return res.status(200).send("User deleted");
      }
    }
  );
});

module.exports = router;
