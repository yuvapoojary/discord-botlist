const {RichEmbed} = require ("discord.js");
exports.run =  async(client, message,args) => {
  let owner = {username:"Unknown",discriminator:"0000"};
  let bot = message.mentions.users.first() || message.guild.members.get(args[0]);
  if(!bot) return message.channel.send("> This bot doesnt exists");
  let gg = await client.db.collection("bots").doc(bot.id).get().then(q => q);
 if(gg && gg.data()) {
   let doc = gg.data();
   if(client.users.has(doc.owner)) {
    owner = client.users.get(doc.owner);
   };
   const embed = new RichEmbed()
   .setTitle("INFO")
   . setColor("#00FEFF")
   . setTimestamp()
   . setThumbnail(`https://cdn.discordapp.com/avatars/${doc.id}/${doc.avatar}`)
   . addField ("BOT NAME",` \` ${doc.name}#${doc.discrim} \` `)
   . addField ("OWNER",` <@${doc.owner}> \n \`${owner.username}#${owner.discriminator} \`   `)
   . addField ("PREFIX",doc.prefix)
   .addField("LIBRARY",doc.library)
   .addField("DESCRIPTION",doc.short_desc)
   .addField("SERVERS",doc.server_count)
   .addField("VOTES",doc.votes)
   .addField("INVITE",`[Link](${doc.invite})`)
   message.channel.send(embed);
 } else {
   return message.channel.send("> That bot doesn't exists in api");
 }
};