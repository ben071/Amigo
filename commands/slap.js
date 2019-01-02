const Discord = require("discord.js");

exports.run = (client, message) => {
  const user = message.mentions.users.first();
  if (!user) return message.reply("You must supply a user to slap.").catch(console.error);

  const slaps = [
    "https://i.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
    "https://i.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
    "https://i.giphy.com/media/j3iGKfXRKlLqw/giphy.gif",
    "https://i.giphy.com/media/2M2RtPm8T2kOQ/giphy.gif",
    "https://i.giphy.com/media/l3YSimA8CV1k41b1u/giphy.gif",
    "https://i.giphy.com/media/WLXO8OZmq0JK8/giphy.gif"
  ];

  const embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} slapped ${user.username}!`)
    .setColor("#9669FE")
    .setTimestamp()
    .setImage(slaps[Math.floor(Math.random() * slaps.length)]);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "slap",
  category: "Fun",
  description: "Give a slap to another user.",
  usage: "slap [mention]"
};
