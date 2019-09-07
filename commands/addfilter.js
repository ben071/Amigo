const {RichEmbed} = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

const parseRegex = /("[^"]+"|[^ ]+) +("[^"]+"|[^ ]+) */im;

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
    if (args.length < 2) {
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
    let [regex, action] = [
                            options[1].replace(/^"|"$/g, ""),
                            options[2].replace(/^"|"$/g, "")
                        ];

    // Start of regex validation
    let err;
    regex = regex ? regex.replace(/(^"|"$)/gi, "") : regex;
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
    action = action ? action.replace(/(^"|"$)/gi, "").toLowerCase() : action;

    if (!punishments.find(a => a === action)) {
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
    await client.db.addGuildFilter(message.guild.id, regex, action);
    if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        const embed = new RichEmbed()
        .setTitle("Added Filter!")
        .addField("Regex", regex)
        .addField("Action", action)
        .setTimestamp()
        .setColor(config.blue)
        return await message.channel.send(embed)
        .catch(err => {})
    } else {
        return await message.channel.send("```\nAdded Filter!\nRegex: " + regex + "\nAction: " + action)
        .catch(err => {})
    };
};


exports.help = {
    name: "addfilter",
    category: "Administration",
    description: `Add's a regex filter that will trigger a specified action\nActions:\n${punishments.map(c => `\`${c}\``).join("\n")}`,
    usage: "addfilter \"<regex>\" \"<action>\"",
    aliases: []
};

exports.conf = {
    permission: "MANAGE_GUILD"
}