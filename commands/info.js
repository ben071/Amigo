const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const {RichEmbed} = require("discord.js");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send("I can't run this command if I can't create embeds").catch(err => {});
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const embed = new RichEmbed()
        .setAuthor("Bot Information")
        .setColor("#9669FE")
        .setThumbnail(client.user.avatarURL)
        .addField("Memory Usage", `${(process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2)} MB`, true)
        .addField("Uptime", `${duration}`, true)
        .addField("Users", `${client.users.size}`, true)
        .addField("Servers", `${client.guilds.size}`, true)
        .addField("Channels", `${client.channels.size}`, true)
        .addField("Commands", `${client.commands.size}`, true)
        .addField("Discord.js", `v${version}`, true)
        .addField("Website", "https://amigo.fun/", true)
        .addField("Credits", "<@265569046425108481> - Owner\n<@291607550825332736> - Owner\n<@503105733701926922> - Developer") // Please don't remove these :3, if you do develop this further, just add your name on as a contributor.
        .setFooter(message.author.tag, message.author.avatarURL);

    message.channel.send(embed);
};

exports.help = {
    name: "info",
    category: "Miscellaneous",
    description: "Bot information.",
    usage: "info"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};