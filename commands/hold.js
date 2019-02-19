const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    const user = message.mentions.users.first();
    if (!user) return errors.invalidUser(message);

    await yiff.furrybot.sfw.hold().then(r => {
        const embed = new Discord.RichEmbed()
            .setTitle(`${message.author.username} held ${user.username}!`)
            .setColor(config.blue)
            .setImage(r);
        message.channel.send(embed);
    });
};

exports.help = {
    name: "hold",
    category: "Fun",
    description: "Holds another user.",
    usage: "hold [@user]"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};