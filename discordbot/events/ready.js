
module.exports = client => {
    console.log(`Connected to ${client.guilds.size} guilds`)
    client.user.setPresence({ game: { name: `BOTS OF DISCORD`, type: 3 } });  
};
  