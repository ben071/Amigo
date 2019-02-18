const Discord = require("discord.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;

    await yiff.furrybot.sfw.fursuit().then(r => {
        const embed = new Discord.RichEmbed()
            .setColor(config.blue)
            .setImage(r);
        message.channel.send(embed);
    });
};

exports.help = {
    name: "fursuit",
    description: "Displays a random fursuit.",
    usage: "fursuit"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};