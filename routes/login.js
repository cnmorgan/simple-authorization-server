var express = require("express");
var db = require("../services/db");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var router = express.Router();

router.post("/", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  //check that request is valid
  if (email === undefined || password === undefined) {
    res.sendStatus(400);
  }
  //if request is valid
  else {
    //get user from db
    db.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      [],
      (err, users) => {
        if (err) console.log(err);

        // check that user exists
        if (users.rows.length === 0) {
          res.status(400).send("User not found");
        }
        //if user exists check for correct password
        else {
          let hash = users.rows[0].password;
          bcrypt.compare(password, hash, (err, match) => {
            //If the password was authenticated then give the client access and refresh tokens
            if (match) {
              var token = jwt.sign(users.rows[0], process.env.SECRET, {
                expiresIn: 600
              });

              var refreshToken = jwt.sign(users.rows[0], process.env.SECRET, {
                expiresIn: "40d"
              });

              res
                .status(201)
                .json({ accessToken: token, refreshToken: refreshToken });
            } else {
              res.status(401).send("Incorrect Password");
            }
          });
        }
      }
    );
  }
});

module.exports = router;
