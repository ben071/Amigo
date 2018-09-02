const { inspect } = require("util");
const {RichEmbed} = require('discord.js');
exports.run = async (client, message, [action, key, ...value], level) => {
  const settings = message.settings;
  const overrides = client.settings.get(message.guild.id);

  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");
    if (value.join(" ") === settings[key]) return message.reply("This setting already has that value!");

    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

    client.settings.setProp(message.guild.id, key, value.join(" "));

    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else

  if (action === "reset") {
    if (!key) return message.reply("Please specify a key to reset.");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (!overrides[key]) return message.reply("This key does not have an override and is already using defaults.");

    const response = await client.awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    if (["y", "yes"].includes(response.toLowerCase())) {
      delete overrides[key];
      client.settings.set(message.guild.id, overrides);
      message.reply(`${key} was successfully reset.`);
    } else

    if (["n","no","cancel"].includes(response)) {
      message.reply("Action cancelled.");
    }
  } else

  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    message.reply(`The value of ${key} is currently ${settings[key]}${isDefault}`);
  } else {
    inspect((settings), {code: "json"});

    const embed = new RichEmbed()
    .setAuthor("Guild Settings")
    .setColor("#92FEF9")
    .addField("Prefix:", `${settings.prefix}`, true)
    .addField("Mod Logs:", `${settings.modLogChannel}`, true)
    .addField("Mod Role:", `${settings.modRole}`, true)
    .addField("Admin Role:", `${settings.adminRole}`, true)
    .addField("Welcome Enabled:", `${settings.welcomeEnabled}`, true)
    .addField("Welcome Message:", `${settings.welcomeMessage}`, true)
    .addField("Welcome Channel:", `${settings.welcomeChannel}`, true)
    .addField("AutoRole Enabled:",`${settings.autoRoleEnabled}`,true)
    .addField("AutoRole(s)",`${settings.rolesToAdd}`,true)

    message.channel.send(embed)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "set", "conf"],
  permLevel: "Administrator"
};

exports.help = {
  name: "settings",
  category: "Administration",
  description: "View or change settings for your server.",
  usage: "settings <view/get/edit> <key> <value>"
};
