const messageData = require("../messageData.json");
const Discord = require("discord.js");
exports.run = (client, message, args) => {
    const embed = new Discord.RichEmbed()
    .setAuthor("Message statistics")
    .setColor("#9669FE")
    .setTimestamp()
    .addField("Total commands ran today in this server: ", messageData[message.guild.id].commandsRan)
    .addField("Total commands ran today: ", messageData["totalMessages"].commandsRan)
    .addField("Total messages read today in this server ", messageData[message.guild.id].messages)
    .addField("Total messages read today: ", messageData["totalMessages"].messages)
    .addField("Total messages read:",messageData["unreset"].messages)
    .addField("Total commands ran", messageData["unreset"].commandsRan);
    message.channel.send(embed)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["msgstats"],
    permLevel: "User"
  };

  exports.help = {
    name: "messagestats",
    category: "Miscelaneous",
    description: "Gives some message statistcs related to the bot",
    usage: "messagestats"
  };

