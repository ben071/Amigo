const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message, args) => {
  let {body} = await superagent
  .get(`https://random.dog/woof.json`);

  let embed = new Discord.RichEmbed()
  .setColor("#9669FE")
  .setTitle("Dog! 🐶")
  .setImage(body.url);

  message.channel.send(embed);
}

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
