const Discord = require("discord.js"); 
exports.run = async (client, message, args) => {
    const roleName = args.join(" ");
    const role = message.guild.roles.find(r => r.name.toLowerCase() == roleName.toLowerCase())
    if (!role) return message.reply("That doesn't seem to be a role")
    let haveRole = 0;
    message.guild.members.forEach(m => {
        if (m.roles.find(r => r.id == role.id) != undefined) {
          haveRole += 1
        }
    })
    const embed = new Discord.RichEmbed()
    .setColor(role.hexColor)
    .setTitle('Information about '+role.name)
    .addField("Name", role.name , true)
    .addField("Role ID", role.id, true)
    .addField("Role Colour (Hex)", role.hexColor, true)
    .addField("Position", role.position, true)
    .addField("Created at", role.createdAt, true)
    .addField("Mentionable", role.mentionable, true)
    .addField("Hoisted", role.hoist, true)
    .addField("Number of users that have this role", haveRole, true);
    message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["rinfo"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "roleinfo",
    category: "Miscelaneous",
    description: "Gives information about a role",
    usage: "roleinfo [role name]"
  };
  
