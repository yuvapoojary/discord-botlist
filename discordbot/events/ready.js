
module.exports = client => {
  
    console.log(`Connected to ${client.guilds.cache.size} guilds`)
    client.user.setPresence({ game: client.config.bot_presence });  
    
};
  