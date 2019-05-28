const Discord = require('discord.js');
const config = require("../config.json")
module.exports.run = async (client, message, args) => {
  if (await client.helpArgs(client, message, args, exports)) return;
  if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
  if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    return await message.channe.send("I can't run this command if I can't create embeds").catch(err => {}).then(async m => {
      if (!m.deleted) await m.delete(60000).catch(err => {}) // one minute;
  });
  }
  if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) { 
    return await message.channel.send("I need the manage channel permission to use this command").catch(err => {}).then(async m => {
      if (!m.deleted) await m.delete(60000).catch(err => {}) // one minute;
  });
  }
  if (!message.guild.me.hasPermission("MOVE_MEMBERS")) return message.channel.send("I need the move members permission to do this");
  if (!args[0]) return message.channel.send("How am I supposed to know who to remove from their voice channel? You didn't give me any arguments")
  const member = message.mentions.members.first() || message.guild.members.get(args[0].replace(/[^0-9]/g));
  args.shift()
  const modLogs = await client.db.r.table("guilds").get(message.guild.id).getField("modLogChannel").run();
  if (!await client.findLogs(client, message, modLogs)) return;
  const reason = args.join(" ") || "No Reason Provided"
  if (!member) return message.channel.send("I can't find that person");
  if (!member.voiceChannel) return message.channel.send("That person isn't in a voice channel");
  const newChannel = await message.guild.createChannel("Removed from "+member.voiceChannel.name, "voice");
  await member.setVoiceChannel(newChannel);
  newChannel.delete();
  message.channel.send("Successfully removed "+ member.displayName +" - "+member.id+" from their voice channel");
  const embed = new Discord.RichEmbed()
  .setColor(config.orange)
  .setTimestamp()
  .setDescription("**Action:** Voice Kick")
  .addField("User" , "<@"+member.id+">",true)
  .addField("Action by:" , "<@"+message.author.id+">",true)
  .addField("Reason:" , reason, true)
  const modLogChannel = message.guild.channels.find(c => c.name == modLogs);
  if (!modLogChannel) {
    const noLogs = new Discord.RichEmbed()
    .setTitle("An error has occurred!")
    .setDescription(`No log channel found with the name \`${modLogs}\`.`)
    .setColor(config.red)
    .setFooter(`Use ${prefix}edit modlogs to change this.`);
    return message.channel.send(noLogs)
  }
  modLogChannel.send(embed)
};

exports.conf = {
  permission: "MOVE_MEMBERS"
};

exports.help = {
  name: "voicekick",
  category: "Miscelaneous",
  description: "Removes a user from their current voice channel",
  usage: "voicekick [@user]",
  aliases: ["vckick"]
};