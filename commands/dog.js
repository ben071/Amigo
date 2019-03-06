const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;

  const {body} = await superagent
    .get("https://random.dog/woof.json");

  const embed = new Discord.RichEmbed()
    .setColor(config.blue)
    .setTitle("Dog! 🐶")
    .setImage(body.url);

  message.channel.send(embed);
};

exports.help = {
    name: "dog",
    category: "Fun",
    description: "Displays a random dog image.",
    usage: "dog",
    aliases: ["woof"]
};

exports.conf = {
    permission: "SEND_MESSAGES"
};
