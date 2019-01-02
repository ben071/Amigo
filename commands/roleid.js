const Discord = require("discord.js");

exports.run = (client, message, args) => {
    const roleName = args.join(" ");
    const role = message.guild.roles.find("name", roleName);
    if (!role) return message.reply("I couldn't find the role `" + roleName + "`");
    message.channel.send("The id for `" + roleName + "` is " + role.id);
};
exports.conf = {
    enabled: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "roleid",
    category: "Miscelaneous",
    description: "Gives the id of the role you give it",
    usage: "roleid [role name]"
};