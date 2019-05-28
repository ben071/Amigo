const Discord = require("discord.js");
const config = require("../config.json")
exports.run = async (client, message, args) => {
  if (!args[1]) return message.reply("Please ask a full question!").catch(err => {});
  const replies = ["Yes.", "No.", "Never.", "Definitely.", "Ask again later."];

  const result = Math.floor((Math.random() * replies.length));
  const question = args.slice(0).join(" ");
  if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    const embed = new Discord.RichEmbed()
      .setAuthor("🎱 The 8 Ball says...")
      .setColor(config.orange)
      .addField("Question:", question)
      .addField("Answer:", replies[result]);
    message.channel.send(embed).catch(err => {});
  } else {
    message.channel.send(`**Question:**\n${question}\n**Answer:**\n${replies[result]}`).catch(err => {});
  };
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