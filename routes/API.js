const r = require("express");
const path = require("path");
const j = require("ejs");
const router = r.Router();
const { db, client } = require("../app.js");

router.post("/bots/stats", async (req, res) => {
  let data;

let server = req.body.server_count;
  let shard = 0;
 if(req.body.shard_count) {
   shard = req. body. shard_count;
   };



  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(400);
  } else {
    await db
      .collection("bots")
      .where("token", "==", token)
      .get()
      .then(q => {
        q.forEach(m => {
          data = m.data();
        });
      });

    if (data && server) {
      db.collection("bots")
        .doc(data.id)
        .update({
          server_count: server,
        shards: shard
        });
      
      res.json({ BOD: `[${data.name}] Successfully posted` });
    } else {
      res.status(401).json({ BOD: "Invalid API token" });
    }
  }
});

router.get("/bots/:Id/stats", async (req, res) => {
  let id = req.params.Id;
  let status;
  if (client.users.has(id)) {
    status = client.users.get(id).presence.status;
  } else {
    status = "offline";
  }
  res.set("Content-Type", "application/json");

  const data = await db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q.data());
  if (data) {
    res.json({
      Name: data.name,
      Id: data.id,
      Discriminator: data.discrim,
      Avatar: data.avatar,
      Prefix: data.prefix,
      Library: data.library,
      Description: data.short_desc,
      Votes: data.votes,
      Servers: data.server_count,
      Views: data.views,
      Owner_Id: data.owner,
      Certified: data.certified,
      Support_server: data.support_server,
      Tags: data.tags,
      Invite_URL: data.invite,
      Status: status
    });
  } else {
    res.json({ code: "00", message: "Bot couldn't be found" });
  }
});

router.get("/users/:Id", async (req, res) => {
  let id = req.params.Id;
  const data = await db
    .collection("users")
    .doc(id)
    .get()
    .then(q => q.data());
  res.set("Content-type", "application/json");
  if (data) {
    res.json(data);
  } else {
    res.json({ code: "00", message: "User couldn't be found" });
  }
});

router.get("/:Id/status.svg", async (req, res) => {
  let id = req.params.Id;
  let status;
  if (client.users.has(id)) {
    if(client.users.get(id).presence.status === "offline") {
      status = "down"
    } else {
      status = "up"
    }
  } else {
    status = "404";
  }
  
  res.set("X-Frame-Options", "sameorgin");
  res.set("Content-Type", "image/svg+xml");
  j.renderFile("views/cdn/status.ejs", { status }, (err, html) => {
    console.log(err);
    res.send(html)
  });
});


router.get("/:Id/servers.svg",async(req,res) => {
  let id = req.params.Id;
  let servers;
  let color;
  if(req.query.color) {
    color = req.query.color;
  } else {
    color = "4c1"
  };
  const data = await db.collection("bots").doc(id).get().then(q => q);
  if(data && data.data()) {
  
    
let beautify=n=>((Math.log10(n)/3|0)==0)?n:Number((n/Math.pow(10,(Math.log10(n)/3|0)*3)).toFixed(1))+["","K","M","B","T",][Math.log10(n)/3|0];
servers = beautify(data.data().server_count);

  } else {
    servers = "invalid"
  };
  
  j.renderFile("/app/views/cdn/servers.ejs",{servers,color},(err,html) => {
    if(err) return res.render("404",{user:req.user});
    res.set("Content-Type","image/svg+xml");
    
    res.send(html);
  });
});

module.exports = router;
