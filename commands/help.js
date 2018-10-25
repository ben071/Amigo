const Discord = require("discord.js");
let pageEmojis = ["🏠", "🛠", "🎉", "❔","💰", "🔡", "🔧", "🏅", "👌"];
exports.run = (client, message, args, level) => {
  const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
  const commandNames = myCommands.keyArray();
  const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
  const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
  let ModerationCommands = "";
  let FunCommands = "";
  let MiscellaneousCommands = "";
  let AdministrationCommands = "";
  let SystemCommands = "";
  let CurrencyCommands="";
  if (!args[0]) {
    sorted.forEach(c => {
      const cat = c.help.category.toProperCase();
      if (cat === "Moderation") {
        ModerationCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      } else if (cat === "Fun") {
        FunCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      } else if (cat === "Miscelaneous") {
        MiscellaneousCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      } else if (cat === "Administration") {
        AdministrationCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      } else if (cat === "System") {
        SystemCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      } else if (cat === "Currency") {
        CurrencyCommands += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
      }
    });

    if (ModerationCommands == "") {
      ModerationCommands="No moderation commands available for your permission level.";
    };
    if (FunCommands == "") {
      FunCommands="No fun commands available for your permission level.";
    };
    if (MiscellaneousCommands == "") {
      MiscellaneousCommands="No information/miscellaneous commands available for your permission level.";
    };
    if (AdministrationCommands=="") {
      AdministrationCommands="No administration commands available for your permission level.";
    };
    if (SystemCommands =="") {
      SystemCommands="No system commands available for your permission level.";
    };
    if (CurrencyCommands =="") {
      CurrencyCommands="No currency commands available for your permission level.";
    };

    const pages = [{
        title: "Help Menu",
        description: `
      ${pageEmojis[0]} to return **Home**.
      ${pageEmojis[1]} for **Moderation Commands**.
      ${pageEmojis[2]} for **Fun Commands**.
      ${pageEmojis[3]} for **Miscellaneous Commands**.
      ${pageEmojis[4]} for **Currency Commands**.
      ${pageEmojis[5]} for **Administration Commands**.
      ${pageEmojis[6]} for **System Commands**.
      ${pageEmojis[7]} for **Credits**.
      ${pageEmojis[8]} to **exit** the menu.`
      },

      {
        title: "Moderation Commands",
        description: ModerationCommands,

      },

      {
        title: "Fun Commands",
        description: FunCommands,
      },

      {
        title: "Miscellaneous Commands",
        description: MiscellaneousCommands,
      },
      
      {
        title: "Currency Commands",
        description:CurrencyCommands
      },

      {
        title: "Administration Commands",
        description: AdministrationCommands,
      },

      {
        title: "System Commands",
        description: SystemCommands,
      },

      {
        title: "Credits",
        description: "<@265569046425108481> - **Bot Owner**\n<@291607550825332736> - **Bot Owner**\n<@503105733701926922> - **Bot Developer**",
      },
    ]

    let page = 1;

    message.delete(500).catch();
    let embed = new Discord.RichEmbed()
      .setColor("#23819C")
      .setTitle("Loading Help...")
      .setFooter(`Use ${message.settings.prefix}help [command name] for more info.`)

    message.channel.send(embed).then(msg => {
      function reactArrows(arrow) {
        if (arrow === 9) {
          embed.setColor("#23819C");
          embed.setTitle(pages[0].title);
          embed.setDescription(pages[0].description);
          embed.setFooter(`Use ${message.settings.prefix}help [command name] for more info.`)
          msg.edit(embed);
          return;
        }
        msg.react(pageEmojis[arrow]).then(_ => {
          reactArrows(arrow + 1);
        }).catch(e => console.error(`Reaction Error: ${e}`));
      }

      function handleReaction(reaction) {
        reaction.remove(reaction.users.last()).catch(e => {
          if (e.code === 50013) reaction.message.channel.send("I need the 'Manage Messages' permission in order to work properly!");
        });
        const rid = pageEmojis.indexOf(reaction.emoji.name);
        if (rid !== 8) {
          let embed2 = new Discord.RichEmbed()
            .setColor("#23819C")
            .setTitle(pages[rid].title)
            .setDescription(pages[rid].description)
            .setFooter(`Use ${message.settings.prefix}help [command name] for more info.`)

          msg.edit(embed2)
        } else {
          msg.delete(500).catch(console.error);
        }
      }
      reactArrows(0)
      let collector = msg.createReactionCollector((reaction, user) => {
        return user.id !== msg.client.user.id && pageEmojis.includes(reaction.emoji.name);

      }, {
        time: 180000
      }); // 180000 = 3 mins
      collector.on("collect", (reaction) => {
        if(reaction.users.last().id === message.author.id) {
          handleReaction(reaction);
        } else {
          reaction.remove(reaction.users.last())
          console.log("Invalid Reaction.")
        }
      });
      collector.on('end', () => msg.delete(500));
    });
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;

      const embed = new Discord.RichEmbed()
        .setAuthor("Command Help")
        .setColor("#23819C")
        .addField("Description:", `${command.help.description}`)
        .addField("Usage:", `${command.help.usage}`);

      message.channel.send(embed);
    }
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
