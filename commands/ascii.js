const figlet = require("figlet");

exports.run = (client, message, args) => {
  if (!args.join(" ")) return message.channel.send("Please provide text!");

  figlet(args.join(" "), (err, data) => {
    message.channel.send(data, { // send the output to the channel
      code: "ascii"
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["text"],
  permLevel: "User"
};

exports.help = {
  name: "ascii",
  category: "Fun",
  description: "Asciifies text. ¯\_(ツ)_/¯",
  usage: "ascii [text]"
};
