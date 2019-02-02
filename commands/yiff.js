const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message) => {
  const {body} = await superagent
    .get("https://beta.yiff.wtf/v1/images?nsfw=nsfw&approved=approved");
  
  if (!message.channel.nsfw) return message.channel.send("This command only works in NSFW channels!");
  let credits = "Credits: " + body.credits;
  if (body.credits == null || body.credits == "") {
    credits = "Credits: none"
  };
  const tags = "Tags: " + body.tags.join(", ");
  const date = new Date(body.uploaded_at).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

  const embed = new Discord.RichEmbed()
    .setColor("#9669FE")
    .setTitle("yiff.wtf NSFW")
    .setDescription(tags)
    .setImage(body.url)
    .setFooter(credits + " · " + date);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "yiff",
  category: "Fun",
  description: "Displays a random yiff image.",
  usage: "yiff"
};