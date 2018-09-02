const Discord = require("discord.js"); //Required

exports.run = async (client, message) => {

  const embed = new Discord.RichEmbed()
    .setColor("#F4A742")
    .setAuthor("Pong! 🏓")
    .setTimestamp()
    .addField("Api Latency:", `${Math.round(client.ping)}ms`);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It pings. Then Pongs. But it's not Ping Pong.",
  usage: "ping"
};
