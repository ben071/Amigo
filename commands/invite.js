const Discord = require("discord.js");

exports.run = async (client, message) => {
    const embed = new Discord.RichEmbed()
        .setAuthor("Invites")
        .setColor("#9669FE")
        .addField("Add me:", "https://amigo.fun/")
        .addField("Support Server:", "https://discord.gg/hBjEcC8/")

    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    aliases: ["inv", "addme", "support"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "invite",
    category: "Miscelaneous",
    description: "Bot invite.",
    usage: "invite"
  };