const { client } = require("../bot.js");
const rr = require("request");
const { db } = require("../modules/database");
const settings = require("../config.json");

//Permission
const cc = (req, res, next) => {


  if (req.user) {

    if (settings.roles.owner.includes(req.user.id)) req.user.isOwner = true;
    if (
      settings.roles.admin.includes(req.user.id) ||
      settings.roles.owner.includes(req.user.id)
    ) req.user.isAdmin = true;
    if (
      settings.roles.mod.includes(req.user.id) ||
      settings.roles.owner.includes(req.user.id) ||
      settings.roles.admin.includes(req.user.id)
    ) req.user.isMod = true;
    res.locals.user = req.user;
    next();
  } else {
    res.locals.user = req.user;
    next();
  }
};

// Discord server Check
const server = (req, res, next) => {
  if (client.guilds.get(settings.guildID).members.has(req.user.id)) {
    next();
  } else {
    res.json({
      message: "You must be in the discord server to add bot"
    });
  }
};

//Auth Check
const auth = async (req, res, next) => {
  

  if (req.user) {
    next();
  } else {
    req.session.backURL = req.originalUrl
    res.redirect("/login");
  }
};

/// Discord User
function discord(id) {
  return new Promise(async (resolve, reject) => {
    rr(
      {
        url: `https://discordapp.com/api/v7/users/${id}`,
        headers: {
          Authorization: `Bot ${settings.token}`
        }
      },
      function (error, response, body) {
        if (error) return reject(new Error(error));
        else if (!error) {
          let r = JSON.parse(body);
          if (r.message == "Unknown User") {
            r.username = r.message;
            r.id = "0000000000000";
            r.avatar = "8e7a3b45df0652554623e538fb054bad";
            r.discriminator = "0000";
          }
          resolve(r);
        }
      }
    );
  });
}

//db function
function data(func, id, doc) {
  return new Promise(async (resolve, reject) => {
    let fun = ["set", "update", "delete", "bots", "get"];
    if (!fun.includes(func)) throw new Error("Only" + fun);
    if (func !== "bots") {
      if (!id) throw new Error("Need id and docs");
    }

    let bd;
    if (func == "bots") {
      bd = db.collection("bots");
    } else {
      bd = db.collection("bots").doc("" + id);
    }

    if (func == "set") {
      if (!doc) throw new Error("Need docd");

      try {
        await bd.get().then(q => {
          if (q.exists) {
            return reject("Already Exist");
          } else {
            bd.set(doc);
          }
        });
      } catch (r) {
        return reject(r);
      }
    }
    if (func == "get") {
      try {
        await bd.get().then(q => {
          resolve(q.data());
        });
      } catch (r) {
        reject(r);
      }
    }
    if (func == "update") {
      if (!doc) throw new Error("Need doc");
      try {
        await bd.update(doc);
      } catch (r) {
        return reject(r);
      }
    }
    if (func == "delete") {
      try {
        bd.delete();
      } catch (r) {
        return reject(r);
      }
    }
    if (func == "bots") {
      let am = [];
      try {
        await bd
          .where(id[0], id[1], id[2])
          .get()
          .then(q => {
            q.forEach(d => {
              am.push(d.data());
              resolve(am);
            });
          });
      } catch (r) {
        return reject(r);
      }
    }
  });
}

const perm = level => async (req, res, next) => {

  if (
    (level <= 4 && req.user.isOwner) ||
    (level <= 3 && req.user.isAdmin) ||
    (level <= 2 && req.user.isMod)
  ) {
    next();
  } else {
    res.json({ code: "0", message: "You dont have enough permission" });

  }
};

module.exports = { auth, server, cc, discord, data, perm };
