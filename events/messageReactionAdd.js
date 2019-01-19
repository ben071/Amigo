module.exports = async ( client , messageReaction , user ) => {
    try { 
    const setup = require("../reaction roles.json")
    const reactedMessage = messageReaction.message;
    if (!reactedMessage.guild) return;
    const msgID = reactedMessage.id;
    const channelID = reactedMessage.channel.id;
    const guildID = reactedMessage.guild.id;
    const key = msgID+channelID+guildID;
    if (!setup[key]) return;
    const messageSetup = setup[key]
    const guild = reactedMessage.guild;
    const member = guild.members.find(m => m.id == user.id)
    const emoji = messageReaction.emoji;

    //if (msgID != messageSetup.messageID || channelID != messageSetup.channelID) return;
    let possibleEmoji = false
    let validEmoji;
    for (const key in messageSetup.emoji) {
        if (key == emoji.name) {
            possibleEmoji = true
            validEmoji = key
            break;
        } 
    } 
    if (!possibleEmoji) {
        messageReaction.remove(user)
        return;
    };
    const supportRole = guild.roles.find(r => r.id == messageSetup.emoji[validEmoji]);
    if (!supportRole) return;
    if (supportRole.position >= guild.me.highestRole.position) return;
    if (!guild.me.hasPermission("MANAGE_ROLES")) return;
    const canSendMessage = reactedMessage.channel.permissionsFor(guild.me).has("SEND_MESSAGES") // if the bot has permissions to send messages on that channel
    if (!member.roles.find(r => r.id == supportRole.id)) {// user already has the role
        await member.addRole(supportRole.id,`Giving them a reaction role in <#${channelID}>`);
        client.logger.log(`Gave ${user.tag} - ${user.id}, the ${supportRole.name} role in guild ${guildID}`)
        if (canSendMessage){
            const msg = await reactedMessage.channel.send(`<@${user.id}> has been given the ${supportRole.name} role`);
            setTimeout(function() { msg.delete().catch() } , 10000)

        };
        } else if ((member.roles.find(r => r.id == supportRole.id)) != undefined) {
        client.logger.log(`Took the ${supportRole.name} role from ${user.tag} - ${user.id} in guild ${guildID}`)
        await member.removeRole(supportRole.id, `Taking a reaction role from them in <#${channelID}>`);
        if (canSendMessage){
            const msg = await reactedMessage.channel.send(`<@${user.id}> has had the ${supportRole.name} role taken from them`);
            setTimeout(function() { msg.delete().catch() } , 10000)
        };
    };
} catch (err) {
    console.log(err)
}
};