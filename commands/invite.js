exports.run = async (client, message) => {
    message.reply("https://discordapp.com/oauth2/authorize?client_id=464551154114756609&permissions=8&scope=bot");
};

exports.conf = {
    enabled: true,
    aliases: ["inv", "addme"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "invite",
    category: "Miscelaneous",
    description: "Bot invite.",
    usage: "invite"
  };