const Discord = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.guild.me.permissions.has("MANAGE_GUILD",true)) {
        const noPermsEmbed = new Discord.RichEmbed()
        .setTitle("Missing Permissions")
        .setColor(config.red)
        .setDescription("I am unable to run this command because I am missing the `Manage Server` permission")
        .setTimestamp();
        return message.channel.send(noPermsEmbed);
    };

    let user = message.author;
    
    if (args[0]) {
        const temporaryUser = await client.fetchUser(args[0].replace(/[^0-9]/g, "")).catch(err => {});
        user = temporaryUser ? temporaryUser : user;
    };

    const invites = await message.guild.fetchInvites();
    
    if (invites.size == 0) {
        const noGuildInvites = new Discord.RichEmbed()
        .setTitle("No invites for this server")
        .setDescription("This server has no active invites so the number of invites you have is 0")
        .setColor(config.red)
        .setTimestamp();
        return message.channel.send(noGuildInvites);
    }

    const filtered = invites.filter(inv => inv.inviter && inv.inviter.id == user.id);
    let uses = 0;    
    filtered.forEach(inv => {

        uses += inv.uses;

    });
    const successEmbed = new Discord.RichEmbed()
    .setTitle(`Invites for ${user.tag}`)
    .setDescription(`<@${user.id}> has ${filtered.size} current active invites which in total have been used ${uses} times`)
    .setColor(config.blue)
    .setTimestamp();
    return message.channel.send(successEmbed);
};
exports.conf = {
    permission: "SEND_MESSAGES"
};

exports.help = {
    name: "invites",
    category: "Miscellaneous",
    description: "Shows you how many people you have invited",
    usage: "invites",
    aliases: []
};