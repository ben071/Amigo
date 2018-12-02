const Discord = require("discord.js"); //Required

exports.run = async (client, message) => {
  const startMessage = await message.channel.send("Pinging...");
  const ping = Math.round(startMessage.createdTimestamp - message.createdTimestamp)

  const embed = new Discord.RichEmbed()
    .setColor("#F4A742")
    .setAuthor("Pong! 🏓")
    .setTimestamp()
    .addField("Api Latency:", `${Math.round(client.ping)}ms`)
    .addField("Message Latency:", `${ping}ms`);

  startMessage.edit(embed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It pings. Then Pongs. But it's not Ping Pong.",
  usage: "ping"
};
