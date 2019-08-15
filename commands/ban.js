const errors = require("../utils/errors.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    if (!args[0]) return errors.noArgs(message, exports);

    const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
    if (!await client.findLogs(client, message, modLogs)) return;
    const type = exports.help.name.toProperCase();

    let user = await client.fetchUser(args[0].replace(/[^0-9]/g,""), false).catch(err => {})
    if (!user) return errors.invalidUser(message, args);

    let reason = args.slice(1).join(" ");
    if (!reason) return errors.invalidReason(message);

    if ((message.guild.member(user) && !message.guild.member(user).bannable) || (user.id === message.guild.ownerID || user.id === message.author.id)) return errors.cannotPunish(message);
    await client.db.createPunish(client, message, type, user, reason, modLogs);
    message.guild.ban(user.id, {reason: reason});
    client.logger.log(`${message.author.username} has banned ${user.username} from ${message.guild} for ${reason}.`);
};

exports.help = {
    name: "ban",
    category: "Moderation",
    description: "Bans a user.",
    usage: "ban <@user> <reason>"
};

exports.conf = {
    permission: "BAN_MEMBERS",
};