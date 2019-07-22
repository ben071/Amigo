const {RichEmbed} = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

const parseRegex = /("[^"]+"|[^ ]+) +("[^"]+"|[^ ]+) +("[^"]+"|[^ ]+) */im

const punishments = [
    "ban",
    "kick",
    "strike",
    "softban",
    "warn"
];

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    
    if (args.length < 3) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Missing Argument(s)")
            .setDescription([
                "You did not provide enough arguments to run this command",
            `The usage of this command can be checked with ${message.prefix}addchannelfilter help`]
            .join("\n"))
            .setColor(config.red)
            .setTimestamp()

            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send([
                "You did not provide enough arguments to run this command,"
            `The usage of this command can be checked with ${message.prefix}addchannelfilter help`]
            .join("\n"))
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };
    const options = args.join(" ").match(parseRegex)
    let [channel, regex, action] = [options[1], options[2], options[3]]
    // Start of channel argument validation
    if (!channel) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Missing Argument(s)")
            .setDescription("You did not provide a channel argument")
            .setColor(config.red)
            .setTimestamp()

            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("Missing channel argument")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };
    channel = channel ? channel.trim(/[" ]+/g, "") : channel;
    channel = message.guild.channels.find(c => 
        c.id == channel.replace(/[^0-9]/g,"") || c.name.toLowerCase() == channel.replace(/^#/g,"")
    );

    if (!channel) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        const embed = new RichEmbed()
        .setTitle("Invalid Channel!")
        .setDescription(`I can't find the channel ${options[1]} please make sure this is either the name of the channel, the channel mention or the channel ID`)
        .setColor(config.red)
        .setTimestamp()

        return await message.channel.send(embed)
        .catch(err => {})
        .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send("Invalid channel provided!")
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };
    // End of channel validation
    // Start of regex validation
    let err;
    regex = regex ? regex.trim(/[" ]+/g, "") : regex;
    try {
        new RegExp(regex);
    } catch (error) {
        err = error.message;
    };

    if (err) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
                const embed = new RichEmbed()
                .setTitle("Invalid Regex")
                .setDescription(err)
                .setColor(config.red)
                .setTimestamp()
        
                return await message.channel.send(embed)
                .catch(err => {})
                .then(async msg => await msg.delete(10000).catch(err => {}));
            } else {
                return await message.channel.send(err)
                .catch(err => {})
                .then(async msg => await msg.delete(10000).catch(err => {}));
            };
    };

    //End of regex validation

    //Start of punishment validation

    action = action ? action.trim(/[" ]+/g, "").toLowerCase() : action;
    if (!punishments.find(a => a == action)) {
        if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            const embed = new RichEmbed()
            .setTitle("Invalid Action")
            .setDescription(`${action} is not a valid action, available actions:\n${punishments.map(c => `\`${c}\``).join("\n")}`)
            .setColor(config.red)
            .setTimestamp()
    
            return await message.channel.send(embed)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        } else {
            return await message.channel.send(`${action} is not a valid action, available actions:\n${punishments.join("\n")}`)
            .catch(err => {})
            .then(async msg => await msg.delete(10000).catch(err => {}));
        };
    };
    await client.db.addChannelFilter(channel, regex, action);
    if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        const embed = new RichEmbed()
        .setTitle("Added Filter!")
        .addField("Channel", `<#${channel.id}>`)
        .addField("Regex", regex)
        .addField("Action", action)
        .setTimestamp()
        .setColor(config.blue)
        return await message.channel.send(embed)
        .catch(err => {})
    } else {
        return await message.channel.send("```\nAdded Filter!\nChannel: #" + channel.name + "\nRegex: " + regex + "\nAction: " + action)
        .catch(err => {})
    };
};


exports.help = {
    name: "addchannelfilter",
    category: "Administration",
    description: `Add's a regex filter that will trigger a specified action\nActions:\n${punishments.map(c => `\`${c}\``).join("\n")}`,
    usage: "addchannelfilter \"<channel>\" \"<regex>\" \"<action>\"",
    aliases: ["acf","addfilter"]
};

exports.conf = {
    permission: "MANAGE_CHANNELS"
}