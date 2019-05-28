const Discord = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.guild.me.permissions.has("MANAGE_GUILD")) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const noPermsEmbed = new Discord.RichEmbed()
            .setTitle("Missing Permissions")
            .setColor(config.red)
            .setDescription("I am unable to run this command because I am missing the `Manage Server` permission")
            .setTimestamp();
            return await message.channel.send(noPermsEmbed).catch(err );
        } else {
            return await message.channel.send("I am unable to run this command because I am missing the `Manage Server` permission").catch(err => {})
        };
    };
    let user = message.author;
    
    if (args[0]) {
        const temporaryUser = await client.fetchUser(args[0].replace(/[^0-9]/g, "")).catch(err => {});
        user = temporaryUser ? temporaryUser : user;
    };

    const invites = await message.guild.fetchInvites();
    
    if (invites.size == 0) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const noGuildInvites = new Discord.RichEmbed()
            .setTitle("No invites for this server")
            .setDescription("This server has no active invites so the number of invites you have is 0")
            .setColor(config.red)
            .setTimestamp();
            return await message.channel.send(noGuildInvites).catch(err => {});
        } else {
            return await message.channel.send("No active invites on this server").catch(err => {});
        }
    }

    const filtered = invites.filter(inv => inv.inviter && inv.inviter.id == user.id);
    let uses = 0;    
    filtered.forEach(inv => {

        uses += inv.uses;

    });
    if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        const successEmbed = new Discord.RichEmbed()
        .setTitle(`Invites for ${user.tag}`)
        .setColor(config.blue)
        .setTimestamp()
        .addField("Active Invites", filtered.size, true)
        .addField("Invite Uses", uses, true);

        return await message.channel.send(successEmbed).catch(err => {});
    } else {
        return await message.channel.send(`Invites for ${user.tag}\n\n**Active Invites**${filtered.size}\n\n**Invite Uses**\n${uses}`).catch(err> {});
    };
};
exports.conf = {
    permission: "SEND_MESSAGES"
};

exports.help = {
    name: "invites",
    category: "Miscellaneous",
    description: "Shows you how many people you have invited",
    usage: "invites [@user / ID]",
    aliases: []
};