const {inspect} = require("util");
const Discord = require("discord.js");

pageEmojis = ["🏠", "❕", "🛠", "🔧", "📜", "👌"];

exports.run = async (client, message, [action, key, ...value]) => {
  const settings = message.settings;
  const overrides = client.settings.get(message.guild.id);

  const pages = [{
      title: "Setup Menu",
      description: `
    ${pageEmojis[0]} to return **Home**.
    ${pageEmojis[1]} for **Prefix**.
    ${pageEmojis[2]} for **Moderation Role**.
    ${pageEmojis[3]} for **Administration Role**.
    ${pageEmojis[4]} for **Mod Logs**.
    ${pageEmojis[5]} to **exit** the menu.`
    },
    {
      title: "Prefix",
      key: "prefix",
      current: `${settings.prefix}`
    },
    {
      title: "Moderation Role",
      key: "modRole",
      current: `${settings.modRole}`
    },
    {
      title: "Administration Role",
      key: "adminRole",
      current: `${settings.adminRole}`
    },
    {
      title: "Mod Logs",
      key: "modLogChannel",
      current: `${settings.modLogChannel}`
    }
  ]

  message.delete(500).catch();
  let embed = new Discord.RichEmbed()
    .setColor("#92FEF9")
    .setTitle("Loading Setup...")

  message.channel.send(embed).then(msg => {
    function reactArrows(arrow) {
      if (arrow === 6) {
        embed.setColor("#92FEF9");
        embed.setTitle(pages[0].title);
        embed.setDescription(pages[0].description);
        msg.edit(embed);
        return;
      }
      msg.react(pageEmojis[arrow]).then(_ => {
        reactArrows(arrow + 1);
      }).catch(e => console.error(`Reaction Error: ${e}`));
    }

    async function handleReaction(reaction) {
      reaction.remove(reaction.users.last()).catch(e => {
        if (e.code === 50013) reaction.message.channel.send("I need the 'Manage Messages' permission in order to work properly!");
      });
      const rid = pageEmojis.indexOf(reaction.emoji.name);
      if (rid !== 5) {
        collector.stop();
        msg.clearReactions();
        let embed2 = new Discord.RichEmbed()
          .setColor("#92FEF9")
          .setTitle(pages[rid].title)
          .setDescription(`is currently \`${pages[rid].current}\``)

        msg.edit(embed2)

        const key = pages[rid].key
        const friendly = pages[rid].title
        const response = await client.awaitReply(message, `What would you like to set \`${friendly}\` to?`);
        // CHECK if channel for modLogChannel and if role for modRole and adminRole
        if(response === settings[friendly]) return message.reply("This setting already has that value!");
        if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
        client.settings.setProp(message.guild.id, key, response);

        let embed3 = new Discord.RichEmbed()
          .setColor("#92FEF9")
          .setTitle(pages[rid].title)
          .setDescription(`\`${pages[rid].current}\` → \`${response}\``)
        
        msg.edit(embed3);
        msg.delete(10000);

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
      if (reaction.users.last().id === message.author.id) {
        handleReaction(reaction);
      } else {
        reaction.remove(reaction.users.last())
        console.log("Invalid Reaction.")
      }
    });
  });
};

exports.conf = {
  enabled: true,
  devGuildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "setup",
  category: "Administration",
  description: "View or change settings for your server.",
  usage: "setup"
};