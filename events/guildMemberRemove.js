module.exports = async (client, member) => {
    client.logger.log(`<@${member.user.id}> has left ${member.guild.name}. This guild now has ${member.guild.memberCount} members.`);
};