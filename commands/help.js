const Discord = require("discord.js");
const config = require("../config.json");
const pageEmojis = ["🏠", "🛠", "🎉", "❔", "🔡", "🔧"];

function hasPermission(message, permission) {
    try {
        if (!permission) return true;
        if (permission == "Bot Owner") return config.ownerID == message.author.id;
        return message.member.hasPermission(permission)
    } catch (error) {
        return false;
    };
};

exports.run = async (client, message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send("I can't use this command because I don't have the `Embed Links` permission").catch(err => {})
    if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return message.channel.send("I can't use this command because I don't have the `Manage Messages` permission").catch(err => {})
    const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    const commandNames = client.commands.filter(c => hasPermission(message, c.conf.permission)).array();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    const sorted = commandNames.sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
    
    let sortedHelp  = {};
   
    sorted.forEach(c => {
   
        if (!c.help) return;
   
        if (!c.help.category) return;
   
        const category = c.help.category.toProperCase();
   
        const addition = `${prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`
   
        sortedHelp[category] = sortedHelp[category] ? sortedHelp[category] + addition : addition;
   
    });

    const pages = [{
            title: "Help Menu",
            description: `
      ${pageEmojis[0]} to return **Home**.
      ${pageEmojis[1]} for **Moderation Commands**.
      ${pageEmojis[2]} for **Fun Commands**.
      ${pageEmojis[3]} for **Miscellaneous Commands**.
      ${pageEmojis[4]} for **Administration Commands**.
      ${pageEmojis[5]} for **System Commands**.`
        },

        {
            title: "Moderation Commands",
            description: sortedHelp.Moderation || "No Commands Available",

        },

        {
            title: "Fun Commands",
            description: sortedHelp.Fun || "No Commands Available",
        },

        {
            title: "Miscellaneous Commands",
            description: sortedHelp.Miscellaneous || "No Commands Available",
        },

        {
            title: "Administration Commands",
            description: sortedHelp.Administration || "No Commands Available",
        },

        {
            title: "System Commands",
            description: sortedHelp.System || "No Commands Available"
        }
    ];
    let embed = new Discord.RichEmbed()
        .setColor(config.blue)
        .setTitle("Loading Help...")
        .setFooter(`Use ${prefix}[command] help for more info.`);

    message.channel.send(embed).then(msg => {
        function reactEmojis(emojis) {
            if (emojis === 6) {
                embed.setTitle(pages[0].title);
                embed.setDescription(pages[0].description);
                embed.setFooter(`Use ${prefix}[command] help for more info.`)
                msg.edit(embed);
                return;
            }
            msg.react(pageEmojis[emojis]).then(_ => {
                reactEmojis(emojis + 1);
            }).catch(e => console.error(`Reaction Error: ${e}`));
        };

        function handleReaction(reaction) {
            reaction.remove(reaction.users.last()).catch(e => {
                if (e.code === 50013) return;
            });
            const rid = pageEmojis.indexOf(reaction.emoji.name);
                embed.setColor(config.blue)
                embed.setTitle(pages[rid].title)
                embed.setDescription(pages[rid].description)
                embed.setFooter(`Use ${prefix}[command] help for more info.`)

            msg.edit(embed)
        };

        reactEmojis(0)

        let collector = msg.createReactionCollector((reaction, user) => {
            return user.id !== msg.client.user.id && pageEmojis.includes(reaction.emoji.name);
        }, {
            time: 180000
        });

        collector.on("collect", (reaction) => {
            if (reaction.users.last().id === message.author.id) {
                handleReaction(reaction);
            } else {
                reaction.remove(reaction.users.last())
            }
        });
    }).catch(err => {})
};

exports.help = {
    name: "help",
    category: "System",
    description: "Displays all the available commands.",
    usage: "help"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};