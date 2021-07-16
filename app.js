require('dotenv').config();

const express = require("express");
const url = require("url");
const event = require("events");
const mongoose = require('mongoose');
const config = require('./config');
const flash = require('connect-flash');
const flashexpress = require('flash-express');
const session = require('express-session');
const logger = require("morgan");
const { ensureLoggedIn } = require("connect-ensure-login");
const compress = require("compression");
const bodyParser = require("body-parser");
const minifyHTML = require("express-minify-html");
const helmet = require('helmet');
const client = require('./bot');

const port = process.env.PORT || config.port;
global.client = client;

const app = express();

mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('debug', true);


app.set('view engine', 'ejs');

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    name: "_session",
    secret: config.secret,
    cookie: {
      maxAge: Date.now() + 30 * 86400 * 1000,
      expires: Date.now() + 30 * 86400 * 1000,
      httpOnly: false
    },
  })
);

app.use([
  compress(),
  express.static('static'),
  express.json(),
]);

app.use((req, res, next) => {
  const user = req.session && req.session.user;
  res.locals.user = user;
  req.user = user;
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/", require("./routes"));

app.use((req, res) => {
  res.status(404).render("404", { user: req.user });
});

app.use((err, req, res, next) => {

  res.locals.message = err.message;
  console.error(err);

  res.status(err.status || 500).render("wrong", {
    title: "Error",
    status: err.status,
    message: err.message
  });

});

app.listen(port, () => console.log(`Listening on port ${port}.`));

module.exports = app;