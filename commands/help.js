const Discord = require('discord.js');

exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = ``;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n**${cat}**\n`;
        currentCategory = cat;
      }
      output += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}\n`;
    });

    let embed = new Discord.RichEmbed()
    .setAuthor("Command Help")
    .setColor("#23819C")
    .setDescription(`Use ${message.settings.prefix}help [command] for more information on each command`)
    .addField("** **", output);

    message.channel.send(embed)

  } else {

    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      //message.channel.send({embed: {
      //  title: `${message.settings.prefix}${command.help.name}`,
      //  description: `Description: **${command.help.description}**\nUsage: **${command.help.usage}**`,

      let embed = new Discord.RichEmbed()
      .setAuthor("Command Help")
      .setColor("#23819C")
      .addField("Description:", `${command.help.description}`)
      .addField("Usage:", `${command.help.usage}`)

      message.channel.send(embed)

    } else {
      return;
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
