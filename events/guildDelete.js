module.exports = async (client, guild) => {
    client.logger.log(`Removed from guild: **${guild.name}** - (ID: ${guild.id}) Owner: ${guild.owner.user.tag}  (${guild.ownerID})`);
};