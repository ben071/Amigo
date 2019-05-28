const Discord = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  const startMessage = await message.channel.send("Pinging...");
  const ping = Math.round(startMessage.createdTimestamp - message.createdTimestamp)
  if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    const embed = new Discord.RichEmbed()
      .setColor(config.orange)
      .setAuthor("Pong! 🏓")
      .setFooter(message.author.tag, message.author.avatarURL)
      .addField("Api Latency:", `${Math.round(client.ping)}ms`)
      .addField("Message Latency:", `${ping}ms`);

    return await startMessage.edit(embed).catch(err => {});
  } else {
    return await startMessage.edit(`Pong! 🏓\nApi Latency ${Math.round(client.ping)}ms\nMessage Latency ${ping}ms`).catch(err => {});
  }
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