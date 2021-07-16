const router = require('express').Router();
const Bot = require('../models/Bot');
const auth = require('../modules/auth');
const { tags, libs } = require('../modules/constants');

router.get('/', async(req, res, next) => {
  
  const page = parseInt(req.query.page) || 1;
  let limit = 10, offset = ((page * limit) - limit);
  
  const query = {
    approved: true
  };
  if(req.query.q) query.name = new RegExp(req.query.q, 'i');
  
  const dataPromise = Bot.find(query)
  .sort({ name: 1 })
  .skip(offset)
  .lean()
  .limit(limit);
  const countPromise = Bot.find(query)
  .skip(offset)
  .lean()
  .countDocuments();
  
  const [count, data] = await Promise.all([
    countPromise,
    dataPromise
  ]);
 
  const totalPages = Math.ceil(count / limit);
  
  res.render('bots', {
    user: req.user,
    totalCount: count,
    totalPages,
    data,
    currentPage: page,
    q: req.query.q  || null
  });
  
});


router.post('/', auth.serverCheck, async(req, res, next) => {
  
  const info = await client.users.fetch(req.body.id);
  if(!info) return res.send('Invalid bot id');
  if(!info.bot) return res.send('Id is not a bot id');
  
  const bot = new Bot({
    ...req.body,
    ...info
  });
  
  bot.save((err, data) => {
    if(err) return next(err);
    res.redirect('/bots');
  });
  
});

router.get('/add', auth.serverCheck, (req, res, next) => {
  res.render('bot/add', {
    libs,
    tags
  });
});

module.exports = router;