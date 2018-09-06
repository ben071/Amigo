const randomiseCase = word => word.split("").map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join("");

exports.run = (bot, message, args) => {
  if (args.length < 1) return message.channel.send("**I need some text to clapify.**");
  message.channel.send(args.map(randomiseCase).join(":clap:"));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "clapify",
  category: "Fun",
  description: "Clapifies your text.",
  usage: "clapify [text]"
};
