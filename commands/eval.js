const { RichEmbed } = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  if (message.author.id !== config.ownerID) return errors.ownerOnly(message);
  if (!args[0]) return errors.noArgs(message, exports);

  const code = args.join(" ");

  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    let output = `\`\`\`js\n${clean}\n\`\`\``
    if (output.length > 1028) output = "\`\`\`js\nundefined\`\`\`";
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send(output).catch(err => {})
    const embed = new RichEmbed()
      .setColor(config.green)
      .setTitle("Eval Successful")
      .addField("Input", `\`\`\`${code}\`\`\``)
      .addField("Output", output);
    message.channel.send(embed);
  } catch (err) {
    client.logger.error(err);
    err = await client.clean(client, err);
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return await message.channel.send(await client.clean(client, err)).catch(err => {})
    const embed = new RichEmbed()
      .setColor(config.red)
      .setTitle("Eval Failed")
      .addField("Input", `\`\`\`${code}\`\`\``)
      .addField("Output", err.length > 1015 ? "```undefined```" : err);
    message.channel.send(embed);
  };
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary JavaScript.",
  usage: "eval <code>"
};

exports.conf = {
  permission: "Bot Owner"
}