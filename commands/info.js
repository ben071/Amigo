const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require("discord.js");

exports.run = (client, message) => {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const embed = new Discord.RichEmbed()
        .setAuthor("Bot Information")
        .setColor("#9669FE")
        .setThumbnail(client.user.avatarURL)
        .setTimestamp()
        .addField("Memory Usage", `${(process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2)} MB`, true)
        .addField("Uptime", `${duration}`, true)
        .addField("Users", `${client.users.size.toLocaleString()}`, true)
        .addField("Servers", `${client.guilds.size.toLocaleString()}`, true)
        .addField("Channels", `${client.channels.size.toLocaleString()}`, true)
        .addField("Discord.js", `v${version}`, true)
        .addField("Website", "https://amigo.fun/", true);

    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    aliases: ["inv", "addme", "support", "stats"],
    permLevel: "User"
};

exports.help = {
    name: "info",
    category: "Miscelaneous",
    description: "Bot information.",
    usage: "info"
};