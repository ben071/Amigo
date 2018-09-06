const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message) => {
  const {body} = await superagent
    .get("https://random.dog/woof.json");

  const embed = new Discord.RichEmbed()
    .setColor("#9669FE")
    .setTitle("Dog! 🐶")
    .setImage(body.url);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["woof"],
  permLevel: "User"
};

exports.help = {
  name: "dog",
  category: "Fun",
  description: "Displays a random dog image.",
  usage: "dog"
};
