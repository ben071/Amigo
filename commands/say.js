exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply("There was nothing to say");
  const text = args.join(" ");
  message.channel.send(text);
};
exports.conf = {
  enabled: true,
  aliases: ["echo","say"],
  permLevel: "Moderator"
};
 
exports.help = {
  name: "repeat",
  category: "Moderation",
  description: "Repeats the message you say, useful for information channels or announcements",
  usage: "repeat [text]"
};