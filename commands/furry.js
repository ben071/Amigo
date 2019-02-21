const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!args[0]) return errors.noArgs(message, exports);
    const user = message.mentions.users.first();
    if (!user) return errors.invalidUser(message);

    const prop = args[0].toLowerCase();
    if (prop === "boop" || prop === "cuddle" || prop === "hold" || prop === "kiss" || prop === "lick") {
        return client.furryBotAction(message, prop, user); 
    } else if (prop === "hug") {
        try {
            const male = await message.guild.roles.find(r => r.name.toLowerCase() === "male");
            const female = await message.guild.roles.find(r => r.name.toLowerCase() === "female");
            
            if (message.member.roles.has(male.id) && user.roles.has(male.id)) { 
                prop = "male/male+hug+rating:s";
            } else if (message.member.roles.has(female.id) && user.roles.has(male.id)) {
                prop = "male/female+hug+rating:";
            } else if (message.member.roles.has(male.id) && user.roles.has(female.id)) {
                prop = "male/female+hug+rating:s";
            } else if (message.member.roles.has(female.id) && user.roles.has(female.id)) {
                prop = "female/female+hug+rating:s";
            } else {
                prop = "hug+rating:s"
            };

        } catch (e) {
            console.log(e);
        };
        
        await yiff.e621.noCubFilter(prop).then(r => {
            const embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.username} hugged ${user.username}!`)
                .setColor(config.blue)
                .setImage(r.image);
            message.channel.send(embed);
        });
    } else {
        return errors.actionNotRecognised(message);
    };
};

exports.help = {
    name: "furry",
    category: "Fun",
    description: "Performs a furry action on a mentioned user.",
    usage: "furry <action> <mention>\nActions: boop, cuddle, hold, hug, kiss, lick"
};

exports.conf = {
    permission: "SEND_MESSAGES",
};