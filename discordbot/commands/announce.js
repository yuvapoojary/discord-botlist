const Discord = require('discord.js')

exports.run = async (client, message, args) => {
if(client. config.roles.owner.includes(message.author.id) || client.config.roles.admin.includes(message.author.id)) {
  let args2 = args.join(' ')
  let embed = new Discord.RichEmbed()
  .setAuthor("BOTS OF DISCORD",client.user.displayAvatarURL)
    .setTitle('Annoucement')
      .setColor("#00FEFF")
        .setDescription(`${args2}`)
          .setFooter(`By ${message.author.username} with ♥️ `)
  client.channels.get('642541360548806658').send(embed)
await message.react ("☑️");
  await message.react("❎");
}
}
