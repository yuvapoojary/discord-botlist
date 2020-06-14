const x = require("express");
let m = {error: "You don't have enough permission"};
const { reasons_bc, reasons_deny } = require("../modules/constants");
let router = x.Router();
const { client, data,db} = require("../app.js");

router.get("/queue", async (req, res) => {
  if(!req. user. isMod) return res. json (m);
  
  let ar2 = []
const d = await db.collection("bots").where("approved", "==", false).get().then(q => {
   q.forEach(m => { const data = m.data()
  let id = data.id;
  
  ar2.push(data);
    
                  
            
                  }  
            )})
  res.render("staff/queue", { user: req.user, dat: ar2,_client:client });
});
router.get("/:Id/uncertify", async (req, res) => {
  if(!req. user.isAdmin) return res. render (m);
  let id = req.params.Id;
  let botn = await client.c.discord(id).then(b => b.username);
  res.render("staff/unblacklist", { user: res.user,reasons_deny:[], botn,type:"Uncertify" });
});

router.post("/:Id/uncertify", (req, res) => {
  if(!req. user. isAdmin) return res. render (m);
  client.c.data("update", req.params.Id, { certified: false });
client.z. emit ("uncertify",req)
  res.redirect(`/bots/${req.params.Id}`);
});

router.get("/:Id/approve", async (req, res) => {
  if(!req. user. isMod) return res. render (m);
  let id = req.params.Id;
  let botn = await client.c.discord(id).then(g => g.username);
  res.render("staff/approve", { user: req.user, botn,type:"Approve" });
});

router.post("/:Id/approve", (req, res) => {
  if(!req. user. isMod) return res. json (m);
  db. collection("bot").doc("stats").set({
    bots: db.add.increment(1)
  },{merge:true});
  let id = req.params.Id;
  client.c.data("update", id, { approved: true });
  client.z. emit ("approve",req);
  res.redirect(`/bots/${id}`);
});

router.get("/:Id/blacklist",async (req, res) => {
  if(!req. user.isAdmin) return res. json(m);
  let id = req.params.Id;

  let botn = await client.c.discord(id).then(q => q.username);
  res.render("staff/unblacklist", { user: req.user, botn, reasons_deny: reasons_bc,type:"Blacklist" });
});

router.post("/:Id/blacklist", (req, res) => {
  if(!req. user. isAdmin) return res. json (m);
  let id = req.params.Id;
  let rs1 = req.body.reason1;
  let rs2 = req.body.reason2;
  client.c.data("update", id, { blacklist: true });
  res.redirect(`/bots/${id}`);
  let reasons;
  if (rs1) {
    reasons = rs2 + " and " + rs1;
  } else {
    reasons = rs2;
  }
  client.z.emit("blacklist",req,reasons);
});

router.get("/:Id/deny", async (req, res) => {
  if(!req. user. isMod) return res. json (m);
  let id = req.params.Id;
  let botn = await client.c.discord(id).then(q => q.username);
  res.render("staff/unblacklist", { user: req.user, botn, reasons_deny,type:"Deny" });
});
router.post("/:Id/deny", async (req, res) => {
  if(!req. user.isMod) return res. json (m);
  db. collection ("bot").doc("stats"). update ({
    bots: db.add.increment(-1)
  })
  let id = req.params.Id;
  let rs1 = req.body.reason1;
  let rs2 = req.body.reason2;
  let reasons;
  if (rs1) {
    reasons = rs2 + "and" + rs1;
  } else {
    reasons = rs2;
  }
  let bup = await client.db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q.data());
  if (bup) {
    client.z.emit("deny",req,reasons,bup.owners);
    client.db
      .collection("backup")
      .doc(id)
      .set(bup)
      .then(() => {
        client.db
          .collection("bots")
          .doc(id)
          .delete();
      });

    res.redirect("/bots");
    
  } else {
    res.render("wrong", { user: req.user, message: "This bot doesn't exists" });
  }
});

router.get("/blacklisted", async (req, res) => {
  
  if(!req.user.isMod) return res. json (m);
  let ar2 = []
const d = await db.collection("bots").where("blacklist","==",true).get().then(q => {
   q.forEach(m => { let data = m.data()
  let id = data.id;
  
  ar2.push(data);
      }  
            )})

  res.render("staff/bc", { user: req.user, dat:ar2,_client:client });
});

router.get("/:Id/unblacklist", async (req, res) => {
  if(!req. user. isAdmin) return res. json (m);
  let id = req.params.Id;

  let botn = await client.c.discord(id).then(q => q.username);
  res.render("staff/approve", { user: req.user, botn, reasons_bc ,type:"Unblacklist"});
});

router.post("/:Id/unblacklist",(req, res) => {
  if(!req.user. isAdmin) return res. json (m);
  let id = req.params.Id;
  
  client.c.data("update", id, { blacklist: false });
  res.redirect(`/bots/${id}`);
  
  client.z. emit ("unblacklist",req);
});

module.exports = router;
