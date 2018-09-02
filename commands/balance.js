const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
curMain = client.currency
curCheck = curMain.get(message.guild.id+message.author.id)
if (curMain.hasOwnProperty(message.guild.id+message.author.id)==true) {
    message.reply("You have "+ curCheck)
}else if (curMain.hasOwnProperty(message.guild.id+message.author.id)==false){
        curMain.set(message.guild.id+message.author.id,100)
        message.reply("You didn't have a bank account on this server so I created one for you and gave you 100 free credits")
    }
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["bal","£","$"],
  permLevel: "User"
};

exports.help = {
  name: "balance",
  category: "Economy",
  description: "Tells you how many coins you have",
  usage: "balance"
};
