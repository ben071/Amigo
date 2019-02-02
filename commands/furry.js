const Discord = require("discord.js");
const superagent = require("superagent");

exports.run = async (client, message) => {
  const {body} = await superagent
    .get("https://beta.yiff.wtf/v1/images?approved=approved");
  
  let credits = "Credits: " + body.credits;
  if (body.credits == null || body.credits == "") {
    credits = "Credits: none"
  };
  const tags = "Tags: " + body.tags.join(", ");
  const date = new Date(body.uploaded_at).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

  const embed = new Discord.RichEmbed()
    .setColor("#9669FE")
    .setTitle("yiff.wtf SFW")
    .setDescription(tags)
    .setImage(body.url)
    .setFooter(`${credits} · ${date}`);

  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: ["fur"],
  permLevel: "User"
};

exports.help = {
  name: "furry",
  category: "Fun",
  description: "Displays a random furry image.",
  usage: "furry"
};