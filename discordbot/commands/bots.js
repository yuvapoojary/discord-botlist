const { RichEmbed} = require ("discord.js");
exports.run =  async(client, message,args) => {
  let id = message.mentions.users.first () || message.guild.members.get(args[0]);
  if(!id) id = message.author;
  let doc = [];
   await client.db.collection("bots").where ("owners","array-contains",id.id).get().then(q => {
    if(q) {
      q.forEach(m => {
        if(m) {
        doc. push (`<@${m.id}>`);
      } else {
      return message.channel.send("This user don't have a bot");
      }
      })
    }});
  if(doc. length >= 1) {
    let embed = new RichEmbed()
    . setAuthor(`| ${id.username} `,id.avatarURL)
    . setDescription(doc)
    . setColor("#00FEFF")
    message.channel.send(embed);
  } else {
    message. channel. send ("> This user don't have bots")
  }
};