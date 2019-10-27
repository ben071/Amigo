const { RichEmbed, Collection, ReactionCollector } = require("discord.js");

const subcommands = [
    "add",
    "list",
    "remove",
    "send",
    "setup",
    "dumpconf"
];

const awaitReply = async (msg, question, limit = 300000, filter = m => m.author.id === msg.author.id) => { 
    // similar to client.awaitReply but returns the message as well as the response
    const prompt = await msg.channel.send(question);
    try {
        const collected = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: limit,
            errors: ["time"]
        });
        return [collected.first().content, prompt, collected.first()];
    } catch (e) {
        return [null, null, null];
    };
};

const pages = async (page, items, client) => {
    const embed = new RichEmbed()
    .setTitle("QOTD")
    .setColor(client.config.blue);
    let currentPage;
    let user;
    for (let i = 0; i != 2; i++) {
        currentPage = items[(2 * (page - 1)) + i];
        if (!currentPage) break;
        user = await client.fetchUser(currentPage.author).catch(() => {});
        try {
            embed.addField(
                `Added by: ${user ? user.tag : "Unknown User"}`,
                `**__Question__**\n*${currentPage.question}*\n**__Fact__**\n*${currentPage.fact}*\n**__Thought__**\n*${currentPage.thought}*\n**__ID__**\n*${currentPage.id}*`
            );
        } catch (err) {
            console.log(err)
            continue;
        };
    };
    if (embed.fields.length === 0) embed.setDescription("None Available");
    return embed;
};

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    const messages = new Collection() // Store any messages sent / recieved in here to bulk delete at the end
    let roleStore = await client.db.r.table("qotd").run().filter(r => r.guild == message.guild.id && r.type === "conf");
    roleStore = roleStore ? roleStore[0] : null;
    let permissionRole;
    if (roleStore) {
        permissionRole = message.guild.roles.find(r => r.id === roleStore.permission);
    }
    if (!((permissionRole && message.member.roles.get(permissionRole.id)) || message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES"))) {
        const noPerms = new RichEmbed()
        .setTitle("Missing permissions!")
        .setDescription("You need the **Manage Messages** permission or a role set by your administrator to use this command!")
        .setColor(client.config.red)
        .setTimestamp();

        return await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            noPerms :
            "You need the **Manage Messages** permission or a role set by your administrator to use this command!"
        ).catch(e => console.log(e)).then(async m => await m.delete(60000).catch(e => console.log(e)));
    };
    args[0] = !args[0] ? "list" : args[0]; // Default to list if no sub-command is provided 
    if (subcommands.indexOf(args[0] ? args[0].toLowerCase() : undefined) === -1) {
        const noSubCommand = new RichEmbed()
        .setTitle(
            Boolean(args[0]) ? 
            `${args[0]} is not a valid sub-command` : 
            "Missing Arguments"
        )
        .setDescription("__Valid Sub-Commands__\n" + subcommands.join("\n"))
        .setColor(client.config.red)
        .setTimestamp()

        return await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
            noSubCommand : 
            "Invalid Sub-Command provided\n__Valid Sub-Commands__" + subcommands.join("\n")
        ).catch(e => console.log(e)).then(async m => await m.delete(60000).catch(e => console.log(e)));
    };

    if (args[0].toLowerCase() === "add") {
        let [question, qPrompt, qMsg] = await awaitReply(message, "Please enter a question\nYou may enter `cancel` to cancel this command", 60000)
        if (qPrompt) messages.set(qPrompt.id, qPrompt);
        if (qMsg) messages.set(qMsg.id, qMsg);
            
        if (!qMsg || question.trim().toLowerCase() === "cancel") {
            await message.channel.send("Cancelled!").then(m => {
                m.delete(20000)
            })
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        };
        if (question.length > 1024) {
            await message.channel.send("The maximum length for a question is 1024 characters!")
            .catch(err => {})
            .then(e => e.delete(60000));
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        }
        let [thought, tPrompt, tMsg] = await awaitReply(message, "Please enter a thought\nYou may enter `cancel` to cancel this command", 60000)
        if (tPrompt) messages.set(tPrompt.id, tPrompt);
        if (tMsg) messages.set(tMsg.id, tMsg);
        if (!tMsg || thought.trim().toLowerCase() === "cancel") {
            await message.channel.send("Cancelled!").then(async m => {
                await m.delete(20000)
            })
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        };
        if (thought.length > 1024) {
            await message.channel.send("The maximum length for a thought is 1024 characters!")
            .catch(err => {})
            .then(e => e.delete(60000))
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        }
        let [fact, fPrompt, fMsg] = await awaitReply(message, "Please enter a fact\nYou may enter `cancel` to cancel this command", 60000)
        if (fPrompt) messages.set(fPrompt.id, fPrompt);
        if (fMsg) messages.set(fMsg.id, fMsg); 
        if (!fMsg || fact.trim().toLowerCase() === "cancel") {
            await message.channel.send("Cancelled!").then(m => {
                m.delete(20000)
            })
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        };
        if (fact.length > 1024) {
            await message.channel.send("The maximum length for a fact is 1024 characters!")
            .catch(err => {})
            .then(e => e.delete(60000))
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        }

        await client.db.r.table("qotd").insert({
            guild: message.guild.id,
            author: message.author.id,
            question: question,
            fact: fact,
            thought: thought,
            type: "qotd"
        }).run();

        await message.channel.send("Success!").then(m => m.delete(5000));
        await message.delete();
        
    } else if (args[0].toLowerCase() === "list") {
        if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
            await message.delete();
            return await message.channel.send("I can't run this command because I can't embed links").catch(err => {});
        };
        const all = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "qotd");
        if (all.length > 0) {
            let msg = new RichEmbed()
            .setColor(client.config.blue)
            .setDescription("Loading...")
            .setTimestamp();
            msg = await message.channel.send(msg);
            msg.page = 1;
            await msg.react("⬅");
            await msg.react("➡");
            await msg.react("❌");
            const collector = new ReactionCollector(msg, () => true);
            await msg.edit(await pages(msg.page, all, client));

            collector.on("collect", async reaction => {
                const user = reaction.users.last();
                if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return collector.stop();
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return collector.stop();
                if (user.id !== message.author.id) return await reaction.remove(user);
                if (!reaction.me) return await reaction.remove(user);
                if (reaction.emoji.name === "❌") return await collector.stop();
                msg.page = reaction.emoji.name == "➡" ? msg.page + 1 : msg.page - 1;
                msg.page = msg.page < 1 ? 1 : msg.page;
                msg.page = all.length < 2 * (msg.page - 1) + 1 ? msg.page - 1 : msg.page 
                await msg.edit(await pages(msg.page, all, client));
                await reaction.remove(user);
            });
            collector.on("end", async () => {
                await msg.delete();
                await message.delete();
            });
        } else {
            await message.channel.send(await pages(1, all, client));
        }
    } else if (args[0].toLowerCase() === "remove") {
        const [id, prompt, msg] = await awaitReply(message, "Please send the id of the qotd you would like to remove\nSend `cancel` to cancel instead");  
        
        if (msg) messages.set(msg.id, msg);
        messages.set(prompt.id, prompt);

        if (!id || id.toLowerCase() === "cancel") {
            const noID = new RichEmbed()
            .setTitle("Cancelled!")
            .setColor(client.config.red)
            .setTimestamp()
            await message.channel.send(
                message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
                noID : 
                "Cancelled!"
            ).catch(() => {}).then(m => m.delete(60000))
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        };

        const qotd = await client.db.r.table("qotd").get(id);
        if (!qotd || qotd.guild != message.guild.id) {
            const invalid = new RichEmbed()
            .setTitle("Invalid ID provided")
            .setColor(client.config.red)
            .setTimestamp();

            await message.channel.send(
                message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
                invalid : 
                "Invalid ID provided"
            );
            if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
                return await message.channel.bulkDelete(messages);
            } else {
                return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
            };
        }

        await client.db.r.table("qotd").get(id).delete().run();
        
        const success = new RichEmbed()
        .setTitle("Success!")
        .setColor(client.config.green)
        .setTimestamp()
        await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            success :
            "Success!"
        );
    } else if (args[0].toLowerCase() === "send") {
        let qotd = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "qotd");
        if (!qotd || qotd.length === 0) {
            const noQOTD = new RichEmbed()
            .setTitle("No QOTD available")
            .setDescription("I have no QOTD left in storage, please add some using the add sub-command")
            .setColor(client.config.red)
            .setTimestamp()

            await message.channel.send(
                message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
                noQOTD :
                "No QOTD left in storage, please add one using the `add` subcommand"
            );
        } else {
            let conf = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "conf");
            conf = conf ? conf[0] : null;
            const channelFound = conf && conf.channel && message.guild.channels.get(conf.channel);
            if (!channelFound) {
                const noConf = new RichEmbed()
                .setTitle("Missing Config")
                .setDescription("Please setup the QOTD for this server using the `setup` sub command!")
                .setColor(client.config.red)
                .setTimestamp();
                await message.channel.send(
                    message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
                    noConf : 
                    "Please setup this server's QOTD system using the `setup` sub command!"
                ).catch(() => {}).then(m => m.delete(60000));
            } else {
                qotd = qotd[Math.floor(Math.random()*qotd.length)]; // Pick a random one
                if (!qotd || qotd.length === 0) {
                    const noQOTD = new RichEmbed()
                    .setTitle("No QOTD available")
                    .setDescription("I have no QOTD left in storage, please add some using the add sub-command")
                    .setColor(client.config.red)
                    .setTimestamp()
        
                    return await message.channel.send(
                        message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
                        noQOTD :
                        "No QOTD left in storage, please add one using the `add` subcommand"
                    );
                }
                const channel = message.guild.channels.get(conf.channel);
                if (!channel.permissionsFor(message.guild.me).has("EMBED_LINKS") && !channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
                    const noPerms = new RichEmbed()
                    .setTitle("Missing Permissions!")
                    .setDescription("Please ensure I have send message and embed link permissions in the QOTD channel")
                    .setColor(client.config.red)
                    .setTimestamp()

                    await message.channel.send(
                        message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
                        noPerms : 
                        "Please check I can send messages and embed links in the QOTD channel"
                    ).catch(() => {}).then(m => m.delete(60000));
                };
                await client.db.r.table("qotd").get(qotd.id).delete().run();
                const user = await client.fetchUser(qotd.author).catch(() => {});
                const embed = new RichEmbed()
                .setTitle("QOTD")
                .addField("__**Question**__", qotd.question)
                .addField("__**Thought**__", qotd.thought)
                .addField("__**Fact**__", qotd.fact)
                .setTimestamp()
                .setFooter(user ? user.tag : "", user ? user.displayAvatarURL : message.guild.iconURL)
                .setColor(client.config.blue);

                if (conf.response && message.guild.channels.get(conf.response) && message.guild.channels.get(conf.response).permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
                    embed.setDescription(`Please send your response in <#${message.guild.channels.get(conf.response).id}>`);
                    const date = new Date()
                    await message.guild.channels.get(conf.response).send("```fix\n" + date.toUTCString().replace(/ \d{2}:\d{2}:\d{2}.+/g,"") + "```");
                };
                if (conf.role) {
                    const role = message.guild.roles.get(conf.role);
                    if (role && role.editable) {
                        const mentionable = role.mentionable; 
                        await role.setMentionable(true);
                        await channel.send(`<@&${role.id}>`, embed);
                        await role.setMentionable(mentionable);
                    } else if (role && role.mentionable) {
                        await channel.send(`<@&${role.id}>`, embed);
                    } else {
                        await channel.send(embed);
                        return await message.channel.send("Sent QOTD, Unable to mention QOTD role");
                    }
                } else {
                    await channel.send(embed);
                };
                
                await message.channel.send("Success!");
            }; 
        };
    } else if (args[0].toLowerCase() === "setup") {
        if (!message.member.permissions.has("MANAGE_GUILD")) return await message.channel.send("This command requires the **Manage Server** permission")
        .catch(() => {})
        .then(m => m.delete(60000));
        let conf;
        conf = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "conf");
        conf = conf ? conf[0] : null
        const [key, prompt, reply] = await awaitReply(message,
            [
                "Which setting would you like to edit?\n**__Possible settings:__**",
                "•`channel` - The channel the QOTD will be sent to",
                "•`permission` - Users with this role will be able to submit QOTD's",
                "•`role` - The role that will be mentioned when the QOTD is sent",
                "•`response` - The channel where users will be told to answer the question"
            ].join("\n")
        )
        if (prompt) messages.set(prompt.id, prompt);
        if (reply) messages.set(reply.id)
        const possible = ["channel", "permission", "role", "response"];
        if (!key || key.trim().toLowerCase() === "cancel" || possible.indexOf(key.trim().toLowerCase()) === -1) {
            await message.channel.send("Cancelled!").then(m => {
                m.delete(60000)
            });
        };
        let found, check;
        if (key.trim().toLowerCase() === "channel" || key.trim().toLowerCase() === "response") { // Add channel validation
            const [ch,p,m] = await awaitReply(message, "Please tag the channel you would like to use");
            messages.set(p.id, p);
            if (m) messages.set(m.id, m);
            if (!ch) {
                await message.channel.send("Cancelled!").then(m => {
                    m.delete(60000)
                });
            } else if (key.trim().toLowerCase() === "channel" || key.trim().toLowerCase() === "response") {
                check = message.guild.channels.find(c => ch.trim().match(new RegExp(`(<#)?${c.id}>?`,"g")) || ch.trim().toLowerCase() === c.name.trim().toLowerCase());
                if (!check) {
                    await message.channel.send("Invalid Channel provided").then(m => m.delete(60000));
                } else {
                    found = true;
                }
            }
        } else {
            const [ch,p,m] = await awaitReply(message, "Please type the name of the role you would like to use");
            messages.set(p.id, p);
            if (m) messages.set(m.id, m);
            if (!ch) {
                await message.channel.send("Cancelled!").then(m => {
                    m.delete(60000)
                });
            } else {
                check = message.guild.roles.find(r => ch.trim().match(new RegExp(`(<@&)?${r.id}>?`,"g")) || ch.trim().toLowerCase() === r.name.trim().toLowerCase());
                if (!check) {
                    await message.channel.send("Invalid Role provided").then(m => m.delete(60000));
                } else {
                    found = true;
                };
            };
        };
        if (found) {
            if (conf) {
                if (key.trim().toLowerCase() === "channel") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        channel: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "response") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        response: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "role") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        role: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "permission") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        permission: check.id
                    }).run();
                };
            } else {
                await client.db.r.table("qotd").insert({
                    channel: null,
                    response: null,
                    role: null,
                    channel: null,
                    permission: null,
                    guild: message.guild.id,
                    type: "conf"
                }).run();
                conf = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "conf");
                conf = conf ? conf[0] : null;
                if (key.trim().toLowerCase() === "channel") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        channel: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "response") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        response: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "role") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        role: check.id
                    }).run();
                } else if (key.trim().toLowerCase() === "permission") {
                    await client.db.r.table("qotd").get(conf.id).update({
                        permission: check.id
                    }).run();
                };
            };
        };
        const success = new RichEmbed()
        .setTitle("Success!")
        .setColor(client.config.blue)
        .setTimestamp();

        await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ? 
            success :
            "Success!"
        );
    } else if (args[0].toLowerCase() === "dumpconf") {
        if (!message.member.permissions.has("MANAGE_GUILD")) { 
            
            await message.channel.send("This command requires the **Manage Server** permission")
            .catch(() => {})
            .then(m => m.delete(60000));
        }
        let rawConf = await client.db.r.table("qotd").run().filter(r => r.guild === message.guild.id && r.type === "conf");
        rawConf = rawConf ? rawConf[0] : null;
        const channel = rawConf ? message.guild.channels.get(rawConf.channel) : null;
        const responses = rawConf ? message.guild.channels.get(rawConf.response) : null;
        const permission = rawConf ? message.guild.roles.get(rawConf.permission) : null;
        const role = rawConf ? message.guild.roles.get(rawConf.role) : null;
        
        const dumpconf = new RichEmbed()
        .setTitle(`Config for ${message.guild.name}`)
        .addField("Channel QOTD will be sent to", channel ? `<#${channel.id}>` : "Not Set")
        .addField("Channel for responses", responses ? `<#${responses.id}>` : "Not Set")
        .addField(`Role required to add, remove and list QOTD`, permission ? `<@&${permission.id}>` : "Not Set")
        .addField("Role that will be mentioned when a QOTD is sent", role ? `<@&${role.id}>` : "Not Set")
        .setColor(client.config.blue)

        await message.channel.send(
            message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") ?
            dumpconf :
            [
                "```",
                `Config for ${message.guild.name}`,
                `Channel QOTD will be sent to: ${channel ? `#${channel.name}` : "Not Set"}`,
                `Channel for responses: ${responses ? `#${responses.name}` : "Not Set"}`,
                `Role required to add, remove and list QOTD: ${permission ? `${permission.name}` : "Not Set"}`,
                `Role that will be mentioned when a QOTD is sent: ${role ? role.name : "Not Set"}`,
                "```"
            ].join("\n")
        )
    }
    if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        return await message.channel.bulkDelete(messages);
    } else {
        return await message.channel.bulkDelete(message.filter(m => m.author.id === client.user.id));
    };
};

exports.help = {
    name: "qotd",
    category: "Fun",
    description: "Allows you to setup and run QOTD in your server\n__Sub-Commands__\n" + subcommands.join("\n"),
    usage: "qotd [sub-command]"
};
  
  exports.conf = {
    permission: "SEND_MESSAGES" // Allow manage messages permission AND a specific role to use it
  };
