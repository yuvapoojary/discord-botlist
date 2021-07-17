const { libs, tags, html, reasons_bc } = require("../modules/constants");
const { client, db, data } = require("../app");
const marked = require("marked");
const body = require("body-parser");
const fetch = require ("node-fetch");

const settings = client.config;
const request = require("request");
const string = require("randomstring");
const { ensureLoggedIn } = require("connect-ensure-login");

const x = require("express");
const router = x.Router();

// ADD

router.get("/add", client.c.server, async (req, res) => {
  res.render("bot/add", { user: req.user, libs, tags, title: "ADDBOT" });
});
//

router.post("/add", client.c.server, async (req, res, next) => {
  try {
    let cityRef = db.collection("bots").doc("" + req.body.client_id);
    let getDoc = cityRef.get().then(doc => {
      if (doc.exists) {
        return res.render("wrong", {
          message: "This bot already exists on bod"
        });
      }
    });

    let invite;
    if (req.body.invite == "") {
      invite = `https://discordapp.com/oauth2/authorize?client_id=${req.body.client_id}&scope=bot`;
    } else {
      invite = req.body.invite;
    }

    const rr = request(
      {
        url: `https://discordapp.com/api/v7/users/${req.body.client_id}`,
        headers: {
          Authorization: `Bot ${settings.token}`
        }
      },
      function (error, response, body) {
        if (error) return console.log(error.message);
        else if (!error) {
          let system = JSON.parse(body);

          if (!system.bot) {
            return res.render("wrong", {
              user: req.user,
              message: "This bot doesn't exists in discord or it is not a bot"
            });
          } else {
            let owners;
            if (req.body.owners == "") {
              owners = [req.user.id];
            } else {
              owners = [...new Set(req.body.owners.split(/\D+/g)), req.user.id];
            }

            let i = {
              id: req.body.client_id,
              name: system.username,
              discrim: system.discriminator,
              avatar: system.avatar,

              prefix: req.body.prefix,
              library: req.body.library,
              tags: req.body.tags,
              invite: invite,
              short_desc: req.body.short_desc,
              long_desc: req.body.long_desc,
              support_server: req.body.support,
              github: req.body.github,
              website: req.body.website,

              owner: req.user.id,
              owners: owners,
              approved: false,
              certified: false,
              blacklist: false,
              shards: 0,
              server_count: 0,
              views: 0,
              votes: 0,
              token: string.generate(30)
            };
            cityRef.set(i);
            client.z.emit("add", req, system);
            res.redirect(`/bots/${req.body.client_id}`);
          }
        }
      }
    );
  } catch (r) {
    if (r) {
      return res.render("wrong", { user: req.user, r });
    }
  }
});

// EDIT
router.get("/:Id/edit", async (req, res) => {
  let Id = req.params.Id;
  db.collection("bots")
    .doc(Id)
    .get()
    .then(q => {
      if (q.exists) {
        let ow = q.data().owners;
        if (ow.includes(req.user.id) || req.user.isOwner) {
          res.render("bot/edit.ejs", {
            title: "EDIT",
            user: req.user,
            libs,
            tags,
            bot: q.data()
          });
        } else {
          return res.json({
            code: "00",
            message: "Sorry you are not my owner"
          });
        }
      } else {
        res.render("wrong", { user: req.user, message: "Bot not found" });
      }
    });
});

router.post("/:Id/edit", async (req, res) => {
  let idd = req.params.Id;
  const boat = db.collection("bots").doc(idd);
  const doo = await boat.get();
  if (!doo || !doo.data()) return res.json({ error: "Uh this bot is not exists " });


  client.z.emit("edit", req, doo.data());

  let ow = doo.data().owners;

  const di = await fetch(`https://discordapp.com/api/v7/users/${doo.data().id}`, {method:'get',
    headers: {
      Authorization: `Bot ${settings.token}`
    }
  });
  const dp = await di.json()
  const u = dp;
  console.log(u);


  let owners;
  let vanity;
  let wh;
  let dwh;

  if (req.body.owners == "") {
    owners = [req.user.id];
  } else {
    owners = [...new Set(req.body.owners.split(/\D+/g)), req.user.id];
  };

  if (req.body.vanity == "") {
    vanity = null;
  } else if (req.body.vanity) {
    vanity = req.body.vanity.toLowerCase();
  };
  if (req.body.wh == "") {
    wh = null;
  } else if (req.body.wh) {
    wh = req.body.wh;
  };
  if (req.body.dwh == "") {
    dwh = null;
  } else if (req.body.dwh) {
    dwh = req.body.dwh;
  };


  try {
    boat.update({
      name: u.username,
      avatar: u.avatar,
      prefix: req.body.prefix,
      library: req.body.library,
      invite: req.body.invite,
      short_desc: req.body.short_desc,
      long_desc: req.body.long_desc,
      tags: req.body.tags,
      owners: owners,
      github: req.body.github,
      website: req.body.website,
      support_server: req.body.support,
      wh: wh,
      dwh: dwh
    });
    if (vanity) {
      const van = await db.collection("bots")
        .where("vanity", "==", vanity)
        .get();

      if (van.size == 0) {
        boat.set(
          {
            vanity: vanity
          },
          { merge: true }
        );
      }
    };

  } catch (r) {

    console.log(r.message);
    return res.render("wrong", {
      user: req.user,
      message: r.message
    });
  };
  res.redirect(`/bots/${idd}`);
});

router.get("/:Id/invite", async (req, res) => {
  let id = req.params.Id;
  let il = await db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q);
  let add = db.add.increment(1);
  db.collection("bot")
    .doc("stats")
    .update({
      invites: add
    });
  if (il.data() && il.data().invite != "") {
    res.redirect(il.data().invite);
  } else {
    res.redirect(
      `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot`
    );
  }
});
// DELETE
router.get("/:Id/delete", async (req, res) => {
  let id = req.params.Id;
  let u = await db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q.data().owners);

  let botn = await client.c.discord(id).then(m => m.username);
  if (u.includes(req.user.id) || req.user.isOwner) {
    res.render("bot/delete", { user: req.user, botn });
  } else {
    res.json({ code: "00", message: "Sorry ,you are not my owner" });
  }
});
router.post("/:Id/delete", async (req, res) => {
  let iddd = req.params.Id;
  try {
    let bin = await db
      .collection("bots")
      .doc(iddd)
      .get()
      .then(q => q.data());
    if (bin.owners.includes(req.user.id) || req.user.isOwner) {
      if (bin) {
        client.z.emit("delete", req, bin);
        db.collection("backup")
          .doc(iddd)
          .set(bin)
          .then(() => {
            db.collection("bots")
              .doc("" + iddd)
              .delete();
          });
        res.render("done", { user: req.user });
      } else {
        return res.json({ code: "00", message: "Sorry,you are not my owner" });
      }
    } else {
      return res.render("wrong", {
        user: req.user,
        message: "This bot doesn't exists"
      });
    }
  } catch (r) {
    return console.log(r);
  }
});

// certification
router.get("/certification", async (req, res) => {
  let am = [];
  await db
    .collection("bots")
    .where("owner", "==", req.user.id)
    .where("certified", "==", false)
    .get()
    .then(q => {
      q.forEach(bot => {
        am.push(bot.data());
      });
    });
  await res.render("bot/certification", {
    user: req.user,
    bot: am,
    title: "CERTIFICATION"
  });
});
router.post("/certification", async (req, res) => {
  let botid = req.body.cert;
  let dat = [];
  let d = await data("get", botid).then(d => d);
  if (req.user.id != d.owner) return res.status(404);
  if (d.server_count == 0) {
    dat.push("You bot must use servercount API .");
  }
  
  if (
    d.support_server == "" ||
    d.votes < 10 ||
    d.server_count == 0 ||
    d.server_count < 50 ||
    !d.long_desc.includes(html)
  )
    return res.render("staff/certi", { user: req.user, dat });

  data("update", botid, { certified: true }).catch(r => console.log(r));
  if (d && d.owners) {
    d.owners.map(p => {
      db.collection("users")
        .doc(p)
        .set(
          {
            certified: true
          },
          { merge: true }
        );
    });
  }

  client.z.emit("cert", req, d);
  res.redirect("/done");
});
////////

router.post("/:Id/vote", async (req, res) => {
  let id = req.params.Id;

  let user = req.user;
  let bm = "";
  let data;
  let tt;
  const gg = await db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q);
  if (gg && gg.data()) {
    data = gg.data();
    if (data.time && data.time[`${user.id}`]) {
      let time = new Date(data.time[`${user.id}`]);

      let date = new Date();
      time.setTime(time.getTime() + 86400000);
      tt = time;

      if (time <= date) {
        db.collection("bots")
          .doc(id)
          .update({
            [`time.${user.id}`]: `${new Date()}`,
            votes: db.add.increment(1)
          });
        bm = "You successfully voted this bot";
        res.send("50");

        client.z.emit("vote", req, data);
      } else {
        bm = "You already voted this bot.You can vote after 24 hours";
        res.send("100");
      }
    } else {
      db.collection("bots")
        .doc(id)
        .set(
          {
            time: {
              [`${user.id}`]: `${new Date()}`
            },
            votes: db.add.increment(1)
          },
          { merge: true }
        );
      bm = "You  successfully voted this bot";
      res.send("50");
      client.z.emit("vote", req, data);
    }

  } else {
    return res.render("404", { user: req.user });
  }
});
router.get("/:Id/report", async (req, res) => {
  let id = req.params.Id;
  const bot = await db
    .collection("bots")
    .doc(id)
    .get()
    .then(q => q);
  res.render("report", { user: req.user, bot: bot.data(), rs: reasons_bc });
});

router.post("/:Id/report", async (req, res) => {
  let id = req.params.Id;
  let r1 = req.body.r1;
  let r2 = req.body.r2;
  let reason;
  if (r1 == "") {
    reason = r2;
  } else {
    reason = r1 + " and " + r2;
  }

  console.log(reason);
  res.redirect(`/bots/${id}`);

  client.z.emit("report", req, reason, id);
});

module.exports = router;
