const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    if (!args[0]) return errors.noArgs(message, exports);

    const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
    if (!await client.findLogs(client, message, modLogs)) return;

    let user = message.guild.member(message.mentions.members.first());
    if (!user) return errors.invalidUser(message, args);

    let reason = args.slice(1).join(" ");
    if (!reason) return errors.invalidReason(message);

    if (user.hasPermission(exports.conf.permission)) return errors.cannotPunish(message);

    let embed = new Discord.RichEmbed()
        .setTitle("Amigo Logs")
        .setDescription("**Action: Ban**")
        .setColor(config.red)
        .setTimestamp()
        .addField("User:", `${user} (${user.id})`, true)
        .addField("Action by:", `${message.author} (${message.author.id})`, true)
        .addField("Reason:", reason, true);
    let modLogsChannel = message.guild.channels.find(c => c.name === modLogs);
    modLogsChannel.send(embed);
    try {
        await user.send(embed);
    } catch (err) {
        errors.couldNotDM(message);
    }
    message.guild.member(user).ban(reason);
    client.logger.log(`${message.author.username} has banned ${user.user.username} from ${message.guild} for ${reason}.`);
};

exports.help = {
    name: "ban",
    description: "Bans a user.",
    usage: "ban [@user] <reason>"
};

exports.conf = {
    permission: "BAN_MEMBERS",
};