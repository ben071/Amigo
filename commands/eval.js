const Discord = require("discord.js");
const config = require("../config.json");

exports.run = async (client, message, args) => {
  if(!args[0]) return;
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    let output = `\`\`\`js\n${clean}\n\`\`\``
    if(output.length > 1028) output = "\`\`\`js\nundefined\`\`\`";
    const embed = new Discord.RichEmbed()
        .setColor(config.green)
        .setTitle("Eval Successful")
        .addField("Input", `\`\`\`${code}\`\`\``)
        .addField("Output", output);
    message.channel.send(embed);
  } catch (err) {
    client.logger.error(err);
    const embed = new Discord.RichEmbed()
        .setColor(config.red)
        .setTitle("Eval Failed")
        .addField("Input", `\`\`\`${code}\`\`\``)
        .addField("Output", await client.clean(client, err));
    message.channel.send(embed);
  }
};

exports.help = {
  name: "eval",
};