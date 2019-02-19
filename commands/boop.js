const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  const user = message.mentions.users.first();
  if (!user) return errors.invalidUser(message);

  await yiff.furrybot.sfw.boop().then(r => {
    const embed = new Discord.RichEmbed()
      .setTitle(`${message.author.username} booped ${user.username}!`)
      .setColor(config.blue)
      .setImage(r);
    message.channel.send(embed);
  });
};

exports.help = {
  name: "boop",
  category: "Fun",
  description: "Boop another user.",
  usage: "boop [@user]"
};

exports.conf = {
  permission: "SEND_MESSAGES"
};