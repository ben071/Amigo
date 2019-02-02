const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if(!args[0]) return;
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    let output = `\`\`\`js\n${clean}\n\`\`\``
    if(output.length > 1028) output = "\`\`\`js\nundefined\`\`\`";
    const embed = new Discord.RichEmbed()
        .setColor("#48FF48")
        .setTitle("Eval Successful")
        .addField("Input", `\`\`\`${code}\`\`\``)
        .addField("Output", output);
    message.channel.send(embed);
  } catch (err) {
    client.logger.error(err);
    const embed = new Discord.RichEmbed()
        .setColor("#FF4848")
        .setTitle("Eval Failed")
        .addField("Input", `\`\`\`${code}\`\`\``)
        .addField("Output", await client.clean(client, err));
    message.channel.send(embed);
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};