const errors = require("../utils/errors.js");
const config = require("../config.json");
const Discord = require("discord.js")
module.exports = async (client, message) => {
    if (message.author.bot) return;
    //message =  await client.channels.find(c => c.id == 518827321629736961).fetchMessage(`580812757734260746`)
    if (message.author.bot) return;
    if (!message.guild) { //return message.channel.send("Commands are not available in DM");
        if (message.content.startsWith(config.defaultPrefix)) {
            return;
        } else {
            const dmEmbed = new Discord.RichEmbed()
            .setTitle("DM Recieved")
            .setDescription(`DM from ${message.author.tag} (${message.author.id})\n**Content**:\n${message.content}`)
            .setThumbnail(message.author.avatarURL || message.author.defaultAvatarURL)
            .addField(`Mutual Servers with ${client.user.username}`, client.guilds.filter(g => g.members.find(m => m.id == message.author.id)).size)
            .addField("Account created on", message.author.createdAt.toUTCString())
            .setColor(config.red)
            .setTimestamp();
            const owner = await client.fetchUser(config.ownerID).catch(err => {});
            if (!owner) return;
            if (message.attachments.size != 0) {
                let attachments = "";
                message.attachments.forEach(attachment => {
                    attachments += attachment.url + "\n"
                });
                owner.send(dmEmbed).catch(err => {});
                return owner.send("With attachments: " + attachments)
            }
            return owner.send(dmEmbed).catch(err => {});
        }
    };
    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
    let prefix;

    prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run().catch(async err => {
        await client.db.createGuild(message.guild);
    });

    if (!prefix) {
        prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    };

    const prefixes = [prefix, `<@!${client.user.id}>`, `<@${client.user.id}>`];
    
    prefix = prefixes.find(p => message.content.startsWith(p));
    
    if (!prefix) return;

    if (message.content.indexOf(prefix) !== 0) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    if (cmd.conf.NSFWCommand && !message.channel.nsfw) {
        return errors.notNSFWChannel(message);
    }

    try {
    client.logger.log(`[CMD] ${message.author.tag} (${message.author.id}) ran command ${cmd.help.name} in ${message.guild.name} (${message.guild.id})`)
    cmd.run(client, message, args);
    } catch (e) {
        client.logger.error(`From ${cmd.help.name}: ${e}`)
    }
};