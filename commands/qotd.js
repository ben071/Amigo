const moment = require("moment");
const Discord = require("discord.js");
require("moment-duration-format");

exports.run = async (client, message) => {
    try {
        const role = message.guild.roles.find(r => r.name.toLowerCase() == "qotd")
        if (!role) return message.reply("I couldn't find the QOTD role")

        const questionResponse = await client.awaitReply(message, "Give me a question.");
        if (questionResponse == 'cancel') return message.reply("Canceled.");

        const thoughtResponse = await client.awaitReply(message, "Give me a thought.");
        if (thoughtResponse == 'cancel') return message.reply("Canceled.");

        const factResponse = await client.awaitReply(message, "Give me a fact.");
        if (factResponse == 'cancel') return message.reply("Canceled.");
        
        const channel = message.guild.channels.find(c => c.name.toLowerCase() == "qotd");

        if (!channel) return message.reply("I could not find the qotd channel, I believe it is called qotd if it isn't please contact a bot administrator");
        if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.channel.send("I can't send message in <#"+channel.id+">")

        const announcementChannel = message.guild.channels.find(c => c.name.toLowerCase() == "announcements");
        if (!announcementChannel) return message.reply("I couldn't find the announcement channel");
        if (!announcementChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return message.reply("I am not able to send message in <#"+announcementChannel.id+">");

        const date = moment().format("Do MMMM YYYY");
        channel.send(`\`\`\`${date} \`\`\``);

        const embed = new Discord.RichEmbed()
            .setTitle(`Question of the Day for ${date}`)
            .setColor("#9669FE")
            .addField("Question:", questionResponse)
            .addField("Thought:", thoughtResponse)
            .addField("Fact:", factResponse)
            .setFooter(`${message.author.tag}`, message.author.avatarURL)

        if (role.mentionable) {
            await announcementChannel.send(`<@&${role.id}>`, embed)
        } else {
            if (role.position >= message.guild.me.highestRole.position) return message.reply("I am not able to manage that role to mention it")
            await role.setMentionable(true,"To mention for QOTD");
            await announcementChannel.send(`<@&${role.id}>`, embed)
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
  
