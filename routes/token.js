var express = require("express");
var db = require("../services/db");
var jwt = require("jsonwebtoken");

var router = express.Router();

router.get("/", (req, res) => {
  //Check that a token was given
  if (req.body.token === undefined) return res.sendStatus(401);
  //check that refresh token is not in list of blacklisted tokens
  db.query(
    `SELECT * FROM tokens WHERE token = '${req.body.token}'`,
    [],
    (err, response) => {
      if (response.rows.length > 0) {
        return res.sendStatus(403);
      } else {
        //check that token valid
        jwt.verify(req.body.token, process.env.SECRET, (err, user) => {
          if (err) return res.sendStatus(403);

          var token = jwt.sign(
            {
              user_id: user.user_id,
              username: user.username,
              email: user.email
            },
            process.env.SECRET,
            {
              expiresIn: 600
            }
          );

          return res.status(200).json({ token: token });
        });
      }
    }
  );
});

router.delete("/", (req, res) => {
  if (req.body.token === undefined) return res.sendStatus(400);

  db.query(
    `INSERT INTO tokens (token)
            SELECT '${req.body.token}'
            WHERE NOT EXISTS (
                SELECT 1 FROM tokens WHERE token = '${req.body.token}'
            )`,
    [],
    (err, response) => {
      if (err) res.sendStatus(500);
      else res.status(200).send("Token invalidated");
    }
  );
});

module.exports = router;
