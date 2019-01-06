const config = require("../config.js")
const DBL = require("dblapi.js");
const moment = require("moment");

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
};
