const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if(!args[1]) return message.reply("Please ask a full question!");
  let replies = ["Yes.", "No.", "Never.", "Definitely.", "Ask again later."];

  let result = Math.floor((Math.random() * replies.length))
  let question = args.slice(0).join(" ");

  let embed = new Discord.RichEmbed()
  .setAuthor("🎱 The 8 Ball says...")
  .setColor("#9669FE")
  .addField("Question:", question)
  .addField("Answer:", replies[result]);

  message.channel.send(embed)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "8ball",
  category: "Fun",
  description: "Asks the 8 Ball a question.",
  usage: "8ball [question]"
};
