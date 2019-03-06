const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config.json")
exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  const {body} = await superagent
    .get("http://aws.random.cat/meow");

  const embed = new Discord.RichEmbed()
    .setColor(config.blue)
    .setTitle("Cat! 🐱")
    .setImage(body.file);

  message.channel.send(embed);
};


exports.help = {
  name: "cat",
  category: "Fun",
  description: "Displays a random cat image.",
  usage: "cat",
  aliases: ["meow"]
};
exports.conf = {
    permission: "SEND_MESSAGES"
};
  