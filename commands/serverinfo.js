const Discord = require("discord.js");

exports.run = async (client, message) => {
  if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send("I can't run this command if I can't create embeds").catch(err => {})
  const online = message.guild.members.filter(member => member.user.presence.status !== "offline"); // Finds number of "online" users by filtering out user's that are offline.
  const day = message.guild.createdAt.getDate(); // Gets day server was created
  const month = 1 + message.guild.createdAt.getMonth(); // Gets month server was created
  const year = message.guild.createdAt.getFullYear(); // Gets year server was created
  const sicon = message.guild.iconURL;
  const serverembed = new Discord.RichEmbed()
    .setAuthor(message.guild.name, sicon)
    .setFooter(`Server Created • ${day}.${month}.${year}`)
    .setColor("#7289DA")
    .setThumbnail(sicon)
    .addField("ID", message.guild.id, true)
    .addField("Name", message.guild.name, true)
    .addField("Owner", message.guild.owner.user.tag, true)
    .addField("Region", message.guild.region, true)
    .addField("Channels", message.guild.channels.size, true)
    .addField("Members", message.guild.memberCount, true)
    .addField("Humans", message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
    .addField("Bots", message.guild.members.filter(m => m.user.bot).size, true)
    .addField("Online", online.size, true)
    .addField("Roles", message.guild.roles.size, true)
  message.channel.send(serverembed);

};

exports.conf = {
  permission: "SEND_MESSAGES"
};

exports.help = {
  name: "serverinfo",
  category: "Miscelaneous",
  description: "Gives info.",
  usage: "serverinfo",
  aliases: ["sinfo"]
};