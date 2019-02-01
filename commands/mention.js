module.exports.run = async (bot, message, args) => {
  const RoleName = args.join(" ");
  const Role = message.guild.roles.find(r => r.name.toLowerCase() == RoleName.toLowerCase());
  if (!Role) return message.channel.send("I can't find the following role:```"+RoleName+"```");
  if (Role.mentionable) return message.reply("That role is already mentionable");
  await Role.setMentionable(true);
  await message.channel.send("<@&"+Role.id+">");
  await Role.setMentionable(false);
  await message.delete();
};

exports.conf = {
  enabled: true,
  aliases: ["menro","menrole"],
  permLevel: "Moderator"
};

exports.help = {
  name: "mention",
  category: "Moderation",
  description: "Mentions the specified role",
  usage: "mention [role name]"
};
