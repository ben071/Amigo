const errors = require("../utils/errors.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("I can't use this command if I can't create embeds").catch(err => {}).then(async m => {
            if (!m.deleted) await m.delete(60000) // 1 minute
        });
    }
    if (!args[0]) return errors.noArgs(message, exports);
    const mentioned = message.mentions.members.first();
    if (!mentioned) return errors.invalidUser(message);

    const prop = args[0].toLowerCase();
    if (prop === "boop" || prop === "cuddle" || prop === "hold" || prop === "kiss" || prop === "lick" || prop === "hug") {
        return client.furryAction(message, prop, mentioned); 
    } else {
        return errors.actionNotRecognised(message);
    };
};

exports.help = {
    name: "furry",
    category: "Fun",
    description: "Performs a furry action on a mentioned user.",
    usage: "furry <action> <mention>\nActions: boop, cuddle, hold, hug, kiss, lick"
};

exports.conf = {
    permission: "SEND_MESSAGES",
};