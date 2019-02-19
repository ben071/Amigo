module.exports = async (client, guild) => {
    await client.db.createGuild(guild);
    client.logger.log(`New guild: **${guild.name}** - (ID: ${guild.id})`);
}