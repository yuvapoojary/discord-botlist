const {RichEmbed} = require ("discord.js");
module.exports.run = async(client,message,args) => {
if(client.config.roles.owner.includes(message.author.id) || client.config.roles.admin.includes(message.author.id)) {
await client.db.collection("bots").doc(q => {
q.forEach(i => {
if(client.users.has(i.data().id)) {
db.collection("bots").doc(`${i.data().id}`).update({
name: client.users.get(i.data().id).username
});
};
})
}).then(() => {
let embed = new RichEmbed()
.setColor("RANDOM")
.setTimestamp()
.setDescription("Successfully updated bot's username...")
message.channel.send(embed);
});


}
};
