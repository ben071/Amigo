const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if (!args) {
      message.reply("You must give me text to embed.")
  }else {
      message.delete()
      let Phrase=args[0]
      for (part=1; part < args.length;part++) {
          Phrase=Phrase+" "+args[part];
      }
    let embed = new Discord.RichEmbed()
    .setColor("#F4A742")
    .setDescription(Phrase)
    .setTimestamp()
    .setFooter(`${message.author.tag}`)
    message.channel.send(embed)
    }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};
exports.help = {
  name: "embed",
  category: "Miscelaneous",
  description: "Embeds a message you say.",
  usage: "embed [text to embed]"
};
