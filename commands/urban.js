const ud = require("urban-dictionary"); //Required
const Discord = require("discord.js"); // Required

exports.run = async (bot, message, args) => {
  ud.term(args[0], function(error, entries) {
    if (error) {
      console.log(error.message);
    } else {
      const embed = new Discord.RichEmbed()
        .setAuthor(""+args[0]+" 📖")
        .setColor("#9669FE")
        .addField("Definition:", entries[0].definition)
        .addField("Example:", entries[0].example);
      message.channel.send(embed);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ud", "urbandictionary"],
  permLevel: "User"
};
exports.help = {
  name: "urban",
  category: "Fun",
  description: "Searches the urban dictionary.",
  usage: "urban [search]"
};
