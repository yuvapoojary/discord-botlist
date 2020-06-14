const x = require("express");
const router = x.Router();
const { db, client } = require("../app.js");

router.get("/:Id", async (req, res) => {
  if(!req. user) res.redirect("/login");
  let id = req.params.Id;
  let pf = await db
    .collection("users")
    .doc(id)
    .get()
    .then(q => q.data());
  let dat = [];
  let op = await db.collection("bots"). where ("owner","==",id).get().then(q => { q.forEach(g => {
    dat. push (g.data());
    
  })});
  
  let profile = await client.c.discord(id).then(q => q);
  if (pf) {
    res.render("profile", { user: req.user, profile, pf,dat,_client:client });
  } else {
    res.status(404).render("404",{user:req.user});
  }
});
router.post("/:Id", async (req, res) => {
  let id = req.params.Id;
  db.collection("users")
    .doc(id)
    .update({
      desc: req.body.desc,
      github: req.body.github,
      website: req.body.website
    });
  res.redirect(`/user/${id}`);
});

module.exports = router;
