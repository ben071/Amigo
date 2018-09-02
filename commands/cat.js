const Discord = require('discord.js');
const superagent = require("superagent");

exports.run = async (client, message, args) => {
  let {body} = await superagent
  .get(`http://aws.random.cat/meow`);

  let embed = new Discord.RichEmbed()
  .setColor("#9669FE")
  .setTitle("Cat! 🐱")
  .setImage(body.file);

  message.channel.send(embed)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["meow"],
  permLevel: "User"
};

exports.help = {
  name: "cat",
  category: "Fun",
  description: "Displays a random cat image.",
  usage: "cat"
};
