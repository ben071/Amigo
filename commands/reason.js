const settings = require("../config.js");

async function embedSan(embed) {
  embed.message ? delete embed.message : null;
  embed.footer ? delete embed.footer.embed : null;
  embed.provider ? delete embed.provider.embed : null;
  embed.thumbnail ? delete embed.thumbnail.embed : null;
  embed.image ? delete embed.image.embed : null;
  embed.author ? delete embed.author.embed : null;
  embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
  return embed;
}

exports.run = async (client, message, args) => {
  const modLog = client.channels.find("name", "mod-log");
  const caseNumber = args.shift();
  const newReason = args.join(" ");

  await modLog.fetchMessages({limit:100}).then((messages) => {
    const caseLog = messages.filter(m => m.author.id === client.user.id &&
      m.embeds[0] &&
      m.embeds[0].type === "rich" &&
      m.embeds[0].footer &&
      m.embeds[0].footer.text.startsWith("Case") &&
      m.embeds[0].footer.text === `Case ${caseNumber}`
    ).first();
    modLog.fetchMessage(caseLog.id).then(logMsg => {
      const embed = logMsg.embeds[0];
      embedSan(embed);
      embed.description = embed.description.replace(`Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`, newReason);
      logMsg.edit({embed});
    });
  });
};

exports.conf = {
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "reason",
  category: "Moderation",
  description: "Updates an unset moderator action.",
  usage: "reason [case number] [new reason]"
};
