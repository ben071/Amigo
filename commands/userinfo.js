const Discord = require("discord.js");
const config = require("../config.json");
const errors = require("../utils/errors.js");

module.exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!args[0]) return errors.noArgs(message, exports);

    const user = message.guild.member(message.guild.members.find(m => m.id == args[0].replace(/[^0-9]/g,"")));
    if (!user) return errors.invalidUser(message, args);
    
    const kickable = user.kickable ? "✅" : "❎";
    const bannable = user.bannable ? "✅" : "❎";
    const icon = user.user.displayAvatarURL;

    let nickname = user.nickname;
    if (nickname) {
        nickname = user.nickname;
    } else {
        nickname = "None"
    };

    if (user.presence.game !== null && user.presence.game.type === 2 && user.presence.game.name === "Spotify") {
        const trackURL = `https://open.spotify.com/track/${user.presence.game.syncID}`;
        playingStatus = `${trackURL}`
    } else if (user.presence.game) {
        playingStatus = user.presence.game.name;
    } else {
        playingStatus = "None";
    };

    const embed = new Discord.RichEmbed()
        .setTitle(`Information about ${user.user.tag}`)
        .setColor(config.blue)
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
    category: "Miscellaneous",
    description: "Displays information about the mentioned user.",
    usage: "userinfo <@user/id>"
}

exports.conf = {
    permission: "SEND_MESSAGES"
}