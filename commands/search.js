const { RichEmbed, ReactionCollector } = require("discord.js");

const page = (punishments, message, user) => {
    let pg = message.page;
    const embed = new RichEmbed()
    .setTitle(`Page ${message.page} of punishment history for ${user.tag}`)
    .setColor("#9669FE")
    for (let i = 1; i <= 5; i++) {
        const current = punishments[(5 * (pg - 1)) + i]
        if (!current) break;
        embed.addField(
            current.id,
            `**${current.type.toProperCase()}**\n**Reason**: ${current.reason}\n**Made at**: ${current.time}\n`,
            true
        );
    };

    if (embed.fields.length === 0) embed.setDescription("No punishments on this page");
    if (embed.fields.length === 0 && message.page === 1) embed.setDescription(`<@${user.id}> has no punishments`);
    return embed;
};

exports.run = async (client, message, args) => {
    const requiredPermissions = [
        "ADD_REACTIONS",
        "MANAGE_MESSAGES",
        "EMBED_LINKS"
    ];
    for (const permission in requiredPermissions) {  
        if (permission === "random") continue;
        if (!message.channel.permissionsFor(message.guild.me).has(requiredPermissions[permission])) {
            return await message.channel.send(`I am missing the required \`${requiredPermissions[permission]}\` permission to use this command`)
            .catch(err => {})
            .then(msg => msg.delete(10000).catch(err => {}));
        };
    };
    if (await client.helpArgs(client, message, args, exports)) return;
    let user = args[0] ? await client.fetchUser(args[0].replace(/\D/g, ""), false).catch(e => {}) : message.author;
    user = user ? user : message.author; // If the args[0] user is null or undefined, default to the message author

    const punishments = await client.db.r.table("punishments").run()
    .filter(punishment => punishment.offender === `${message.guild.id}-${user.id}`);
    const msg = await message.channel.send("Loading...")
    const collector = await new ReactionCollector(msg, (a,b) => true);//(reaction, user) => user.id === message.author.id);
    message.page = 1
    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");
    const emojis = ["⬅", "➡"]
    await msg.edit(page(punishments, message, user));
    collector.on("collect", async reaction => {
        if (message.author.id !== reaction.users.last().id) return;
        if (msg.deleted) return collector.stop();
        await reaction.remove(reaction.users.last());
        
        if (reaction.emoji.name ==="❌") return collector.stop();
        if (emojis.includes(reaction.emoji.name)) {
            message.page = reaction.emoji.name == "➡" ? message.page + 1 : message.page - 1;
            message.page = message.page < 1 ? 1 : message.page;
            message.page = punishments.length < 5 * (message.page - 1) + 1 ? message.page - 1 : message.page 
            await msg.edit(page(punishments, message, user));
            
        };
    });
    collector.on("end", async (collected, reason) => {
        if (!msg.deleted) await msg.delete();
    })

};


exports.help = {
    name: "search",
    category: "Moderation",
    description: "Lists punishments of a user",
    usage: "search [user]"
};

exports.conf = {
    permission: "READ_MESSAGES"
}