const router = require('express').Router();
const Bot = require('../models/Bot');
const auth = require('../modules/auth');
const { tags, libs } = require('../modules/constants');

// Bot list
router.get('/', async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  let limit = 10,
    offset = ((page * limit) - limit);

  const query = {
    approved: true
  };
  if (req.query.q) query.name = new RegExp(req.query.q, 'i');

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
    q: req.query.q || null
  });

});


// Add Bot
router.post('/', auth.serverCheck, async (req, res, next) => {

  try {
    const info = await client.users.fetch(req.body.id);
    if (!info) return res.send('Invalid bot id');
    if (!info.bot) return res.send('Id is not a bot id');

    const bot = new Bot({
      ...info,
      name: info.username,
      tag: `${info.username}#${info.discriminator}`,
      short_desc: req.body.short_desc,
      long_desc: req.body.long_desc,
      tags: req.body.tags,
      library: req.body.library,
      prefix: req.body.prefix,
      invite_link: req.body.invite_link || `https://discordapp.com/oauth2/authorize?client_id=${info.id}&scope=bot`,
      owner: req.user.id,
      owners: req.body.owners.split(',').concat([req.user.id]),
    });

    if (req.body.support_server) bot.support_server = req.body.support_server;
    if (req.body.website) bot.website = req.body.website;
    if (req.body.github) bot.github = req.body.github;


    bot.save((err, data) => {
      if (err) return next(err);
      res.redirect('/bots');
    });

  } catch (err) {
    res.send(err.message);
  };

});


// Add Bot Template
router.get('/add', auth.serverCheck, (req, res, next) => {
  res.render('bot/add', {
    libs,
    tags
  });
});

router.get('/certification', auth.perm(), (req, res, next) => {

  Bot.find({ owner: req.user.id })
    .lean()
    .then((data) => {
      res.render('bot/certification', {
        data
      });
    })
    .catch(next);

});

router.post('/certification', auth.perm(), (req, res, next) => {

  Bot.findOne({ id: req.body.id, owner: req.user.id })
    .then((data) => {
      if (!data) return res.render('404');
      const errors = [];
      if (data.server_count == 0) errors.push('You must post your server count through our API');
      if (!data.support_server) errors.push("You must add support server");
      if (data.votes < 10) errors.push("Your bot must have atleast 10 votes");
      if (data.server_count < 50) errors.push("Your bot must be in atleast 50 servers");
      
      if(errors.length) return res.render('staff/certi', { data, errors });
      
      data.certified = true;
      data.save((err) => {
        if(err) return next(err);
        emit('botCertified', data, req.user);
        res.redirect(`/bots/${data.id}`);
      });
      
    })
    .catch(next);

});

router.get('/:id', (req, res, next) => {

  Bot.findOne({
      $or: [
        { id: req.params.id },
        { vanity_url: req.params.id }
    ]
    })
    .lean()
    .then((data) => {
      if (!data) return res.status(404).render('404');
      const bot = client.users.cache.get(data.id);
      res.render('bot/view', {
        data,
        status: (bot && bot.presence) ? bot.presence.status : 'offline'
      });
      emit('botView', data, req.user);
    })
    .catch(next);

});

router.get('/:id/invite', (req, res, next) => {

  Bot.findOne({ id: req.params.id })
    .lean()
    .then((data) => {
      if (!data) return res.render('404');
      res.redirect(data.invite_url);
      emit('botInvite', data, req.user);
    })
    .catch(next);

});


router.get('/:id/vote', auth.perm(), (req, res, next) => {

  Bot.findOne({ id: req.params.id })
    .lean()
    .then((data) => {
      if (!data) return res.render('404');
      res.render('bot/vote', {
        data
      });
      emit('botVote', data, req.user);
    })
    .catch(next);

});

router.get('/:id/edit', auth.perm(), (req, res, next) => {

  Bot.findOne({ id: req.params.id })
    .lean()
    .then((data) => {
      if (!data) return res.render('404');
      if (data.owner != req.user.id && !data.owners.includes(req.user.id)) return res.send('You do not have permission to edit the bot');
      res.render('bot/edit', {
        data,
        libs,
        tags
      });
    })
    .catch(next);

});


router.post('/:id/edit', auth.perm(), (req, res, next) => {

  const fields = ['prefix', 'short_desc', 'long_desc', 'tags', 'library', 'support_server', 'github', 'website', 'owners', 'invite_link'];

  Bot.findOne({ id: req.params.id })
    .then(async (data) => {
      if (!data) return res.render('404');
      if (data.owner != req.user.id && !data.owners.includes(req.user.id)) return res.send('You do not have permission to edit bot');
      for (const key of fields) {
        data[key] = req.body[key];
      };
      const bot = await client.users.fetch(data.id);
      data.name = bot.username;
      data.avatar = bot.avatar;

      data.save((err, doc) => {
        if (err) return next(err);
        res.redirect(`/bots/${data.id}`);
      });
    })
    .catch(next);

});

router.get('/:id/delete', auth.perm(), (req, res, next) => {

  Bot.findOne({ id: req.params.id })
    .then((data) => {
      if (!data) return res.render('404');
      if (data.owner != req.user.id && !data.owners.includes(req.user.id)) return res.send('You do not have permission to delete bot');
      res.render('bot/delete', {
        data
      });
    })
    .catch(next);

});

router.post('/:id/delete', auth.perm(), (req, res, next) => {

  Bot.findOne({ id: req.params.id })
    .then(async (data) => {
      if (!data) return res.render('404');
      if (data.owner != req.user.id && !data.owners.includes(req.user.id)) return res.send('You do not have permission to delete bot');
      await data.remove();
      res.redirect('/');
    })
    .catch(next);

});


module.exports = router;