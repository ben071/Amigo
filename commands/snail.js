exports.run = async (client, message) => {
  const quotes = ["same","me","yes queen","my guy","mood"];
  message.channel.send(quotes[Math.floor((Math.random() * (quotes.length)))]);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["lydia"],
  permLevel: "User"
};
exports.help={
  name: "snail",
  category: "Fun",
  description: "Sends a random snail quote.",
  usage: "snail"
};
