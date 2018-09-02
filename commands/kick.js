const Discord = require("discord.js");
const { inspect } = require("util");

exports.run = (client, message, args) => {
  const settings = message.settings;
  const reason = args.slice(1).join(" ");
  const user = message.mentions.users.first(); // User = first user mentioned
  inspect((settings), {code: "json"});
  const modlog = client.channels.find("name", settings.modLogChannel);
  if (!modlog) return message.reply("I cannot find a mod-log channel");
  if (reason.length < 1) return message.reply("You must supply a reason for the kick.");
  if (message.mentions.users.size < 1) return message.reply("You must mention someone to kick them.").catch(console.error);

  if (!message.guild.member(user).kickable) return message.reply("I cannot kick that member");
  message.guild.member(user).kick();

  const embed = new Discord.RichEmbed()
    .setColor("#FF4848")
    .setTimestamp()
    .setDescription(`**Action:** Kick\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
  return client.channels.get(modlog.id).send({embed});
};

exports.conf = {
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "kick",
  category: "Moderation",
  description: "Kicks the mentioned user.",
  usage: "kick [mention] [reason]"
};
