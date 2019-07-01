const config = require('../config.json')
exports.run = function(client, message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id !== config.ownerID && message.author.id !== config.adminID) return message.reply('You Dont Have Enough Permissions!');
var result = args.join(' ');
        limit: 100
        let messagecount = parseInt(result);
	 if(!messagecount)
return message.channel.send(`** :x: | Please Specify an Amount of Messages!**`);
        message.channel.fetchMessages({
            limit: messagecount + 1
        }).then(messages => message.channel.bulkDelete(messages));
};

exports.conf = {
  hidden: false,
  aliases: ['clear', 'prune', 'clr'],
  permLevel: 0
};

exports.help = {
  name: 'purge',
  Catagory: 'Moderation',
  description: 'Purge the XX Amount of Messages! :warning: MAX: 100',
  usage: `${config.prefix}purge [XX]`,
};
