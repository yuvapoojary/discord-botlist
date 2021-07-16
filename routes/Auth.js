const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

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

router.get('/login', passport.authenticate('discord'));

router.get('/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), (req, res, next) => {
  
  const user = req.user;
  
  User.findOne({ id: user.id })
  .then((data) => {
    if(!data) {
      data = new User({
        id: user.id,
        name: user.username,
        tag: user.discriminator,
        avatar: user.avatar
      });
    } else {
      data.name = user.username;
      data.tag = user.discriminator;
      data.avatar = user.avatar;
    };
    
    data.save((err, doc) => {
      if(err) return next(err);
      if(req.session.backURL) return res.redirect(req.session.backURL);
      res.redirect('/');
    });
  })
  .catch(next);
  
});

router.get('/logout', (req, res, next) => {
  
  delete req.session && req.session.backURL;
  req.session.destroy(() => {
    res.redirect('/');
  });
  
});

module.exports = router;
