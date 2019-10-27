const moment = require("moment");
const config = require("../config.json");

module.exports = async client => {
    await client.website.load(client);
    const timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    client.logger.log(`\`\`\`${timestamp}\`\`\`\n[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

    client.user.setActivity(`for ${config.defaultPrefix}help | amigo.fun`, {
        type: "WATCHING"
    });
    
};