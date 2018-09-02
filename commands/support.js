const Discord = require("discord.js");

exports.run = async (bot, message) => {
  message.author.send("My support server: https://discord.gg/3CBbFnv");
  message.author.send("My GitHub page: https://github.com/AmigoDevTeam/Amigo");
  message.reply("I have sent you an invite to the support server and my GitHub page via direct message.");
  // Add embed in future.
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
exports.help = {
  name: "support",
  category: "Miscelaneous",
  description: "Provides bot support info.",
  usage: "support"
};
