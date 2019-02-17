const Discord = require("discord.js");
const config = require("../config.json");

module.exports = (client) => {
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "Hide the token!");

    return text;
  };

  client.helpArgs = async (client, message, args, exports) => {
    if (args[0] === "help") {
      const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
      const embed = new Discord.RichEmbed()
        .setTitle(`Command Information - \`${exports.help.name.toProperCase()}\``)
        .setDescription(`${exports.help.description}`)
        .setColor(config.cyan)
        .addField("Usage:", `${prefix}${exports.help.usage}`, true)
        .addField("Permission:", `${exports.conf.permission}`, true);
      return message.channel.send(embed);
    } else {
      return false;
    }
  };

  client.findLogs = async (client, message, modLogs) => {
    const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    if (!modLogs || !message.guild.channels.find(c => c.name === modLogs)) {
      const embed = new Discord.RichEmbed()
        .setTitle("⚠ Missing Logs!")
        .setDescription(`No log channel found with the name \`${modLogs}\`.`)
        .setColor(config.red)
        .setFooter(`Use ${prefix}edit modlogs to change this.`);
      return message.channel.send(embed), false;
    } else {
      return true;
    }
  }

  client.canceled = (message) => {
    const embed = new Discord.RichEmbed()
      .setTitle("🚫 Canceled")
      .setColor(config.red)
      .setFooter(message.author.tag, message.author.avatarURL);
    return message.channel.send(embed);
  };

  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
};