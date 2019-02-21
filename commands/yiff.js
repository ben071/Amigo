const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");
const yiff = require("yiff");

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!args[0]) return errors.noArgs(message, exports);
    const prop = args.slice(1, 4).join("+");
    if(args[0] === "e621") {
        try {
            await yiff.e621.CubFilter(prop).then(r => {
                const embed = new Discord.RichEmbed()
                    .setColor(config.green)
                    .setAuthor("e621")
                    .setDescription(`${r.tags}`)
                    .setImage(r.image)
                    .setFooter(`Artist: ${r.artist.join(" ")} | Score: ${r.score} | Fav. Count: ${r.fav_count} | ID: ${r.postID}`);
                message.channel.send(embed)
            });
        } catch (e) {
            return errors.tagNotFound(message, args);
        }
    };
};

exports.help = {
    name: "yiff",
    category: "Fun",
    description: "Gets a random yiff image.",
    usage: "yiff <website> [tags]\nWebsites: e621"
};

exports.conf = {
    permission: "SEND_MESSAGES",
    NSFWCommand: true,
};