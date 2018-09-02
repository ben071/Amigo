const Discord = require("discord.js"); //Required

const botInsults = ["Nope","Why would I want to do that?","Nice try","No","I don't want to do that","If you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass."];
const Insults = ["I'm not saying I hate you, but I would unplug your life support to charge my phone.","Is your ass jealous of the amount of shit that just came out of your mouth?","Yo're so ugly, when your mom dropped you off at school she got a fine for littering.","Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.","What's the difference between you and eggs? Eggs get laid and you don't.","Your birth certificate is an apology letter from the condom factory.","Why don't you slip into something more comfortable -- like a coma.","You must be the arithmetic man; you add trouble, subtract pleasure, divide attention, and multiply ignorance.","You must be on the seafood diet. When you see food, you eat it!","You're a person of rare intelligence. It's rare when you show any.","If you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass.","Hey, you have somthing on your chin... no, the 3rd one down","There are more calories in your stomach than in the local supermarket!","You're as bright as a black hole, and twice as dense.","It's better to keep your mouth shut and give the 'impression' that you're stupid than to open it and remove all doubt."];

module.exports.run = async (bot, message, args) => {
    if (args[0]==undefined) {
    message.channel.send("You need to mention a user to insult.");
    } else if (message.isMentioned(bot.user)) {
    message.channel.send(botInsults[Math.floor((Math.random() * (botInsults.length)))]);
    } else if (args[0]=="<@!"+message.author.id+">") {
    message.reply("Why would you want me to do that?");
    } else {
    message.channel.send(args[0]+" "+Insults[Math.floor((Math.random() * (Insults.length)))]);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["roast"],
  permLevel: "User"
}

exports.help = {
  name: "insult",
  category: "Fun",
  description: "Insults a user that you mention.",
  usage: "insult [mention]"
}
