const Discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");
require("moment-duration-format");

module.exports = (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return message.reply("Commands are not available in DM");

  const settings = message.settings = client.getGuildSettings(message.guild);
  if (message.content.indexOf(settings.prefix) !== 0) return;
  if (message.guild) {
    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
  }
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;
  
  if (cmd.conf.NSFWCommand && !message.channel.nsfw) {
    const embed = new Discord.RichEmbed()
      .setTitle("⚠ Not a NSFW Channel!")
      .setDescription("This command can only be used in channels marked with the NSFW option.")
      .setTimestamp()
      .setColor("#FF4848");
    return message.channel.send(embed)
  }

  if (cmd && message.guild.id != client.config.devGuildID && cmd.conf.devGuildOnly) { 
    const embed = new Discord.RichEmbed()
      .setTitle("⚠ Testing Only!")
      .setDescription(`This command can only be used in the development guild which can be found at https://amigo.fun.`)
      .setTimestamp()
      .setColor("#FF4848");
    return message.channel.send(embed)
  }

  if (cmd && !message.guild && cmd.conf.guildOnly) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
  
  if (level < client.levelCache[cmd.conf.permLevel]) {
    const embed = new Discord.RichEmbed()
      .setTitle("⚠ Missing Permissions!")
      .setTimestamp()
      .setColor("#FF4848")
      .addField("Permission Level:", `${level} (${client.config.permLevels.find(l => l.level === level).name})`)
      .addField("Required Level: ", `${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`)
      .setFooter(message.author.tag, message.author.avatarURL);
    return message.channel.send(embed);
  }

  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }

  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name} in ${message.guild.name}`);
  cmd.run(client, message, args, level);
};
