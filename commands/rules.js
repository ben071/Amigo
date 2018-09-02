const Discord = require("discord.js");

exports.run = (bot, message, args, level) => {

  var rulesHeading={
    "1":"No offensive messages or nicknames",
    "2":"No spam",
    "3":"No gory, sexual, or scary content",
    "4":"No harassment",
    "5":"Use the appropriate channels",
    "6":"No self or user bots",
    "7":"Swearing is allowed",
    "8":"No drama",
    "9":"No sensitive topics",
    "10":"Know your limits"
  }

  var rules={
    "1":"Anything that a reasonable person might find offensive.",
    "2":"This includes but is not limited too, loud/obnoxious noises in voice, @mention spam, character spam, image spam, and message spam.",
    "3":"Screamer links, porn, nudity, death.",
    "4":"Including sexual harassment or encouraging of harassment.",
    "5":"Bot commands go in bot commands, selfies go in selfies etc. It's simple.",
    "6":"These are against the discord TOS and if you need a bot for something we have all you could ever wish for.",
    "7":"Make sure it isn't directed at another member.",
    "8":"Any drama from other servers will not carry on here or any drama with previous members. If you disagree with another member, just ignore them.",
    "9":"Any talk of suicide, self harm or rape is not allowed.",
    "10:":"Staff's decisions are final. Don't proceed to rant about them in DMs, it won't help you."
  }

  var RuleNumbers=["1","2","3","4","5","6","7","8","9","10"]

  message.delete()

  if (message.guild.id === "420255631648489492"){
    if (!args[0]){
      message.channel.send("You need to send the number of the rule you want - between 1 and 10")
    } else{
      if (RuleNumbers.indexOf(args[0] != -1)){
        let RuleEmbed = new Discord.RichEmbed()
        .setColor("#23819C")
        .setTitle(rulesHeading[args[0]])
        .setDescription(rules[args[0]])
        message.channel.send(RuleEmbed)
        }
    }
  } else{
      message.channel.send("This command only works in discord server Thy Amigos")
    }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["rule", "r"],
  permLevel: "User"
}

exports.help = {
  name: "rules",
  category: "Moderation",
  description: "Only works in Thy Amigos. Sends you the rule you specify.",
  usage: "rule [rule number]"
}
