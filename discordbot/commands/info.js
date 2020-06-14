const Discord = require('discord.js')

exports.run = async (client, message, args) => {
  let bots = [];
  let type;
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send("> Please `mention` someone or provide `id`");
  if (!client.users.has(user.id)) return message.channel.send("> User doesn't exist. ");

    
  console.log(user)
  let joined = user.joinedAt.toLocaleDateString();
  let created = user.user.createdAt.toLocaleDateString();
  
  if (!user.user.bot) {
    await client.db. collection ("bots").where ("owners","array-contains",user.id). get (). then (q =>  {
      if(q) {
      q.forEach(gg => {
    if(gg && gg.data()) {
      bots.push (`<@${gg.data().id}>`)
    };
        
    })
      }
    })
    
    
  type = "User"
  	} else {
  	type = "Bot"
  		};
  	let role = message.guild.members.get(user.id).roles.filter(r => r.position !== 0).map(R => R.name).join(', ') || "No Roles"
	
	if(bots. length >= 1) {
    bots = bots;
  } else {
    bots = "None"
  };
	let embed = new Discord.RichEmbed()
	.setTitle("INF0")
	.setTimestamp()
  .setColor("#00FEFF")
	.setThumbnail(user.user.displayAvatarURL)
	.addField("Type", type)
	.addField("Name", `${user.user.username}#${user.user.discriminator}`, true)
	.addField("Joined At", joined)
	.addField("Created At", created)
	.addField("Bots",bots)
	.addField("Roles", role)

	message.channel.send(embed);

} 