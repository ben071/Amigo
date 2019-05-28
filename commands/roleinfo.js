const Discord = require("discord.js"); 
exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    const roleName = args.join(" ");
    const role = message.guild.roles.find(r => r.name.toLowerCase() == roleName.toLowerCase());
    if (!role) return message.reply("That doesn't seem to be a role");
    let haveRole = message.guild.members.filter(m => m.roles.get(role.id)).size;
    const embed = new Discord.RichEmbed()
    .setColor(role.hexColor)
    .setTitle('Information about '+ role.name)
    .addField("Name", role.name , true)
    .addField("Role ID", role.id, true)
    .addField("Role Colour (Hex)", role.hexColor, true)
    .addField("Position", role.position, true)
    .addField("Created at", new Date(role.createdAt).toISOString().slice(0, 19).replace(/-/g, "/").replace(/T/g, " "), true)
    .addField("Members", `There are ${haveRole} members with this role.`, true)
    .addField("Other", `Hoisted: ${role.hoist}\nManaged by an integration: ${role.managed}\nMentionable: ${role.mentionable}`, true);
    message.channel.send(embed)
}
  
exports.help = {
    name: "roleinfo",
    category: "Miscelaneous",
    description: "Gives information about a role",
    usage: "roleinfo [role name]",
    aliases: ["rinfo"]
};

exports.conf = {
  permission: "SEND_MESSAGES"
};
