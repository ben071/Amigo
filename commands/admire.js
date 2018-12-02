const { MessageAttachment } = require('discord.js');
const { Canvas } = require("canvas-constructor");
const { get } = require("snekfetch");
const fsn = require('fs-nextra');

exports.run = (bot, message, args) => {
  let user = message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : message.mentions.members.first() ? message.mentions.members.first() : message.member;

  message.channel.send('Admiring the painting...').then(msg => {
    get(user.user.displayAvatarURL.replace('.gif', '.png')).then(avatar => {
      fsn.readFile('./assets/plate_beautiful.png').then(plate => {
        let canvas = new Canvas(634, 675)
          .setColor('#000000')
          .addRect(0, 0, 634, 675)
          .addImage(avatar.body, 423, 45, 168, 168)
          .addImage(avatar.body, 426, 382, 168, 168)
          .addImage(plate, 0, 0, 634, 675);
        message.channel.send({
          files: [{
            attachment: canvas.toBuffer(),
            name: "Painting.png"
          }]
        });
        msg.delete();
      });
    });
  });
};

exports.conf = {
  enabled: true,
  aliases: ["beautiful", "painting"],
  permLevel: "User"
};

exports.help = {
  name: "admire",
  category: "Fun",
  description: "Admires a user.",
  usage: "admire [mention]"
};
