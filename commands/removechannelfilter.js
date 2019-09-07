const {RichEmbed} = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    
    if (!args[0]) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Missing Argument(s)")
            .setDescription(`You did not provide any arguments to this command, please check the usage of this command using ${message.prefix}${exports.help.name} help`)
            .setTimestamp()
            .setColor(config.red)

            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send(`You did not provide any arguments to this command, please check the usage of this command using ${message.prefix}${exports.help.name} help`)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };

    const exists = await client.db.r.table("filters").get(args[0]).run();

    if (exists && exists.guild === message.guild.id) {
        if (!exists.channel) {
            if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
                const noPerm = new RichEmbed()
                .setTitle("Missing permissions!")
                .setDescription("This is a server wide filter, you need to run the `removefilter` command to be able to remove it!")
                .setTimestamp()
                .setColor(config.red)
                .setFooter(message.author.tag)
            return await message.channel.send(noPerm)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
            } else {
                return await message.channel.send("This is a server wide filter, you need to run the `removefilter` command to be able to remove it!")
                .catch(err => {})
                .then(async msg => await msg.delete(10000).catch(err => {}));
                
            }
        }
        const channel = message.guild.channels.find(c => c.id === exists.channel);
        await client.db.r.table("filters").get(args[0]).delete().run();
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Filter successfully deleted")
            .addField("Channel", channel ? `<#${channel.id}>` : "Deleted Channel")
            .addField("Filter", `${exists.regex.replace(/`/g, "\`")}`)
            .setTimestamp()
            .setFooter(message.author.tag)
            .setColor(config.blue);

            return await message.channel.send(embed)
            .catch(err => {});
        } else {
            return await message.channel.send(
                "```Filter successfully deleted!\nChannel: " + (channel ? `<#${channel.id}>` : "Deleted Channel") + "\nFilter:" + `${exists.regex.replace(/`/g, "\`")}\`\`\`` 
            ).catch(err => {});
        };
    
    } else if (exists && exists.guild !== message.guild.id) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Invalid Filter ID")
            .setDescription("The filter ID you gave was not for a filter in this server")
            .setTimestamp()
            .setFooter(message.author.tag)
            .setColor(config.red);

            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("The filter ID you gave was not for a filter in this server")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        }    
    } else if (!exists) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Invalid Filter ID")
            .setDescription("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .setTimestamp()
            .setFooter(message.author.tag)
            .setColor(config.red);
          
            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("The id you provided was not a valid filter id, this could mean you have already deleted it")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        }
    };
};

exports.conf = {
    permission: "MANAGE_CHANNELS"
};
exports.help = {
    name: "removechannelfilter",
    category: "Administration",
    description: "Removes a channel specific regex filter",
    usage: "removechannelfilter <filter id>",
    aliases: ["rmcf", "rmchannelfilter"]
};
