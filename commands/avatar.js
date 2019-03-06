const Discord = require("discord.js");
const config = require("../config.json")
exports.run = async (client, message, args) => {
  let user = message.author;
  if (args[0]) {
    const otherUser = await client.fetchUser(args[0].replace(/[^0-9]/g,"")).catch(e => {})
    if (otherUser) {
        user = otherUser
    }
  }
  const embed = new Discord.RichEmbed();
  embed.setTitle("Avatar for "+user.tag);
  embed.setColor(config.blue);
  embed.setImage(user.avatarURL);
  message.channel.send(embed);
  
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