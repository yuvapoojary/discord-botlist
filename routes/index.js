const x = require("express");
const gg = require("html2svg");
const path = require("path");
const cor = require("cors");
const router = x.Router();
const { algolia } = require("../config.json");
const al = require ("algoliasearch")(algolia.applicationId,algolia.apiKey)
const { db, client } = require("../app.js");
const ejs = require("ejs");
//const webshot = require("webshot");
router.get("/done", (req, res) => {
  res.render("done", { user: req.user })
});
router. get ("/bot/:Id/vote", async(req,res) => {
  const bh = await db. collection ("bots").doc(req.params.Id).get();
if(bh && bh.data()) {
res.render("bot/vote",{user:req.user,doc:bh.data(),bot:bh.data()});
} else {
res.render("404",{user:req.user});
};
  });
router. get ("/vote/:Id",(req,res) => {
res.redirect(`/bot/${req.params.Id}/vote`);
});
////////////////)//))/////////////))))))
router.get("/bots", async (req, res) => {
  let arz = [];
const ip = await  db. collection ("bots").orderBy("votes","desc").get();
  ip. forEach(async z => {
    const data = z.data();
    const ob = {
      name: data. name,
      objectID:data.id,
      id:data.id,
      discrim: data.discrim,
      avatar: data.avatar,
      prefix: data.prefix,
      library: data.library,
      short_desc: data.short_desc,
       votes: data.votes,
      server_count: data.server_count,
      views: data.views,
      owner: data.owner,
      certified: data.certified,
      support: data.support_server,
      tags: data.tags,
      invite: data.invite,
    }
 await arz.push (ob)
  });
  const index = al.initIndex("bots");
await index.saveObjects(arz).catch(r => console.log(r));

  let q;
  let size;
  let bot = [];
  if (req.query.q) {
    q = req.query.q.toLowerCase();
   const rz = await index. search (q,{
      });
  bot = rz. hits;
    size = bot. length;

    
  } else {
    q = "";
    size = arz. length;
    bot = arz;
  }
  let
    pageSize = 8,
    pageCount = Math.ceil(bot.length / pageSize),
    currentPage = 1,
    students = bot,
    studentsArrays = [],
    studentsList = [];


  for (var i = 1; i < bot.length; i++) {

  }
  while (students.length > 0) {
    studentsArrays.push(students.splice(0, pageSize));
  }
  if (typeof req.query.page !== 'undefined') {
    if (req.query.page > pageCount) {
      currentPage = +pageCount
    } else {
      currentPage = +req.query.page;
    }
  }
  studentsList = studentsArrays[+currentPage - 1];
  res.status(200).render("bots", { totalStudents: bot.length, currentPage, students: studentsList, pageCount, pageSize, _client: client, query: q, user: req.user, size,title:"BOTS" });
});

/////////////////////////////////////////

router.get("/", async (req, res) => {
  let bot = [];
  let promoted = [];
  let tags = ["Music", "Moderation", "Fun", "Economy", "Web dashboard", "Logging", "Game", "Stream", "Security"];
  await db.collection("bots").get().then(q => {
    q.forEach(m => { bot.push(m.data()) })
  });
  res.render("index", { user: req.user, _client: client, bot, promoted, tags });
})










/////////////////////////)/////////////////




router.get('/wid.png', async (req, res) => {

  res.set("X-Frame-Options", "sameorgin");
  const hex = /^[a-f0-9]{6}$/i;
  const backgroundColor = hex.test(req.query.background) ? req.query.background : '252525';
  const textColor = hex.test(req.query.text) ? req.query.text : 'ffffff';
  const height = req.query.height ? req.query.height : '250';
  res.set('Content-Type', 'image/png');
  ejs.renderFile('views/wide.ejs', { colors: { background: backgroundColor, text: textColor } }, (err, html) => {
    if (err) throw err;
    //webshot(html, undefined, { siteType: 'html', windowSize: { width: '400', height: height } }).pipe(res);
  });
});
router.get('/wid.svg', async (req, res) => {
  res.set("Content-Type", "image/svg+xml");

  ejs.renderFile("../views/svg.ejs");
});


module.exports = router;
