const errors = require("../utils/errors.js")

module.exports = async (client, message) => {
    await client.db.createGuild(message.guild);
    if (message.author.bot) return;
    if (!message.guild) return message.reply("Commands are not available in DM");

    if (message.guild) {
        if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
    }

    let prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run()

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    if (cmd.conf.NSFWCommand && !message.channel.nsfw) {
        return errors.notNSFWChannel(message);
    };

    cmd.run(client, message, args);
}