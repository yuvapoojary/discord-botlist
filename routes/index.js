const router = require('express').Router();
const Bot = require('../models/Bot');

const tags = ["Music", "Moderation", "Fun", "Economy", "Web dashboard", "Logging", "Game", "Stream", "Security"];


router.get('/', async(req, res, next) => {
  
  const [voted, servers, certified] = await Promise.all([
    Bot.find({ approved: true, blacklist: false })
    .sort({ votes: -1 }).limit(5).lean(),
    Bot.find({ approved: true, blacklist: false }).sort({ server_count: -1 }).limit(5).lean(),
    Bot.find({ approved: true, certified: true, blacklist: false }).sort({ server_count: -1, votes: -1 }).lean()
  ]);
  
  res.render('index', {
    user: req.user,
    tags,
    voted,
    popular: servers,
    certified,
    promoted: [],
    _client: client
  });
  
});

router.use('/bots', require('./Bots'));

module.exports = router;