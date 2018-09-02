module.exports = async client => {
  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");
  
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {type: "PLAYING"});
};
