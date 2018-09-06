const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const settings = message.settings;
  const reason = args.slice(1).join(" ");
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  const user = args[0];
  const modLog = message.guild.channels.find(c => c.name === settings.modLogChannel);
  if (!modLog) return message.reply("I cannot find a mod-log channel");
  if (reason.length < 1) return message.reply("You must supply a reason for the unban.");
  if (!user) return message.reply("You must supply a User Resolvable, such as a user id.").catch(console.error);
  message.guild.unban(user);

  const embed = new Discord.RichEmbed()
    .setColor("#FF4848")
    .setTimestamp()
    .setDescription(`**Action:** Unban\n**Target:** ${user}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
  return client.channels.get(modLog.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "unban",
  category: "Moderation",
  description: "Unbans the user.",
  usage: "unban [id] [reason]"
};
