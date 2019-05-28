const Discord = require("discord.js");
const superagent = require("superagent");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;

  const {body} = await superagent
    .get("https://random.dog/woof.json");
  if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    const embed = new Discord.RichEmbed()
      .setColor(config.blue)
      .setTitle("Dog! 🐶")
      .setImage(body.url || "https://random.dog/f355626a-5868-4a22-b173-a7c8571abb80.jpg");
    message.channel.send(embed).catch(err => {});
  } else if (message.channel.permissionsFor(message.guild.me).has("ATTACH_FILES")) {
    message.channel.send({
      files: [body.url || "https://random.dog/f355626a-5868-4a22-b173-a7c8571abb80.jpg"]
    }).catch(err => {});
  } else {
    message.channel.send(body.url || "https://random.dog/f355626a-5868-4a22-b173-a7c8571abb80.jpg").catch(err => {})
  }
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
