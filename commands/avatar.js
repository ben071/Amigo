const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const user = message.mentions.users.first()||message.guild.members.get(args[0])||message.author;
  const embed = new Discord.RichEmbed();
  embed.setTitle("Avatar for "+user.tag);
  embed.setColor("#9669FE");
  embed.setImage(user.avatarURL);
  message.channel.send(embed);

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "avatar",
  category: "Miscelaneous",
  description: "Gives the mentioned users avatar",
  usage: "avatar [user]"
};
