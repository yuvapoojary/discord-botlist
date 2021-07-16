const discord = require('discord.js');

module.exports.run = (client, message, args) => {
  
  var hrs = Math.round(client.uptime / (1000 * 60 * 60)) + " hour(s),"
  var mins = " " + Math.round(client.uptime / (1000 * 60)) % 60 + " minute(s), "
  var sec = Math.round(client.uptime / 1000) % 60 + " second(s)"
  if (hrs == "0 hour(s),") hrs = ""
  if (mins == " 0 minute(s), ") mins = ""
  let uptime = hrs + mins + sec

  let em = new discord.MessageEmbed()
    .setTitle(`**${client.user.username} Uptime**\n`)
    .setDescription(`**Serving ${client.users.cache.size} users for ${uptime}!**`)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`Requested by ${message.author.username}.`)
  message.channel.send(em);
}