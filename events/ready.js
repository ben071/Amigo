const config = require("../config.js")
const DBL = require("dblapi.js");
const moment = require("moment");
const reactionRoleSetup = require("../reaction roles.json");

module.exports = async client => {
  const timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
  const dbl = new DBL(config.dbltoken, client);

  setInterval(() => {
    dbl.postStats(client.guilds.size);
  }, 1800000);

  dbl.on('posted', () => {
    console.log('Server count posted!');
  })
  
  dbl.on('error', e => {
    console.log(`Oops! ${e}`);
  })

  client.logger.log(`\`\`\`Restart - ${timestamp}\`\`\`\n[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
  
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});

  for (const key in reactionRoleSetup) { // fetch all messages in the reaction role config to allow us to recieve reactions on them
    const setup = reactionRoleSetup[key]
    const server = client.guilds.find(g => g.id == setup.guildID)
    if (!server) continue; // check it is a valid server
    const channel = server.channels.find(c => c.id == setup.channelID)
    if (!channel) continue; // check it is a valid channel
    try{
      channel.fetchMessage(setup.messageID) // fetch the message
    } catch (err) {
      continue
    }
  }
};
