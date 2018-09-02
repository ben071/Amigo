const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args) {
    message.channel.send("You need to give me a phrase to search on Google.");
  } else {
    let Phrase=args[0];
    let titlePhrase=args[0];
    var repeat;
  for (repeat=1; repeat < args.length;repeat++) {
      Phrase=Phrase+"+"+args[repeat];
      titlePhrase=titlePhrase+" "+args[repeat];
    }

    const url="http://lmgtfy.com/?q="+Phrase; // Creates a link to LMGTFY with phrase stated by user.

    const embed = new Discord.RichEmbed()
      .setColor("#F4A742")
      .setDescription(url)
      .setTimestamp()
      .setFooter(`${message.author.tag}`);
    message.channel.send(embed);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["google"],
  permLevel: "User"
};

exports.help = {
  name: "lmgtfy",
  category: "Miscelaneous",
  description: "Gives a link using https://lmgtfy.com/",
  usage: "lmgtfy [phrase to search]"
};
