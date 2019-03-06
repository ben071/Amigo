module.exports = async (client, oldGuild, newGuild) => {
    if(oldGuild.name !== newGuild.name) {
        await client.db.updateGuildName(newGuild.id, newGuild.name);
        client.logger.log(`Guild **${oldGuild.name}** - (ID: ${newGuild.id}) has changed it's name to **${newGuild.name}**`);
    }
};