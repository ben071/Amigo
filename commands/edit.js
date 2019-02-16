const config = require("../config.json");

exports.run = async (client, message, args) => {
    if(!message.member.permissions.has("MANAGE_GUILD") || !message.author.id === config.ownerID) return client.missingPermissions(message);

    if(args[0] === "prefix") {
        const currentPrefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
        const response = await client.awaitReply(message, `The \`${args[0]}\` is currently \`${currentPrefix}\`\nWhat would you like to set \`${args[0]}\` to?\n**Reply 'cancel' to cancel.**`);
        if (response === "cancel") return client.canceled(message);

        client.db.updatePrefix(message.guild.id, response);
        message.channel.send(`**${args[0].toProperCase()} successfully changed!**\n\`${currentPrefix}\` → \`${response}\``)
    }
};

exports.help = {
    name: "edit",
};