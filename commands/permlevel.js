const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;

  const embed = new Discord.RichEmbed()
    .setTitle("Permission Level:")
    .setColor("#23819C")
    .setDescription(`${level} - ${friendly}`)
    .setFooter(message.author.tag, message.author.avatarURL);
  return message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "permlevel",
  category: "Miscelaneous",
  description: "Tells you your permission level for the current message location.",
  usage: "permlevel"
};
