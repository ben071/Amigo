module.exports.run = async (bot, message, args) => {
  const RoleName = args.join(" ");
  const Role = message.guild.roles.find("name", RoleName);
  if (!Role) return message.channel.send("I can't find the following role:```"+RoleName+"```");
  if (Role.mentionable == true) return message.reply("That role is already mentionable");
  Role.setMentionable(true);
  message.channel.send("<@&"+Role.id+">");
  Role.setMentionable(false);
  message.delete();
};

exports.conf = {
  enabled: true,
  aliases: ["menro","menrole"],
  permLevel: "Moderator"
};

exports.help = {
  name: "mention",
  category: "Moderation",
  description: "Mentions the specified role - case sensitive",
  usage: "mention [role name]"
};
