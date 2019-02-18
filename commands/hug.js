const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    const user = message.mentions.members.first();
    if (!user) return errors.invalidUser(message);
    
    try {
        const male = await message.guild.roles.find(r => r.name.toLowerCase() === "male");
        const female = await message.guild.roles.find(r => r.name.toLowerCase() === "female");
        if(!male && !female) prop = "hug+rating:s";
        // Role check - Male/Female
        if (message.member.roles.has(male.id) && user.roles.has(male.id)) { 
            prop = "male/male+hug+rating:s";
        } else if (message.member.roles.has(female.id) && user.roles.has(male.id)) {
            prop = "male/female+hug+rating:";
        } else if (message.member.roles.has(male.id) && user.roles.has(female.id)) {
            prop = "male/female+hug+rating:s";
        } else if (message.member.roles.has(female.id) && user.roles.has(female.id)) {
            prop = "female/female+hug+rating:s";
        } else {
            prop = "hug+rating:s";
        };
    } catch (e) {
        client.logger.error(e);
    };
    
    await yiff.e621.noCubFilter(prop).then(r => {
        const embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username} hugged ${user.user.username}!`)
            .setColor(config.blue)
            .setImage(r.image);
        message.channel.send(embed);
    });
};

exports.help = {
    name: "hug",
    description: "Give another user a furry hug.",
    usage: "hug [mention]"
};

exports.conf = {
    permission: "SEND_MESSAGES"
};