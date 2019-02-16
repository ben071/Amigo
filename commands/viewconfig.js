const Discord = require("discord.js");

exports.run = async (client, message) => {
    let prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run()
    let modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
    let adminRole = await client.db.r.table("guilds").get(message.guild.id).getField("adminRole").run()
    let modRole = await client.db.r.table("guilds").get(message.guild.id).getField("modRole").run()

    const embed = new Discord.RichEmbed()
        .setAuthor("Guild Configuration")
        .setColor("#92FEF9")
        .addField("Prefix:", prefix)
        .addField("Mod Logs:", modLogs)
        .addField("Admin Role:", adminRole)
        .addField("Mod Role:", modRole)
        .setFooter(`Use ${prefix}editconfig to edit this.`);

    message.channel.send(embed);

};

exports.conf = {
    enabled: true,
    aliases: ["view"],
    permLevel: "User"
  };
  
exports.help = {
    name: "viewconfig",
    category: "Administration",
    description: "View the configuration for the server.",
    usage: "viewconfig"
};