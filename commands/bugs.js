const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  const bug=args.join(" ");
  if (!bug) return message.channel.send("You need to describe the bug");
  const channel=message.guild.channels.find("name","bug-reports");
  if (!channel) return message.channel.send("I cannot find the bug reports channel, if you think this is incorrect please contact an administrator");
  const embed = new Discord.RichEmbed()
    .setColor("#F4A742")
    .setTitle("Bug report")
    .setDescription(bug)
    .setFooter("Reported by "+message.author.tag+" - ("+message.author.id+")")
    .setTimestamp();
  channel.send("<@&532834811283243018>", embed);
  message.author.send("Thank you for reporting the bug: ```"+bug+"```Staff have been notified of it and may contact you about it").catch(console.error);
  message.delete();
 
};
exports.conf = {
  enabled: true,
  devGuildOnly: true,
  aliases: [],
  permLevel: "User"
};
 
exports.help = {
  name: "bug",
  category: "Miscelaneous",
  description: "Reports a bug with the bot",
  usage: "bug [description of bug]"
};