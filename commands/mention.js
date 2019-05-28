module.exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    const RoleName = args.join(" ");
    const Role = message.guild.roles.find(r => r.name.toLowerCase() == RoleName.toLowerCase());
    if (!Role) return message.channel.send("I can't find the following role:```"+RoleName+"```");
    if (Role.mentionable) return message.reply("That role is already mentionable");
    await Role.setMentionable(true);
    await message.channel.send(`<@${message.author.id}> mentioned <@&${Role.id}>`);
    await Role.setMentionable(false);
    await message.delete();
    setTimeout(function() {
        message.channel.send("Ping Fix")
    }, 5000);
  };
  
exports.conf = {
    permission: "MANAGE_MESSAGES"
};
  
exports.help = {
    name: "mention",
    category: "Moderation",
    description: "Mentions the specified role",
    usage: "mention [role name]"
};