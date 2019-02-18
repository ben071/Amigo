const Discord = require("discord.js");
const config = require("../config.json");
const errors = require("../utils/errors.js");

module.exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;

    let user = message.guild.member(message.mentions.members.first() || message.author.id);
    let kickable = user.kickable ? "✅" : "❎";
    let bannable = user.bannable ? "✅" : "❎";
    let icon = user.user.displayAvatarURL;

    let nickname = user.nickname;
    if (nickname) {
        nickname = user.nickname;
    } else {
        nickname = "None"
    };

    let playingStatus = user.presence.game;
    if (playingStatus) {
        playingStatus = user.presence.game.name;
    } else {
        playingStatus = "None"
    }

    let embed = new Discord.RichEmbed()
        .setTitle(`Information about ${user.user.tag}`)
        .setColor(config.cyan)
        .setThumbnail(icon)
        .addField("Username:", user.user.tag, true)
        .addField("Nickname:", nickname, true)
        .addField("User ID:", user.id, true)
        .addField("Status:", user.presence.status, true)
        .addField("Playing Status:", playingStatus, true)
        .addField("Account Created:", user.user.createdAt.toUTCString(), true)
        .addField("Joined:", user.joinedAt.toUTCString(), true)
        .addField("Bannable:", bannable, true)
        .addField("Kickable:", kickable, true);
    message.channel.send(embed);
};

exports.help = {
    name: "userinfo",
    description: "Displays information about the mentioned user.",
    usage: "userinfo <@user>"
}

exports.conf = {
    permission: "SEND_MESSAGES"
}