module.exports = async (client, guild) => {
    client.logger.log(`Removed from guild: **${guild.name}** - (ID: ${guild.id}) Owner: ${guild.owner.tag}  (${guild.ownerID})`);
};