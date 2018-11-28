const { inspect } = require("util");
const Discord = require('discord.js');
module.exports.run = async (client, message, args) => {
  const settings = message.settings;
  if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("I need the manage channel permission to use this command");
  if (!message.guild.me.hasPermission("MOVE_MEMBERS")) return message.channel.send("I need the move members permission to do this");
  const member = message.mentions.members.first() || message.guild.members.get(args[0]);
  args.shift()
  const reason = args.join(" ")
  if (!member) return message.channel.send("I can't find that person");
  if (!member.voiceChannel) return message.channel.send("That person isn't in a voice channel");
  if (!reason) return message.channel.send("You need to give a reason")
  inspect((settings), {code: "json"});
  const modlog = client.channels.find('name', settings.modLogChannel);
  if (!modlog) return messaeg.channel.send("I cannot find a modlog")
  const newChannel = await message.guild.createChannel(member.id, "voice");
  await member.setVoiceChannel(newChannel);
  newChannel.delete();
  message.channel.send("Successfully removed "+ member.displayName +" - "+member.id+" from their voice channel");
  const embed = new Discord.RichEmbed()
  .setColor("#FF4848")
  .setTimestamp()
  .setDescription("**Action:** Removed a user from their voice channel")
  .addField("**Target:**" , "<@"+member.id+">",true)
  .addField("**Moderator:**" , "<@"+message.author.id+">",true)
  .addField("**Reason:**" , reason, true)
  modlog.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["vckick"],
  permLevel: "Moderator"
};

exports.help = {
  name: "voicekick",
  category: "Miscelaneous",
  description: "Removes a user from their current voice channel",
  usage: "voiceKick [@user]"
};
