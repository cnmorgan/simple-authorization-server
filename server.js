const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//route variables
var users = require("./routes/users");
var login = require("./routes/login");
var token = require("./routes/token");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

app.use("/users", users);
app.use("/login", login);
app.use("/token", token);

app.listen(port, () =>
  console.log(`Authentication server listening on port ${port}`)
);
