const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args) => {
    try {
    const role = message.guild.roles.find(r => r.name.toLowerCase() == "qotd")
    if (!role) return message.reply("I couldn't find the QOTD role")
    const QOTDmessage = args.join(" ")
    const channel = message.guild.channels.find(c => c.name.toLowerCase() == "qotd");
    if (!channel) return message.reply("I could not find the qotd channel, I believe it is called qotd if it isn't please contact a bot administrator");
    if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("I can't send message in <#"+channel.id+">")
    const annountcementChannel = message.guild.channels.find(c => c.name.toLowerCase() == "announcements");
    if (!annountcementChannel) return message.reply("I couldn't find the announcement channel");
    if (!annountcementChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.reply("I am not able to send message in <#"+annountcementChannel.id+">");
    channel.send(`\`\`\`${moment().format("Do MMMM YYYY")} \`\`\``);
    if (role.mentionable) {
        await annountcementChannel.send(`<@&${role.id}>\nToday's QOTD is from <@${message.author.id}>\n\n${QOTDmessage}\n\n\n\nPlease put your answer in <#${channel.id}>`)
    } else {
        if (role.position >= message.guild.me.highestRole.position) return message.reply("I am not able to manage that role to mention it")
        await role.setMentionable(true,"To mention for QOTD");
        await annountcementChannel.send(`<@&${role.id}>\nToday's QOTD is from <@${message.author.id}>\n\n${QOTDmessage}\n\nPlease put your answer in <#${channel.id}>`)
        await role.setMentionable(false,"To mention for QOTD")
    }
    message.channel.send("I have successfully sent today's QOTD, thank you for providing it")
} catch (err) {
    console.log(err)
}
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator"
  };
  
  exports.help = {
    name: "qotd",
    category: "Miscelanious",
    description: "Sends the qotd",
    usage: "qotd [today's qotd]"
  };
  
