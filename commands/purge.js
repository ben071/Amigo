const Discord = require("discord.js");
const { inspect } = require("util");

exports.run = async (client, message, args) => {
  const messagecount = parseInt(args.join(" "));
  const modLog = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
  const modLogCheck = message.guild.channels.find(c => c.name === modLog);
  const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
  
  if (!modLogCheck) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle("⚠ Mod Log not found!")
      .setColor("#FF4848")
      .setDescription(`A mod log cannot be found with the name \`${modLog}\`.`)
      .setFooter(`Edit this using the command ${prefix}editconfig`);
    return message.channel.send(errorEmbed);
  }

  if (isNaN(messagecount)) return message.channel.send("Enter a valid integer.");
  if (messagecount == 0) return;
  if (messagecount > 100) {
    message.channel.send("Please enter a number less than or equal to 100.");
    return;
  };

  message.channel.fetchMessages({
    limit: messagecount
  }).then(messages => message.channel.bulkDelete(messages)).catch(console.error);

  const embed = new Discord.RichEmbed()
    .setColor("#FF4848")
    .setTimestamp()
    .setDescription(`**Action:** Purge\n**Moderator:** ${message.author.tag}\n**Number of messages:** ${messagecount}\n**Channel:** ${message.channel.name}`);
  return client.channels.get(modLogCheck.id).send({embed});
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  category: "Moderation",
  description: "Purges X amount of messages from a given channel.",
  usage: "purge [number]"
};
