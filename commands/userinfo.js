const {RichEmbed} = require("discord.js");
const config = require("../config.json");
const errors = require("../utils/errors.js");

module.exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    let user = args[0] ? await client.fetchUser(args[0].replace(/[^0-9]/g,""), false).catch(err => {}) : message.author;
    const member = message.guild.member(user);
    const punishments = await client.db.r.table("punishments").run()
    .filter(punishment => punishment.offender === `${message.guild.id}-${user.id}`);
    
    if (user && !member) {
        if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            return await message.channel.send(`Username: ${user.tag}\nUser ID: ${user.id}\nCreated: ${user.createdAt.toUTCString()}`)
        };
        const userInfo = new RichEmbed()
        .setTitle(`Information about ${user.tag}`)
        .setThumbnail(user.displayAvatarURL)
        .addField("Username", user.tag, true)
        .addField("User ID", user.id, true)
        .addField("Created", user.createdAt.toUTCString(), true)
        .addField("Strikes", punishments.length, true) 
        .setTimestamp()
        .setColor(config.blue);
        return await message.channel.send(userInfo).catch(err => {})
    };
    if (!user) return errors.invalidUser(message, args);
    user = member ? member : null;
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
    if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        const embed = new RichEmbed()
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
            .addField("Kickable:", kickable, true)
            .addField("Strikes", punishments.length, true) 
            return await message.channel.send(embed).catch(err => {});
    };
    return await message.channel.send(`About ${user.user.tag}\nUsername: ${user.user.tag}\nNickname: ${nickname}\nUser ID: ${user.id}\nStatus: ${user.presence.status}\nPlaying Status: ${playingStatus}\nAccount Created: ${user.user.createdAt.toUTCString()}\nJoined: ${user.joinedAt.toUTCString()}\nBannable: ${bannable}\nKickable: ${kickable}`).catch(err => {});
};

exports.help = {
    name: "userinfo",
    category: "Miscellaneous",
    description: "Displays information about the mentioned user.",
    usage: "userinfo <@user/id>",
    aliases: ["profile"]
}

exports.conf = {
    permission: "SEND_MESSAGES"
}