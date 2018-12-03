const Discord = require("discord.js");

exports.run = async (client, message) => {
  const settings = message.settings;
  const embed = new Discord.RichEmbed()
    .setAuthor("Guild Configuration")
    .setColor("#92FEF9")
    .addField("Prefix:", `${settings.prefix}`)
    .addField("Mod Role:", `${settings.modRole}`)
    .addField("Admin Role:", `${settings.adminRole}`)
    .addField("Mod Logs:", `${settings.modLogChannel}`)
    .setFooter(`Use ${settings.prefix}editconfig to edit this.`)
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: ["view"],
  permLevel: "User"
};

exports.help = {
  name: "viewconfig",
  category: "Administration",
  description: "View the configuration for the server.",
  usage: "viewconfig"
};
