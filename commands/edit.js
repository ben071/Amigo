const errors = require("../utils/errors.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    if (!args[0]) return errors.noArgs(message, exports);

    if (args[0].toLowerCase() === "prefix") {
        const currentPrefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
        const response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentPrefix}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
        if (response === "cancel") return client.canceled(message);

        client.db.updatePrefix(message.guild.id, response);
        return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentPrefix}\` → \`${response}\``)
    } else if (args[0].toLowerCase() === "modlogs") {
        const currentLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
        const response = await client.awaitReply(message, `The \`${args[0].toLowerCase()}\` is currently \`${currentLogs}\`\nWhat would you like to set \`${args[0].toLowerCase()}\` to?\n**Reply 'cancel' to cancel.**`);
        if (response === "cancel") return client.canceled(message);

        client.db.updateLogs(message.guild.id, response);
        return message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentLogs}\` → \`${response}\``)
    } else {
        errors.settingNotRecognised(message);
    }
};

exports.help = {
    name: "edit",
    category: "Administration",
    description: "Edits the guild's configuration for the bot.",
    usage: "edit [value]"
};

exports.conf = {
    permission: "MANAGE_GUILD",
};