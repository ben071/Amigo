const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
  if (!args[0]) {
    message.reply("You must give me text to embed.");
  } else {
    const regEx = new RegExp(/^([0-9A-F]{6}|[0-9A-F]{3})$/i);
    const colour = (regEx.test(args[0].replace(/#/g,""))) ? args[0].replace(/#/g,"") : "RANDOM" // use the first word for the colour if it is a valid hex code  
    if (colour != "RANDOM") args.splice(0,1);
    const embed = new Discord.RichEmbed()
    .setColor(colour)
    const Phrase = args.join(" ").replace(/[\\]{2}/g,"\n")
    if (Phrase.indexOf("|") != -1) {
      embed.setTitle(Phrase.split("|")[0])
      embed.setDescription(Phrase.split("|").splice(1).join("|"))
    } else {
      embed.setDescription(Phrase)
    }
    message.channel.send(embed); 
}};

exports.help = {
    name: "embed",
    category: "Miscelaneous",                                                                                                                                                                                      //This may seem like a lot of \ and thats because it is. Leave it how it is    
    description: "Embeds a message you say. With the text to embed, use `|` to signify you want the text before that to be the titlle of the embed and the text after that to be the description of the embed. Use `\\\\` to represent a new line",
    usage: "embed [hex code for embed, random if not given] [text to embed]",
    aliases: []
  };
  
exports.conf = {
  permission: "EMBED_LINKS"
};