const Discord = require("discord.js");
const config = require("../config.json")
exports.run = async (client, message, args) => {
  if (!args[1]) return message.reply("Please ask a full question!");
  const replies = ["Yes.", "No.", "Never.", "Definitely.", "Ask again later."];

  const result = Math.floor((Math.random() * replies.length));
  const question = args.slice(0).join(" ");

  const embed = new Discord.RichEmbed()
    .setAuthor("🎱 The 8 Ball says...")
    .setColor(config.orange)
    .addField("Question:", question)
    .addField("Answer:", replies[result]);

  message.channel.send(embed);
};

exports.conf = {
  permission: "SEND_MESSAGES"
};

exports.help = {
  name: "8ball",
  category: "Fun",
  description: "Asks the 8 Ball a question.",
  usage: "8ball [question]",
  aliases: []
};