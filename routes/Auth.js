const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/login', passport.authenticate('discord'));

router.get('/callback', passport.authenticate('discord'), (req, res, next) => {
  
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
