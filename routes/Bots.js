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


router.post('/', auth.serverCheck, (req, res, next) => {
  res.send(200);
});

router.get('/add', auth.serverCheck, (req, res, next) => {
  res.render('bot/add', {
    libs,
    tags
  });
});

module.exports = router;