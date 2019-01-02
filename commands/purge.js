const Discord = require("discord.js");
const { inspect } = require("util");

exports.run = (client, message, args) => {
  const settings = message.settings;
  const messagecount = parseInt(args.join(" "));
  inspect((settings), {code: "json"});
  const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
  if (!modLog) return message.reply("I cannot find a mod-log channel");
  if (isNaN(messagecount)) return message.channel.send("Enter a valid integer.");
  if (messagecount > 100) {
    message.channel.send("Please enter a number less than or equal to 100.");
    return;
  };
  message.channel.fetchMessages({
    limit: messagecount
  }).then(messages => message.channel.bulkDelete(messages)).catch(console.error);

  const embed = new Discord.RichEmbed()
    .setColor("#FF4848")
    .setTimestamp()
    .setDescription(`**Action:** Purge\n**Moderator:** ${message.author.tag}\n**Number of messages:** ${messagecount}\n**Channel:** ${message.channel.name}`);
  return client.channels.get(modLog.id).send({embed});
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  category: "Moderation",
  description: "Purges X amount of messages from a given channel.",
  usage: "purge [number]"
};
