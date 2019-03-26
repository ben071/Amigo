const Discord = require("discord.js");
const config = require("../config.json");
const pageEmojis = ["🏠", "🛠", "🎉", "❔", "🔡", "🔧"];

exports.run = async (client, message) => {
    const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();

    const commandNames = client.commands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    const sorted = client.commands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);

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
            description: sortedHelp.Moderation,

        },

        {
            title: "Fun Commands",
            description: sortedHelp.Fun,
        },

        {
            title: "Miscellaneous Commands",
            description: sortedHelp.Miscellaneous,
        },

        {
            title: "Administration Commands",
            description: sortedHelp.Administration,
        },

        {
            title: "System Commands",
            description: sortedHelp.System,
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
    });
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