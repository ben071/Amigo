exports.run = (client, message, args) => {
  try {
    const roleName = args.join(" ");
    const role = message.guild.roles.find("name",roleName);
    if (!role) return message.reply("That isn't a role");
    if (role.hoist) {
      role.setHoist(false,"For <@"+message.author.id+"> - "+message.author.tag);
      message.channel.send(roleName + ", is no longer hoisted");
    } else if (role.hoist == false) {
      role.setHoist(true,"For <@"+message.author.id+"> - "+message.author.tag);
      message.channel.send(roleName+", is now hoisted");
    };
  } catch (err) {
    message.reply("Either I don't have permissions to do that or that role is above my highest role");
  };
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["toggleHoist","hoist","unhoist"],
  permLevel: "Administrator"
};

exports.help = {
  name: "togglehoist",
  category: "Administration",
  description: "Toggles whether or not a role is hoisted",
  usage: "togglehoist [role name]"
};
