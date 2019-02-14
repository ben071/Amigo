const welcomeData = require("../welcome_data.json");
module.exports = async (client, member) => {
    if (!welcomeData[member.guild.id]) return;
    if (welcomeData[member.guild.id].enabled == "false") return;
    let welcomeMessage = welcomeData[member.guild.id].message;
    welcomeMessage = welcomeMessage.replace("%user%","<@"+member.id+">");
    welcomeMessage = welcomeMessage.replace("%server%",member.guild.name);
    welcomeMessage = welcomeMessage.replace("%member count%",member.guild.memberCount);
    const channel = member.guild.channels.find(c => c.name == welcomeData[member.guild.id].channel)
    if (!channel) return;
    if (channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
        channel.send(welcomeMessage)
    };
    if (welcomeData[member.guild.id].autoRole == "true") {
        const role = member.guild.roles.find(r => r.name == welcomeData[member.guild.id].roleName)
        if (!role) return;
        await member.addRole(role.id,"Adding role on join");
    }
};