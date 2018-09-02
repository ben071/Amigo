const Discord = require("discord.js"); // Required
const PMIfWrong = true; // If the user doesn't give heads or tails as an argument whether to private message them telling them this or send a message to the channel the command was in telling them it isnt a valid input. If this is set to true it will private message the user, if it is set to false it will send a message to the channel.By default this is set to true
var CoinAmountLostOrWon = 50; //The amount of coins given to or taken from the user goes here

module.exports.run = async (bot, message, args) => {
  const UserChoice=args[0];
  var possibilities=["heads","tails"];
  const HeadsOrTails=possibilities[Math.floor(Math.random()*possibilities.length)];

  if (UserChoice.toLowerCase()==HeadsOrTails) {
    const sicon = message.guild.iconURL;
    const CoinEmbed = new Discord.RichEmbed()
      .setColor("#f4a742")
      .setThumbnail(sicon)
      .setAuthor("Well done!")
      .setDescription("When the coin was flipped it landed on "+HeadsOrTails+" so you won "+CoinAmountLostOrWon+" coins");
    message.channel.send(CoinEmbed);
    // Add variable CoinAmountLostOrWon to the users balance
  } else if ((UserChoice.toLowerCase()!=HeadsOrTails) &&((UserChoice.toLowerCase() =="heads" || UserChoice.toLowerCase() =="tails"))) {
    const sicon = message.guild.iconURL;
    const CoinEmbed = new Discord.RichEmbed()
      .setColor("#f4a742")
      .setThumbnail(sicon)
      .setAuthor("Unlucky!")
      .setDescription("When the coin was flipped it landed on "+HeadsOrTails+" and not " +UserChoice+" so you lost "+CoinAmountLostOrWon+" coins");
    message.channel.send(CoinEmbed);
    // Take variable CoinAmountLostOrWon to the users balance
  } else {
    if (PMIfWrong == true) {
      message.author.send("`"+UserChoice+"`"+" Is not a valid input, only heads and tails are valid inputs - case insensitive");
    } else if (PMIfWrong == false) {
      message.channel.send("`"+UserChoice+"`"+" Is not a valid input, only heads and tails are valid inputs - case insensitive");
    } else {
      message.author.send("`"+UserChoice+"`"+" Is not a valid input, only heads and tails are valid inputs - case insensitive");
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "coin",
  category: "Currency",
  description: "Flips a coin\nIf you correctly guess the output of the coin you will be given an amount of coins decided by the admin\nIf your guess is incorrect,you will lose the same amount of coins you would have won",
  usage: "coin heads" && "coin tails"
};
