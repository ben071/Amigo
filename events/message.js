const errors = require("../utils/errors.js");
const config = require("../config.json");
const {RichEmbed} = require("discord.js");

const trim = (str, toReplace) => {
    let regexOne = new RegExp(`^[/${toReplace}]+`);
    let regexTwo = new RegExp(`[${toReplace}/]+$`);
    return str.replace(regexOne, "").replace(regexTwo, "");
};
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) { 
        if (message.content.startsWith(config.defaultPrefix)) {
            return;
        } else {
            const dmEmbed = new RichEmbed()
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
    let prefix;

    prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run().catch(async err => {
        await client.db.createGuild(message.guild);
    });

    if (!prefix) {
        prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    };

    let bypass = await client.db.r.table("guilds").get(message.guild.id).hasFields("bypass").run();
    bypass = bypass ? await client.db.r.table("guilds").get(message.guild.id).getField("bypass").run() : null;
    let stop;
    if (!(bypass && Boolean(message.member.roles.get(bypass)))) { // Allow bypass users to skip filters
        let filters = await client.db.r.table("filters").run()
        filters = filters.filter(filter => filter.channel &&  filter.channel == message.channel.id && message.guild.id == filter.guild)
        
        for (let filter in filters) {
            if (filter == "random") continue;
            if (stop) break;
            const flags = filters[filter].regex.match("\/.+\/(.+)") ? filters[filter].regex.match("\/.+\/(.+)")[1].replace(/\/\//g, "/") : null;
            let regex = await flags ? trim(filters[filter].regex, flags)  : trim(filters[filter].regex, " /");
            if (flags) regex = new RegExp(regex, flags);
            if (!flags) regex = new RegExp(regex);
            const match = message.content.match(regex);
            if (match) {
                stop = true;
                if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                    await message.delete()
                    .catch(err => {});
                };
                const action = filters[filter].action;
                    if (action === "ban") {
                        if (!message.member.bannable) {
                            return;
                        };
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        await message.member.ban("[AUTOMOD FILTER]")
                        .catch(err => {});
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Ban",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been banned from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        });
                    };
                    if (action === "kick") {
                        if (!message.member.kickable) {
                            return;
                        };
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        await message.member.kick("[AUTOMOD FILTER]")
                        .catch(err => {});
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Kick",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been kicked from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        }); 
                    };
                    if (action === "softban") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        if (!message.member.bannable) return;
                        await message.member.ban({days: 1, reason: "[AUTOMOD FILTER] SOFTBAN"})
                        await message.guild.unban(message.author.id, "[AUTOMOD FILTER SOFTBAN]");
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Softban",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been softbanned from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        });
                    }
                    if (action === "strike") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                            await client.db.r.table("punishments").insert([{
                                guildid: message.guild.id,
                                type: "Strike",
                                punisher: `${message.guild.id}-${client.user.id}`,
                                offender: `${message.guild.id}-${message.author.id}`,
                                reason: "[AUTOMOD FILTER]",
                                time: client.db.r.now()
                            }]).run()
                            .then(async r => {
                                const embed = new RichEmbed()
                                .setTitle(`${client.user.username} Automod`)
                                .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been stricken in ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                                .setColor(client.config.red)
                                .setTimestamp()
                                .setFooter("ID: " + r.generated_keys);
                                if (logs) {
                                    const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                    if (channel) {
                                        await channel.send(embed)
                                        .catch(err => {});
                                    };
                                };
                                await message.author.send(embed)
                                .catch(err => {});    
                            });
                        };
                    if (action === "warn") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()                    
                            await client.db.r.table("punishments").insert([{
                                guildid: message.guild.id,
                                type: "Warn",
                                punisher: `${message.guild.id}-${client.user.id}`,
                                offender: `${message.guild.id}-${message.author.id}`,
                                reason: "[AUTOMOD FILTER]",
                                time: client.db.r.now()
                            }]).run()
                            .then(async r => {
                                const embed = new RichEmbed()
                                .setTitle(`${client.user.username} Automod`)
                                .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been warned in ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                                .setColor(client.config.red)
                                .setTimestamp()
                                .setFooter("ID: " + r.generated_keys);
                                if (logs) {
                                    const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                    if (channel) {
                                        await channel.send(embed)
                                        .catch(err => {});
                                    };
                                };    
                                await message.author.send(embed)
                                .catch(err => {});
                            });
                        };          
                };
            };
        if (stop) return;
        stop = false;
        filters = await client.db.r.table("filters").run()
        filters = filters.filter(filter => !filter.channel && message.guild.id === filter.guild);
        for (let filter in filters) {
            if (filter == "random") continue;
            if (stop) break;
            const flags = filters[filter].regex.match("\/.+\/(.+)") ? filters[filter].regex.match("\/.+\/(.+)")[1].replace(/\/\//g, "/") : null;
            let regex = await flags ? trim(filters[filter].regex, flags)  : trim(filters[filter].regex, " /");
            if (flags) regex = new RegExp(regex, flags);
            if (!flags) regex = new RegExp(regex);
            const match = message.content.match(regex);
            if (match) {
                stop = true;
                if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                    await message.delete()
                    .catch(err => {});
                };
                const action = filters[filter].action
                    if (action === "ban") {
                        if (!message.member.bannable) {
                            return;
                        };
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        await message.member.ban("[AUTOMOD FILTER]")
                        .catch(err => {});
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Ban",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been banned from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        });
                    };
                    if (action === "kick") {
                        if (!message.member.kickable) {
                            return;
                        };
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        await message.member.kick("[AUTOMOD FILTER]")
                        .catch(err => {});
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Kick",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been kicked from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        }); 
                    };
                    if (action === "softban") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                        if (!message.member.bannable) return;
                        await message.member.ban({days: 1, reason: "[AUTOMOD FILTER] SOFTBAN"})
                        await message.guild.unban(message.author.id, "[AUTOMOD FILTER SOFTBAN]");
                        await client.db.r.table("punishments").insert([{
                            guildid: message.guild.id,
                            type: "Softban",
                            punisher: `${message.guild.id}-${client.user.id}`,
                            offender: `${message.guild.id}-${message.author.id}`,
                            reason: "[AUTOMOD FILTER]",
                            time: client.db.r.now()
                        }]).run()
                        .then(async r => {
                            const embed = new RichEmbed()
                            .setTitle(`${client.user.username} Automod`)
                            .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been softbanned from ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                            .setColor(client.config.red)
                            .setTimestamp()
                            .setFooter("ID: " + r.generated_keys);
                            if (logs) {
                                const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                if (channel) {
                                    await channel.send(embed)
                                    .catch(err => {});
                                };
                            };
                            await message.author.send(embed)
                            .catch(err => {});
                            return;
                        });
                    }
                    if (action === "strike") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()
                            await client.db.r.table("punishments").insert([{
                                guildid: message.guild.id,
                                type: "Strike",
                                punisher: `${message.guild.id}-${client.user.id}`,
                                offender: `${message.guild.id}-${message.author.id}`,
                                reason: "[AUTOMOD FILTER]",
                                time: client.db.r.now()
                            }]).run()
                            .then(async r => {
                                const embed = new RichEmbed()
                                .setTitle(`${client.user.username} Automod`)
                                .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been stricken in ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                                .setColor(client.config.red)
                                .setTimestamp()
                                .setFooter("ID: " + r.generated_keys);
                                if (logs) {
                                    const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                    if (channel) {
                                        await channel.send(embed)
                                        .catch(err => {});
                                    };
                                };
                                await message.author.send(embed)
                                .catch(err => {});    
                            });
                        };
                    if (action === "warn") {
                        const logs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run()                    
                            await client.db.r.table("punishments").insert([{
                                guildid: message.guild.id,
                                type: "Warn",
                                punisher: `${message.guild.id}-${client.user.id}`,
                                offender: `${message.guild.id}-${message.author.id}`,
                                reason: "[AUTOMOD FILTER]",
                                time: client.db.r.now()
                            }]).run()
                            .then(async r => {
                                const embed = new RichEmbed()
                                .setTitle(`${client.user.username} Automod`)
                                .setDescription(`<@${message.author.id}> (ID: ${message.author.id}, Username: ${message.author.tag}) has been warned in ${message.guild.name} for using filtered words in <#${message.channel.id}>\nFiltered Word: \`${match[0].replace(/`/g, "\`")}\``)
                                .setColor(client.config.red)
                                .setTimestamp()
                                .setFooter("ID: " + r.generated_keys);
                                if (logs) {
                                    const channel = message.guild.channels.filter(c => c.permissionsFor(message.guild.me).has("EMBED_LINKS")).find(c => c.name === logs);
                                    if (channel) {
                                        await channel.send(embed)
                                        .catch(err => {});
                                    };
                                };    
                                await message.author.send(embed)
                                .catch(err => {});
                            });
                        };          
                };
            };
        };
    if (stop) return;
    
    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

    const prefixes = [prefix, `<@!${client.user.id}>`, `<@${client.user.id}>`];
    
    prefix = prefixes.find(p => message.content.startsWith(p));
    
    if (!prefix) return;

    if (message.content.indexOf(prefix) !== 0) return;
    message.prefix = prefix
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
}