const errors = require("../utils/errors.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!args[0]) return errors.noArgs(message, exports);
    const user = message.mentions.users.first();
    if (!user) return errors.invalidUser(message);

    const prop = args[0].toLowerCase();
    if (prop === "boop" || prop === "cuddle" || prop === "hold" || prop === "kiss" || prop === "lick" || prop === "hug") {
        return client.furryAction(message, prop, user); 
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