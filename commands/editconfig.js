const Discord = require("discord.js");

emojis = ["❕", "🛠", "🔧", "📜", "👌"]; // Set an emoji for each command category.

exports.run = async (client, message) => {
  if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I need the 'Manage Messages' permission in order to work properly!")
  // Bot will crash if it can't delete messages.
  const settings = message.settings;
  const overrides = client.settings.get(message.guild.id);

  const pages = [{
      title: "Setup Menu",
      description: `
    ${emojis[0]} to edit **Prefix**.
    ${emojis[1]} to edit **Moderation Role**.
    ${emojis[2]} to edit **Administration Role**.
    ${emojis[3]} to edit **Mod Logs**.
    ${emojis[4]} to **exit** the menu.`
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


  let embed = new Discord.RichEmbed()
    .setColor("#92FEF9")
    .setTitle("Loading Setup...")

  message.channel.send(embed).then(msg => {
    async function reactArrows(arrow) {
      if (arrow === 5) { // If all the 'emojis' are reacted.
        embed.setTitle(pages[0].title); // Set title as "Setup menu"
        embed.setDescription(pages[0].description); // Set description as "${emojis[0]} to edit..."
        embed.setFooter(`Use ${settings.prefix}viewconfig to view the current configuration.`);
        msg.edit(embed);
        return;
      }
      msg.react(emojis[arrow]).then(_ => {
        reactArrows(arrow + 1);
      }).catch(e => console.error(`Reaction Error: ${e}`));
    }

    async function handleReaction(reaction) {
      const rid = emojis.indexOf(reaction.emoji.name) + 1; // 'rid' is the index place of the emoji name + 1.
      if (rid !== 5) { // 5 = quit menu
        await collector.stop();
        await msg.delete().catch(console.error);

        const key = pages[rid].key
        const friendly = pages[rid].title
        const response = await client.awaitReply(message, `The \`${friendly}\` is currently \`${pages[rid].current}\`\nWhat would you like to set \`${friendly}\` to?\n**Reply 'cancel' to cancel.**`);
        if (response == 'cancel') return message.reply("Canceled.");
        if (key == "modLogChannel") { // Channel based keys which are in config.js
          const modLogs = message.guild.channels.find("name", response); // Finds channel in message.guild
          if (!modLogs) return message.reply("That isn't a valid channel."); // If channel isn't found, return message.
        }
        if (key == "modRole" || key == "adminRole") { // Role based keys which are in config.js
          const role = message.guild.roles.find("name", response); // Finds role in message.guild
          if (!role) return message.reply("That isn't a valid role."); // If role isn't found, return message.
        }

        if (response === settings[key]) return message.reply("This setting already has that value!"); // If user responds with the same value in settings, return message.
        if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {}); // If the guild isn't contained in client.settings, add it.
        client.settings.setProp(message.guild.id, key, response); // Set the response in config.js with the guild id, the 'key' (e.g modLogChannel) and the user response.

        embed.setTitle(`Successfully edited \`${friendly}\`!`);
        embed.setDescription(`\`${pages[rid].current}\` → \`${response}\``);
        embed.setFooter("");

        msg.channel.send(embed)
      } else { // Quit menu selection (emojis.indexOf(reaction.emoji.name) = 5)
        msg.delete(500).catch(console.error);
      }
    }
    reactArrows(0)
    let collector = msg.createReactionCollector((reaction, user) => {
      return user.id !== msg.client.user.id && emojis.includes(reaction.emoji.name);
    }, {
      time: 180000 
    }); // 180000 = 3 mins
    collector.on("collect", (reaction) => {
      if (reaction.users.last().id === message.author.id) { 
        handleReaction(reaction); // Handle reaction if it's from the message user.
      } else {
        reaction.remove(reaction.users.last()) // If reaction isn't from the message user, remove it.
        console.log("Invalid Reaction.")
      }
    });
  });
};

exports.conf = {
  enabled: true,
  aliases: ["edit"],
  permLevel: "Administrator"
};

exports.help = {
  name: "editconfig",
  category: "Administration",
  description: "Edit the configuration for the server.",
  usage: "editconfig"
};