const Discord = require('discord.js');
const config = require('../config.json');

// Used if user has no permissions to execute the command.
module.exports.noPermissions = async (message, exports) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`You are missing the permission \`${exports.conf.permission}\``).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle("An error has occurred!")
        .setDescription(`Missing Permission - \`${exports.conf.permission}\``)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

module.exports.missingPermission = async (message, permission) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`I am missing the permission \`${permission}\``).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle("An error has occurred!")
        .setDescription(`I am missing the  - \`${permission}\` permission`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if no user has been provided or if user is invalid.
module.exports.invalidUser = async (message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("The user could not be found or does not exist").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`The user could not be found or does not exist.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if command is Bot Owner only.
module.exports.ownerOnly = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("Only the bot owner can use this command!").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`Only <@${config.ownerID}> can use this command.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if no arguments are given.
module.exports.noArgs = async (message, exports) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Missing arguments!\nUsage \`${exports.help.usage}\``).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    const embed = new Discord.RichEmbed()
      .setTitle("An error has occurred!")
      .setDescription(`Missing arguments!\nUsage: \`${exports.help.usage}\``)
      .setColor(config.red)
      .setFooter(message.author.tag, message.author.avatarURL);
    
    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if no reason has been provided.
module.exports.invalidReason = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("No reason provided").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('No reason has been provided.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used for users that cannot be punished.
module.exports.cannotPunish = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This user cannot be punished").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };

    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This user cannot be punished.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if punishment ID is from another guild.
module.exports.otherGuildPunishment = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This punishment is from another guild").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };

    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This punishment is from another guild.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if a user does not specify a number of messages to purge.
module.exports.provideNumber = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("Please provide a number of messages you would like to delete.").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };

    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('Please provide a number of messages you would like to delete.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if a user attempts to ban a user who is not banned.
module.exports.userNotBanned = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This user is not banned").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };

    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This user is not banned.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if a user attempts to unmute a user who is not muted.
module.exports.userNotMuted = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This user is not muted").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This user is not muted.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if a user attempts to mute a user who is already muted.
module.exports.userAlreadyMuted = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This user has already been muted").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This user has already been muted.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if the bot could not DM a user.
module.exports.couldNotDM = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("Could not send DM to mentioned user").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('Could not send DM to mentioned user.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if a bot could not log a punishment.
module.exports.couldNotLog = async (message, modLogs) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`Could not log the punishment to \`${modLogs}\`. Make sure the bot has the permission to read and send messages in this channel.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if args isn't recognised in the 'edit' command
module.exports.settingNotRecognised = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This setting wasn't recognised.").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This setting wasn\'t recognised.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if same setting is given in the 'edit' command
module.exports.sameSetting = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("The response given is already the set value").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('The response given is already the set value.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if response isn't recognised in the 'edit' command
module.exports.responseNotRecognised = async (message, response) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`The value \`${response}\` could not be used`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`The value \`${response}\` could not be used.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if args isn't recognised in the 'furry' command
module.exports.actionNotRecognised = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This action wasn't recognised").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('This action wasn\'t recognised.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if channel isn't NSFW and command is set as NSFW.
module.exports.notNSFWChannel = async (message) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send("This channel isn't an NSFW channel").catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription('The message channel isn\'t an NSFW channel.')
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

// Used if tag isn't found on yiff command.
module.exports.tagNotFound = async (message, args) => {
    if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return await message.channel.send(`An image with the tags \`${args.slice(1, 4).join(",")}\` hasn't been found`).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
    };
    let embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`An image with the tags \`${args.slice(1, 4).join(",")}\` hasn't been found.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);

    return await message.channel.send(embed).catch(err => {}).then(async m => {
        if (!m.deleted) return await m.delete(60000).catch(err => {});
    });
};

module.exports.invalidRole = async (channel, roleName) => {
    const embed = new Discord.RichEmbed()
    .setTitle("Invalid Role")
    .setDescription(`Role ${roleName} not found`)
    .setColor(config.red)
    .setFooter(message.author.tag, message.author.avatarURL)
    .setTimestamp();

    return await channel.send(
        channel.permissionsFor(channel.guild.me).has("EMBED_LINKS") ? 
            embed : 
            `Role "${roleName}" not found`
        ).catch(err => {}).then(async m => {
            if (!m.deleted) return await m.delete(60000).catch(err => {});
        });
}