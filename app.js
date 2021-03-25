require("./modules/user.js");

require('dotenv/config');
const express = require("express");
const url = require("url");
const event = require("events");
const { client } = require("./bot");
client.once("ready", () => {
  client.z = new event();


  const user = require("./modules/user");
  client.c = user;
  const data = (client.data = user.data);
  exports.data = data;
  const flash = require("connect-flash");

  const ll = require("./modules/database");
  const db = ll.db;

  client.db = db;
  const fir = ll.fir;
  const session = require("express-session");
  const firing = require("connect-session-firebase")(session);
  const passport = require("passport");
  const Strategy = require("passport-discord").Strategy;
  const logger = require("morgan");
  const { ensureLoggedIn } = require("connect-ensure-login");
  const compress = require("compression");
  const bodyParser = require("body-parser");
  const config = require("./config");
  client.config = config;
  const minifyHTML = require("express-minify-html");
  const port = process.env.PORT;
  require("./bot.js");
  const app = express();
  // const client = require("./bot");
  exports.client = client;
  exports.app = app;
  exports.db = db;
  const fla = require("flash-express");

  app.use(require("helmet")());
  app.set("view engine", "ejs");

  app.use(logger("dev"));

  app.use(compress());
  app.use(
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
    })
  );

  app.use(express.static("static"));
  app.use(express.json());
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  require("./events.js");
  app.use(
    session({
      saveUninitialized: false,
      resave: false,
      name: "_session",
      secret: "zqzhhqhhhahbabbababahhahahhahuu71",
      cookie: {
        maxAge: Date.now() + 30 * 86400 * 1000,
        expires: Date.now() + 30 * 86400 * 1000,
        httpOnly: false
      },

      store: new firing({
        database: fir.database()
      })
    })
  );
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use("/api", require("./routes/API.js"));

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
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ["identify"]
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );

  app.locals.domain = "https://www.b-o-d.cf";
  app.get(
    "/login",
    (req, res, next) => {
      next();
    },
    passport.authenticate("discord")
  );

  app.get(
    "/callback",
    passport.authenticate("discord", {
      failureRedirect: "/"
    }),
    (req, res) => {
      if (req.user) {
        if (client.config.roles.owner.includes(req.user.id)) req.user.isOwner = true;
        if (client.config.roles.admin.includes(req.user.id)) req.user.isAdmin = true;
        if (client.config.roles.mod.includes(req.user.id)) req.user.isMod = true;
        let user = req.user;

        let jg = db.collection("users").doc(user.id);
        jg.get().then(q => {
          if (q.exists) {
            jg.update({
              id: user.id,
              name: user.username,
              tag: user.discriminator,
              avatar: user.avatar
            });
          } else {
            db.collection("bot")
              .doc("stats")
              .update({
                users: db.add.increment(1)
              });
            jg.set({
              id: user.id,
              name: user.username,
              tag: user.discriminator,
              avatar: user.avatar,
              desc: "This user has a mysterious future.",
              github: "",
              website: "",
              certified: false
            });
          }
        });
      }

      if (req.session.backURL) {
        res.redirect(req.session.backURL);
      } else {
        res.redirect("/");
      }
    }
  );
  app.get("/logout", (req, res) => {
    if (req.session.backURL) {
      delete req.session.backURL;
    }

    req.session.destroy(() => {
      req.logout;
      res.redirect("/");
    });
  });
  let router = express.Router();
  exports.router = router;
  app.use((req, res, next) => {
    client.z.emit("req", req);
    next();
  });
  app.use("/", require("./routes/index"));
  app.use("/api", require("./routes/api.js"));
  app.use("/user", require("./routes/user"));
  app.use("/bots", require("./routes/bots"));
  app.use("/bot", client.c.auth, require("./routes/bot"));
  app.use(user.cc);
  app.use("/staff", client.c.auth, require("./routes/staff"));

  app.use((req, res) => {
    res.status(404).render("404", { user: req.user });
  });

  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    console.log(err.message);
    client.channels.get("686998028363759624").send(err.message);
    res.render("wrong", {
      title: "Error",
      status: err.status,
      message: err.message
    });
  });

  app.listen(port, () => console.log(`Listening on port ${port}.`));
  ///   //// ///// /////

  const { error, owner } = process.env;
/**
  process.on("uncaughtException", err => {
    console.error(err);
    client.channels.get(error).send(`<@${owner}> There was an uncaught error, ${err}`);
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    await client.channels.get(error).send(`<@${owner}> Error at: ${promise} \n ${reason}`);
  });
**/
});


