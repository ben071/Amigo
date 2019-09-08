const { noArgs, invalidRole } = require("../utils/errors.js");
const { RichEmbed } = require("discord.js");
const { blue } = require("../config.json");

exports.run = async (client, message, args) => {
    if (!args[0]) return await noArgs(client, exports);
    const roleName = args.join(" ");
    const filter = role => role.name.split(/ +/g).join(" ").toLowerCase().trim() === roleName.toLowerCase().trim() || roleName.trim().replace(/^<@|>$/g, "") === role.id;

    const role = message.guild.roles.find(filter);

    if (!role) return await invalidRole(message.channel, roleName);
    const oldBypass = await client.db.r.table("guilds").get(message.guild.id).run().bypass;

    let oldBypassRole = oldBypass ? message.guild.roles.get(oldBypass) : "None";
    
    oldBypassRole = oldBypassRole === "None" ? oldBypassRole : oldBypassRole ? `<@&${oldBypassRole.id}>` : "Deleted-Role";

    await client.db.r.table("guilds").get(message.guild.id).update({
        bypass: role.id
    }).run();

    const embed = new RichEmbed()
    .setTitle("Success!")
    .setDescription(`The server bypass role has been updated from ${oldBypassRole} to <@&${role.id}>`)
    .setTimestamp()
    .setColor(blue)
    
    await message.channel.send(
        message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
        embed :
        `The server bypass role has been updated to ${role.name}`
    ).catch(() => {});
    
};

exports.help = {
    name: "setbypass",
    category: "Administratrion",
    description: "Set the role which if a user has, all features of Amigo AutoMod will ignore them",
    usage: "setbypass <role>"
};

exports.conf = {
    permission: "MANAGE_GUILD"
}
