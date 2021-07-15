const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");

const client = new Discord.Client();

client.config = config;
client.commands = new Discord.Collection();

// load events here
fs.readdir(`${process.cwd()}/discordbot/events/`, (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./discordbot/events/${file}`);
    let eventName = file.split(".")[0];

    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./discordbot/events/${file}`)];
  });
});

// load commands here
fs.readdir(`${process.cwd()}/discordbot/commands`, (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./discordbot/commands/${file}`);
    let commandName = file.split(".")[0];

    client.commands.set(commandName, props);
  });
});

// Logging in

client.login(config.bot.token);

module.exports = client;


