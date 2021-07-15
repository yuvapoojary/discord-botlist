const x = require("express");
let me = [];
const router = x.Router();
const marked = require("marked");

const { db, client, data } = require("../app");

router.get("/hhh", async (req, res) => {
  let ar2 = [];
  const d = await db
    .collection("bots")
    .where("approved", "==", true).orderBy("votes","desc")
    .get()
    .then(q => {
      q.forEach(m => {
        const data = m.data();
        let id = data.id;

        ar2.push(data);
      });


});
  });


router.get("/:Id", async (req, res) => {
  let id = req.params.Id.toLowerCase();
  let owners = [];
  let vt;
  
  db.collection("bot")
    .doc("stats")
    .update({
      views: db.add.increment(1)
    });
  let bot = await db.collection("bots").doc(id).get ().then(q => q);
  if(bot.data() && bot.data().vanity) return res.redirect(`/bots/${bot.data().vanity}`);
  if(!bot.data()) {
  
  await db. collection("bots").where("vanity","==",id).get(). then (q => {
    q. forEach(m => {
      if(m && m.data()) {
        bot = m;
      
      } else {
        return res.status(404).render("404",{user:req.user});
      }
               })
  })
      
    };
      if(bot && bot.data() ) {
  let status;
  if (client.users.has(bot. data().id) == true) {
    status = client.users.get(bot.data().id).presence.status;
  } else {
    status = "offline";
  }
  let desc = await marked(bot.data().long_desc);

  await client.c.discord(bot.data().owner).then(m => {
    owners.push(m);
    
  });
  
  res.render("bot/view", {
    title:bot.data(). name,
    user: req.user,
    bot: bot.data(),
    desc,
    owners,
    status
  });
      } else {
        return res.render("404",{user:req.user});
      }

});

router. post("/:Id/vanity",async(req,res) => {
  let id = req.params.Id; 
  let url = req. query.q.toLowerCase()
  db. collection("bots"). where("vanity","==",url).get().then(q => {
   if(q. size == 0 && url.length >= 3) {
     res. send ("available");
   };
    if(q. size >= 1) {
     res. send ("exists");
   };
    if(url. length < 2) {
      res. send ("short");
    };
    
    
    
  });
});

module.exports = router;
