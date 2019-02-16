const Discord = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return message.reply("Commands are not available in DM");

    let prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run()

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    const cmd = client.commands.get(command)
    if (!cmd) return;

    cmd.run(client, message, args);
}