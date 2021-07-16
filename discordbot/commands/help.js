const { MessageEmbed } = require("discord.js");
exports.run = (client, message) => {


  const embed = new MessageEmbed()
    .setColor("#00FEFF")
    .setTimestamp()
    .setAuthor(" | BOTS OF DISCORD", client.user.displayAvatarURL)
    .addField("Prefix", "\` .\` ")
    .setThumbnail(client.user.displayAvatarURL)
    .addField(".Ping", "/` Shows the ping of the bot\` ")
    .addField(".Bots <mention or user id> ", "\` Shows the mentioned user's bots\` ")
    .addField(".Bot  <mention or bot id> ", "\` Shows the stats and info of the bot\` ")
    .addField(".Info  <mention or bot/user id > ", "\` Shows information of the mentioned user/bot\` ")
    .addField("Website", `[Link](https://b-o-d.cf)`)




  message.channel.send(embed);
};