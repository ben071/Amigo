const Discord = require("discord.js");

module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.guild === null) return message.reply("Commands aren't available in DM.");
  const settings = message.settings = client.getGuildSettings(message.guild);
  if (message.content.indexOf(settings.prefix) !== 0) return;
  if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  if (cmd && message.guild.id != '508320098562605066' && cmd.conf.devGuildOnly)
    return message.channel.send("This command can only be used in the Amigo Support guild. Please check back to see when it's available for general use.")

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      const embed = new Discord.RichEmbed()
        .setTitle("⚠ Missing Permissions!")
        .setTimestamp()
        .setColor("#FF0000")
        .addField("Permission Level:", `${level} (${client.config.permLevels.find(l => l.level === level).name})`)
        .addField("Required Level: ", `${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`)
        .setFooter(message.author.tag, message.author.avatarURL);
      return message.channel.send(embed);
    } else {
      return;
    }
  }

  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }

  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
