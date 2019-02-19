const Discord = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  const startMessage = await message.channel.send("Pinging...");
  const ping = Math.round(startMessage.createdTimestamp - message.createdTimestamp)

  const embed = new Discord.RichEmbed()
    .setColor(config.orange)
    .setAuthor("Pong! 🏓")
    .setFooter(message.author.tag, message.author.avatarURL)
    .addField("Api Latency:", `${Math.round(client.ping)}ms`)
    .addField("Message Latency:", `${ping}ms`);

  startMessage.edit(embed);
};

exports.help = {
  name: "ping",
  category: "System",
  description: "Pong!",
  usage: "ping"
};

exports.conf = {
  permission: "SEND_MESSAGES"
};