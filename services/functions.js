var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
var db = require("../services/db");
dotenv.config();

function authenticateToken(req, res, next) {
  //get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === undefined) return res.sendStatus(401);

  //check that refresh token is not in list of blacklisted tokens
  db.query(
    `SELECT * FROM tokens WHERE token = '${token}'`,
    [],
    (err, response) => {
      if (response.rows.length > 0) {
        return res.sendStatus(403);
      }
    }
  );

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken: authenticateToken
};
