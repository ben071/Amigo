const moment = require("moment");

module.exports = async client => {
    const timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    client.logger.log(`\`\`\`${timestamp}\`\`\`\n[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

    client.user.setActivity(`for a!help | amigo.fun | Rewriting...`, {
        type: "WATCHING"
    });
}