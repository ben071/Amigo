const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    const user = message.mentions.users.first();
    if (!user) return errors.invalidUser(message);

    await yiff.furrybot.sfw.kiss().then(r => {
        const embed = new Discord.RichEmbed()
            .setTitle(`${message.author.username} kissed ${user.username}!`)
            .setColor(config.blue)
            .setImage(r);
        message.channel.send(embed);
    });
};

exports.help = {
    name: "kiss",
    description: "Kisses another user.",
    usage: "kiss [mention]"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};