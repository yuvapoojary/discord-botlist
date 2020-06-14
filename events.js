const { db, client } = require("./app.js");
const { RichEmbed } = require("discord.js");
const m = client.z;
const fetch = require("node-fetch");
const guildId = process.env.guildId;
const p = require("./config.json");
const ch = p.channels.weblog;
let btr = p.roles.botlist;
let br = p.roles.bot_developer;
let ctr = p.roles.certified_bot;
let cr = p.roles.certified_developer;
const rol = p.roles;
m.on("req", req => {


  let content = new RichEmbed()
    .setColor("RANDOM")
    .setTitle(req.method)
    .addField("Path", "\` " + req.path + "\`")
    .addField("Agent", "\` " + req.headers["user-agent"] + " \`")
    .setTimestamp()
  if(req. user) {
    content. addField ("User","\` "+req.user.username+"\` ")
    };
  if (process.env.log) {
    client.guilds.get(process.env.guild).channels.get(process.env.log).send(content);
  }
});

//////
async function bot(req, act, color, reason) {
  let embed;
  try {
    const ar = await db.collection("bots").doc(req.params.Id).get()
      .then(q => q.data());
    if (ar) {
      if (act === "APPROVED") {
        add(ar.id, btr);
      };

      if (act === "UNCERTIFIED") {
        remove(ar.id, ctr);
      };
      ar.owners.map(g => {

        if (client.users.has(g)) {
          if (act === "APPROVED") {
            add(g, br);
          };

          let user = client.users.get(g);
          embed = new RichEmbed()
            .setTitle(act)
            .setColor("#" + color)
            .setTimestamp()
            .addField("Bot Name", ar.name)
            .addField("Owner", `<@${ar.owner}>`)
            .addField("Mod", `<@${req.user.id}>`)
          if (reason) {
            embed.addField("Reason", reason)
          }
          embed.addField("Link", `[Here](https://b-o-d.cf/bots/${ar.id})`);
          user.send(embed);
        };
      })
    };
    let c = await client.guilds.get(guildId).channels.get(client.config.channels.weblog);
    c.send(embed);
  } catch (m) {
    console.log(m);
  }
};
////////////

////////
async function add(id, role) {
  try {
    let n = client.guilds.get(guildId).members.get(id);
    if (n) {
      n.addRole(role);
    };
  } catch (r) {
    console.log(r);
  }
};

async function remove(id, role) {
  try {
    let n = client.guilds.get(guildId).members.get(id);
    if (n & n.roles.has(role)) {
      remove(id, role);
    };


  } catch (r) {
    console.log(r);
  }
};


m.on("approve", async (req) => {
  bot(req, "APPROVED", "00ff00");

});

m.on("deny", (req, reason) => {
  bot(req, "DENIED", "ff0000", reason)
});

m.on("blacklist", (req, reason) => {
  bot(req, "BLACKLISTED", "ff0000", reason)
});

m.on("unblacklist", (req) => {
  bot(req, "UNBLACKLISTED", "00FF00")
});


m.on("uncertify", (req, reason) => {
  bot(req, "UNCERTIFIED", "ff0000", reason)
});


///////////

m.on("add", (req, bot) => {

  let bm = new RichEmbed()
    .setColor("#00ccff")
    .setDescription(` \`${bot.username}\` has been added by <@${req.user.id}> `)
    .setTimestamp()
  if (client.users.has(req.user.id)) {
    client.users.get(req.user.id).send(bm);
  };
  client.guilds.get(guildId).channels.get(ch).send(bm)

});




m.on("edit", (req, root) => {

  let hm = new RichEmbed()
    .setColor("#ffff00")
    .setDescription(`**\` ${root.name} \` ** has been edited by <@${req.user.id}> \` ${req.user.username}#${req.user.discriminator}\` `)
    .setTimestamp()
  
 
     
  
   


    
  
  client.channels.get(ch).send(hm);

});

m.on("delete", (req, bin) => {
  try {
    let hm = new RichEmbed()
      .setColor("#FF0000")
      .setTimestamp()
      .setDescription(` \` ${bin.name} \`  has been deleted by <@${req.user.id}> [ \`${req.user.username}#${req.user.discriminator} \`] `)
    bin.owners.map(id => {
      if (client.users.has(id)) {
        client.users.get(id).send(hm);
      };
    });
    remove(bin.id, btr);
    client.channels.get(ch).send(hm);
  } catch (r) {
    console.log(r);
  }
});


m.on("report", async (req, rs, id) => {
  let user = req.user;
  let hm;
  let gg = await db.collection("bots").doc(id).get().then(q => q);
  if (gg && gg.data()) {
    hm = new RichEmbed()
      .setColor("FF0000")
      .setTitle("REPORT")
      .setTimestamp()
      .addField("BOT", gg.data().name)
      .addField("ID", gg.data().id)
      .addField("OWNER", `<@${gg.data().owner}>`)
      .addField("By", `<@${user.id}> [\` ${user.username}#${user.discriminator}] \` `)
      .addField("REASON", ` \` ${rs} \` `)
      .addField("LINK", `[Here](https://b-o-d.cf/bots/${gg.data().id})`)
    client.guilds.get(guildId).channels.get(p.channels.report).send(hm);
    gg.data().owners.map(i => {
      if (client.users.has(i)) {
        client.users.get(i).send(hm);

      }
    })
  }
});

m.on("cert", (req, k) => {
  let user = req.user;
  let hm;
  let owners = k.owners;
  hm = new RichEmbed()
    .setColor("#00FEFF")
    .setTimestamp()
    .setTitle("CERTIFIED")
    .addField("BOT", ` \` ${k.name}\` `)
    .addField("ID", k.id)
    .addField("OWNER", `<@${k.owner}>`)
    .addField("LINK", `[Here](https://b-o-d.cf/bots/${k.id})`);
  client.channels.get(ch).send(hm);
  add(k.id, ctr);
  owners.map(id => {
    add(id, cr);
    if (client.users.has(id)) {
      client.users.get(id).send(hm);
    }
  });
});

m.on("vote",async (req,bot) => {
  try {
  console.log("vote")
  const user = req. user;
  if(bot.wh) {
  
    const body = JSON. stringify({user:{name: user.username,id:user.id,avatar:user.avatar},bot:{name:bot.name,id:bot.id,avatar:bot.avatar,votes:bot.votes+1},botlist:"BOD"});
    fetch(bot.wh,{method:'post',headers:{"user-agent":"BOD","Content-type":"application/json"},body: body}). then (q => console.log(q)).catch(r => console.log(r));
  };
   
  
    const dl = {
  "username": "BOTS OF DISCORD",
  "avatar_url": "https://cdn.discordapp.com/avatars/644375115219337216/8e7a3b45df0652554623e538fb054bad.png?size=256",
  
  "embeds": [
    {
      "author": {
        "name": user. username,
        "url": "https://www.b-o-d.cf/user/"+user.id,
        "icon_url": "https://cdn.discordapp.com/avatars/"+user.id+"/"+user.avatar
      },
      
      "color": 15258703,
      "fields": [
        {
          "name": "VOTE",
          "value": `[${user.username}](https://www.b-o-d.cf/user/${user.id}) just upvoted [${bot. name}](https://www.b-o-d.cf/bots/${bot.id}) bot.`,
          "inline": true
        }
      ],
      "thumbnail": {
        "url": "https://cdn.discordapp.com/avatars/"+bot.id+"/"+bot.avatar
      },
  
      "footer": {
        "text": "🗳️ "+ Math.ceil(bot. votes+1)
      }
    }
  ]
}
function wh(url) {
fetch (url,{method:"post",headers:{"Content-type":"application/json"},body: JSON.stringify(dl)})
  };
    wh("https://discordapp.com/api/webhooks/694223461698109570/yRl5p-HmFlD3K60Kja9BzuciNHBybHbI_CCTWX-DhU-cZ4MtZpL77Gho0BZg9HC0i01u");
    if(bot.dwh) {
      wh(bot.dwh);
      
      };
  
  } catch (r) {
    console.log(r)
  }
});









