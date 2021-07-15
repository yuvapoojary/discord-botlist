const router = require('express').Router();
const Bot = require('../models/Bot');

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
  .lean();
  const countPromise = dataPromise;
  
  const [count, data] = await Promise.all([
    countPromise.countDocuments(),
    dataPromise.limit(limit)
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

module.exports = router;