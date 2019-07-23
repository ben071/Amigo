const Discord = require("discord.js");
const config = require("../config.json")
exports.run = async (client, message, args) => {
  let user = message.author;
  if (args[0]) {
    const otherUser = await client.fetchUser(args[0].replace(/[^0-9]/g,"", false)).catch(e => {})
    if (otherUser) {
        user = otherUser
    }
  }
  if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    const embed = new Discord.RichEmbed();
    embed.setTitle(`Avatar for ${user.tag}`);
    embed.setColor(config.blue);
    embed.setImage(user.avatarURL || user.defaultAvatarURL);
    message.channel.send(embed).catch(err => {});
  } else if (message.channel.permissionsFor(message.guild.me).has("ATTACH_FILES")) {
    console.log(user.avatarURL)
    message.channel.send(`Avatar for ${user.tag}`, {
      files: [user.displayAvatarURL.split("?")[0]]
    }).catch(err => {});
  } else {
    message.channel.send(`Avatar for ${user.tag}:\n${user.avatarURL || user.defaultAvatarURL}`).catch(err => {})
  };
  
};

exports.help = {
  name: "avatar",
  category: "Miscelaneous",
  description: "Gives the mentioned users avatar",
  usage: "avatar [user]",
  aliases: []
};

exports.conf = {
    permission: "SEND_MESSAGES"
};