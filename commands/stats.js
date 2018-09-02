const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require('discord.js');

exports.run = (client, message, args, level) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

  let embed = new Discord.RichEmbed()
  .setAuthor("Bot Statistics 🤖")
  .setColor("#9669FE")
  .setTimestamp()
  .addField("Mem Usage:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
  .addField("Uptime:", `${duration}`)
  .addField("Users:", `${client.users.size.toLocaleString()}`)
  .addField("Servers:", `${client.guilds.size.toLocaleString()}`)
  .addField("Channels:", `${client.channels.size.toLocaleString()}`)
  .addField("Discord.js:", `v${version}`);

  message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics.",
  usage: "stats"
};
