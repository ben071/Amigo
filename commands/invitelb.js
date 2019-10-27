const { RichEmbed, ReactionCollector } = require("discord.js");
const { blue, red } = require("../config.json");
const ClientDataResolver = require("discord.js/src/client/ClientDataResolver");

function lb(scores, page) {
    let embed = new RichEmbed()
    .setTitle("Invite Leaderboard")
    .setColor()
    let currentScore;
    for (let i = 1; i != 6; i++) {
        currentScore = scores[(page * 5) + i  - 1];
        if (!currentScore) break;
        embed.addField(`${i + (page * 5)})\n${currentScore.tag}`, currentScore.total + " invited users");
    }
    if (embed.fields.size === 0) embed.setDescription("No invites on this page!");
    return embed;
}

exports.run = async (client, message, args) => {
    const requiredPermissions = [
        "MANAGE_MESSAGES",
        "ADD_REACTIONS",
        "EMBED_LINKS"
    ]; // Handle Manage Guild a bit differently
    for (let permission in requiredPermissions){
        if (permission == "random") continue; // No-idea why it just spits out random at the end of the loop

        permission = requiredPermissions[permission];

        if (!message.channel.permissionsFor(message.guild.me).has(permission)){
            return await message.channel.send(
                !message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
                {embed: {
                    color: ClientDataResolver.ClientDataResolver.resolveColor(red),
                    title: "Missing Permissions",
                    description: `To run this command, I need the ${
                        permission.toLowerCase().replace("(^|_)(\w)", function(x){
                            return x.toUpperCase() + " ";
                        })
                    } permission!`
                }} : 
                `To run this command, I need the ${
                    permission.toLowerCase().replace("(^|_)(\w)", function(x){
                        return x.toUpperCase() + " ";
                    })
                } permission!`
            )
        };
    };
    if (!message.guild.me.hasPermission("MANAGE_GUILD",  checkAdmin = true, checkOwner = true)){
        return await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            {embed: {
                color: ClientDataResolver.resolveColor(red),
                title: "Missing Permissions",
                description: `To run this command, I need the ${
                    permission.toLowerCase().replace("(^|_)(\w)", function(x){
                        return x.toUpperCase() + " ";
                    })
                } permission!`
            }} : 
            `To run this command, I need the Manage Server permission`
        )
    };
    let scores = [];
    const invites = await message.guild.fetchInvites();
    invites.forEach(i => {
        if (!i.inviter) return;
        if (scores.find(s => s.user === i.inviter.id)) {
            let location;
            for (let x = 0; x != scores.length; x++) {
                if (scores[x].user === i.inviter.id) {
                    location = x;
                } 
            }
            scores[location] = {
                user: scores[location].user,
                total: scores[location].total + i.uses,
                tag: scores[location.tag]
            };
        } else {
            scores.push({
                user: i.inviter.id,
                total: i.uses,
                tag: i.inviter.tag
            });
        }
    });
    scores = scores.sort((a,b) => (a.total < b.total) ? 1 : -1);
    const msg = await message.channel.send("Loading...")
    const collector = await new ReactionCollector(msg, (a,b) => true);//(reaction, user) => user.id === message.author.id);
    message.page = 1
    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");
    const emojis = ["⬅", "➡"]
    await msg.edit(lb(scores, message.page - 1));
    collector.on("collect", async reaction => {
        if (message.author.id !== reaction.users.last().id) return;
        for (let permission in requiredPermissions){
            if (permission == "random") continue;
            permission = requiredPermissions[permission];
            if (!message.channel.permissionsFor(message.guild.me).has(permission)){
                await collector.stop();
                return await message.channel.send(
                    message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
                    { embed: {
                        color: ClientDataResolver.resolveColor(red),
                        title: "Missing Permissions",
                        description: `To run this command, I need the ${
                            permission.toLowerCase().replace("(^|_)(\w)", function(x){
                                return x.toUpperCase() + " ";
                            })
                        } permission!`
                    } } : 
                    `To run this command, I need the ${
                        permission.toLowerCase().replace("(^|_)(\w)", function(x){
                            return x.toUpperCase() + " ";
                        })
                    } permission!`
                )
            };
        }    
        if (msg.deleted) return collector.stop();
        await reaction.remove(reaction.users.last());    
        if (reaction.emoji.name ==="❌") return collector.stop();
        if (emojis.includes(reaction.emoji.name)) {
            message.page = reaction.emoji.name == "➡" ? message.page + 1 : message.page - 1;
            message.page = message.page < 1 ? 1 : message.page;
            message.page = scores.length < 5 * (message.page - 1) + 1 ? message.page - 1 : message.page;
            await msg.edit(lb(scores, message.page - 1));
            
        };
    });
    
    collector.on("end", async (collected, reason) => {
        await msg.delete();
    })

};


exports.help = {
    name: "invitelb",
    category: "Fun",
    description: "Lists the server invite leaderboard",
    usage: "invitelb"
};

exports.conf = {
    permission: "READ_MESSAGES"
}