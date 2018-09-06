const Discord = require("discord.js");
const { inspect } = require("util");

exports.run = (client, message, args) => {
  const settings = message.settings;
  const link = args[0];
  const server = args.slice(1).join(" ");
  if (!link) return message.reply("You must specify a link.");
  if (!server) return message.reply("You must specify a server.");
  inspect((settings), {code: "json"});
  const partnerLog = message.guild.channels.find(c => c.name === settings.partnerLogChannel);
  if (!partnerLog) return message.reply("I cannot find a partner log channel.");

  message.delete();
  const embed = new Discord.RichEmbed()
    .setColor("#FF4848")
    .setTitle("🤝 New Partner!")
    .setTimestamp()
    .addField("Link:", link)
    .addField("Server Name:", server)
    .addField("Partnered by:", `<@${message.author.id}>`);

  return client.channels.get(partnerLog.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Partner Manager"
};

exports.help = {
  name: "logpartner",
  category: "Partner Management",
  description: "Logs partners.",
  usage: "logpartner [link] [server name]"
};
