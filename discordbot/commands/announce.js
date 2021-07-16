const Discord = require('discord.js')

exports.run = async (client, message, args) => {

  const channel = message.mentions.channels.first();

  if (client.config.perms.owners.includes(message.author.id)) {
    if(!channel) return message.reply('Please mention a channel');
    let embed = new Discord.MessageEmbed()
      .setAuthor("BOTS OF DISCORD", client.user.displayAvatarURL)
      .setTitle('Annoucement')
      .setColor("#00FEFF")
      .setDescription(args.join(' '))
      .setFooter(`By ${message.author.username} with ♥️ `)
    channel.send(embed)
    await message.react("☑️");
    await message.react("❎");
  }
}