const welcomeData = require("../welcome_data.json");
const Discord = require('discord.js');
const fs = require("fs");
exports.run = (client, message, args) => {
    if (!welcomeData[message.guild.id]) {
        welcomeData[message.guild.id] = {
            enabled: "false",
            message: "Welcome %user% to the %server% you are the %member count% member",
            autoRole: "false",
            roleName: "Member",
            channel: "general"
         }
    }
    var emojify = {"true":":white_check_mark:","false":":x:"}
    if (!args[0]) return message.channel.send("You need to specify what you would like to change, use `"+message.settings.prefix+"help welcomesettings` to check the usage of this command");
    switch(args[0].toLowerCase()) {
        case "toggle":
            if (welcomeData[message.guild.id].enabled == "false") {
                welcomeData[message.guild.id].enabled = "true";
                message.channel.send("Welcome messages are now enabled");
            } else if (welcomeData[message.guild.id].enabled == "true") {
                welcomeData[message.guild.id].enabled = "false";
                message.channel.send("Welcome messages have been disabled");
            };
            break;
        case "message":
            if (!args[1]) return message.channel.send("You need to include the new welcome message in the command") 
            args.shift()
            welcomeData[message.guild.id].message = args.join(" ")
            message.channel.send("The new welcome message for this guild is "+args.join(" "));
            break;
        case "autorole":
            if (welcomeData[message.guild.id].autoRole == "true") {
                welcomeData[message.guild.id].autoRole = "false"
                message.channel.send("Autorole has been disabled on this server")
            } else if (welcomeData[message.guild.id].autoRole == "false") {
                welcomeData[message.guild.id].autoRole = "true"
                message.channel.send("Autorole has been enabled on this server");
            };
            break;
        case "role":
            if (!args[1]) return message.channel.send("You need to give the name of new role to add in the command")
            args.shift()
            const roleName = args.join(" ");
            const role = message.guild.roles.find(r => r.name == roleName);
            if (!role) return message.channel.send("That isn't a role");
            message.channel.send("The new role to add to new users is "+roleName);
            welcomeData[message.guild.id].roleName = roleName
            break;
        case "channel":
            args.shift()
            const channelName = args.join(" ");
            const channel = message.guild.channels.find(c => c.name == channelName)
            if (!channel) return message.channel.send("That isn't a channel");
            welcomeData[message.guild.id].channel = channelName;
            message.channel.send("The new welcome channel is <#"+channel.id+">");
            break;
        case "view":
            const embed = new Discord.RichEmbed()
            embed.setTitle("Welcome settings for "+message.guild.name);
            embed.setColor("9669FE");
            embed.addField("Welcome enabled: ", emojify[welcomeData[message.guild.id].enabled], true);
            embed.addField("Autorole enabled: ", emojify[welcomeData[message.guild.id].autoRole], true);
            embed.addField("The role to add to new members: ", welcomeData[message.guild.id].roleName, true);
            embed.addField("Welcome message channel: ", welcomeData[message.guild.id].channel, true);
            embed.addField("Welcome message: ", welcomeData[message.guild.id].message, false);
            //return message.channel.send("Welcome enabled: "+emojify[welcomeData[message.guild.id].enabled]+"\n
              //  Welcome message: "+welcomeData[message.guild.id].message+"\n
                //Autorole enabled: "+emojify[welcomeData[message.guild.id].autoRole]+"\n
                //Role to add: "+welcomeData[message.guild.id].roleName+"\nChannel to send messages in: "+welcomeData[message.guild.id].channel)
            return message.channel.send(embed)
        default:
            message.channel.send(args[0] + " isn't an option to change, please check the usage of this command using " + message.settings.prefix + "help welcomesettings")
    };
    fs.writeFile("./welcome_data.json", JSON.stringify(welcomeData), (err) => { //Save data file
        if (err) console.log(err);
    });
};
exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "welcomesettings",
  category: "Administration",
  description: "Changes what should happen when a new user joins the server.Note: for the welcome message, `%user% means it will mention the user here, `%server%` means it will put the server name here, and `%member count% means it will put the amount of users in the server here",
  usage: "welcomesettings toggle - allows you to toggle whether anything should happen when a new user joins\nwelcomesettings message [new welcome message] - allows you to set the welcome message\nwelcomesettings autorole - allows you to toggle autorole\nwelcomesettings role [role name] - allows you to set the role to be given when a new member joins\nwelcomesettings channel [channel name] - allows you to set the welcome message channel\n welcomesettings view - allows you to view the current welcome config"
};
