require('dotenv').config();

const express = require("express");
const url = require("url");
const event = require("events");
const mongoose = require('mongoose');
const config = require('./config');
const flash = require('connect-flash');
const flashexpress = require('flash-express');
const session = require('express-session');
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const logger = require("morgan");
const { ensureLoggedIn } = require("connect-ensure-login");
const compress = require("compression");
const bodyParser = require("body-parser");
const minifyHTML = require("express-minify-html");
const helmet = require('helmet');
const client = require('./bot');

const port = config.port || process.env.PORT;
global.client = client;

const app = express();

console.log(process.env);

mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('debug', true);

app.use([
  helmet(),
  logger('dev'),
  compress(),
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true
    }
  }),
  express.static('static'),
  express.json()
]);

app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

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

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new Strategy(
    {
      clientID: config.bot_clientId,
      clientSecret: config.bot_clientSecret,
      callbackURL: config.bot_callbackURL,
      scope: ["identify"]
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
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