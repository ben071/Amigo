module.exports = (client, member) => {
  const settings = client.getGuildSettings(member.guild);

  if (settings.welcomeEnabled !== "true") return;
  const welcomeMessage = settings.welcomeMessage.replace("{{user}}", member.user.tag);

  if (settings.autoRoleEnabled == "true") {
    member.edit( {
      roles: [settings.rolesToAdd]
    });
  }

  member.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);
};
