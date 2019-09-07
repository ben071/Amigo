const { RichEmbed } = require("discord.js");
const { red, blue } = require("../config.json");
const { noPermissions } = require("../utils/errors.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return noPermissions(message, exports);
    
    if (!args[0]) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Missing Argument(s)")
            .setDescription(`You did not provide any arguments to this command, please check the usage of this command using ${message.prefix}${exports.help.name} help`)
            .setTimestamp()
            .setColor(red)

            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send(`You did not provide any arguments to this command, please check the usage of this command using ${message.prefix}${exports.help.name} help`)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };

    const filter = await client.db.r.table("filters").get(args[0]).run();

    if (!filter) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Invalid Filter ID")
            .setDescription("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .setTimestamp()
            .setFooter(message.author.tag)
            .setColor(red);
          
            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        }
    } else if (filter && filter.guild !== message.guild.id) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Invalid Filter ID")
            .setDescription("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .setTimestamp()
            .setFooter(message.author.tag)
            .setColor(red);
          
            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        }
    } else if (filter.channel) {
        const embed = new RichEmbed()
        .setTitle(`This command can only remove server wide filters!`)
        .setDescription("To be able to remove a channel specific filter, you must use the `removechannelfilter` command")
        .setColor(red)
        .setTimestamp()
        .setFooter(message.author.tag);

        return await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            embed : 
            "This command only works on server wide filters, you tried to remove a channel filter. Use the `removechannelfilter` command for that"
        ).catch(err => {})
        .then(async msg => await msg.delete(10000).catch(err => {}));
    } else if (filter && filter.guild === message.guild.id) {
        await client.db.r.table("filters").get(args[0]).delete().run();
        const embed = new RichEmbed()
        .setTitle("Success!")
        .setDescription("Successfully deleted the filter")
        .setColor(blue)
        .setTimestamp()
        .setFooter(message.author.tag)

        await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            embed : "Successfully deleted the filter!")
        .catch(() => {});
    }
};


exports.conf = {
    permission: "MANAGE_GUILD"
};

exports.help = {
    name: "removefilter",
    category: "Administration",
    description: "Removes a server wide regex filter",
    usage: "removefilter <filter id>",
    aliases: ["rmfilter"]
};