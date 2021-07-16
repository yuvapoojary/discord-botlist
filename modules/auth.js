const config = require('../config');

const permLevels = {
  3: 'owner',
  2: 'approver',
  1: 'user'
};

const perm = (level) => (req, res, next) => {
  
  if(!req.user) {
    req.session.backURL = req.originalUrl;
    res.redirect('/login');
  };
  
  if(!level) return next();
  if(req.user[permLevels[level]]) return next();
  res.json({ message: 'You do not have permission to access this page' });
  
};

const serverCheck = (req, res, next) => {
  perm()(req, res, function() {
    if(client.users.cache.has(req.user.id)) return next();
    res.json({
      message: 'You must be in discord server to add bot'
    });
  });
};

module.exports = { perm, serverCheck };