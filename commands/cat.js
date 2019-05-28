const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  const {body} = await superagent
    .get("http://aws.random.cat/meow");

  if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    const embed = new Discord.RichEmbed()
      .setColor(config.blue)
      .setTitle("Cat! 🐱")
      .setImage(body.file || "https://purr.objects-us-east-1.dream.io/i/oFi6C.jpg");
    message.channel.send(embed).catch(err => {});
  } else if (message.channel.permissionsFor(message.guild.me).has("ATTACH_FILES")) {
    message.channel.send({
      files: [body.file || "https://purr.objects-us-east-1.dream.io/i/oFi6C.jpg"]
    }).catch(err => {});
  } else {
    message.channel.send(body.file || "https://purr.objects-us-east-1.dream.io/i/oFi6C.jpg").catch(err => {})
  }
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
  