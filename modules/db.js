const rethink = require("rethinkdbdash");

module.exports = class { 
  constructor() {
      this.r = rethink({
          db: "Amigo",
      })
  }
  
  init() {
    if(this.r.table("guilds")) return;
    return this.r.tableCreate('guilds').run() 
    .then(() => console.log("Guild and settings table created."))
    .catch((e) => {
        if (e.name === "ReqlOpFailedError") {
        } else {
            console.error(`There was an unexpected error with the database. ${e}. Exiting. Please ignore all the text spammed at the start of console`);
            process.exit(1);
        }
    });
  } 
  
  createGuild(guild) {
    return this.r.table('guilds').insert([{
        id: guild.id,
        guildname: guild.name,
        prefix: "a!!",
        modLogChannel: "mod-log",
        welcomeChannel: "general",
        modRole: "Moderator",
        adminRole: "Administrator",
        autoRoleEnabled: false,
        autoRole: "Member",
        welcomeEnabled: false,
        welcomeMessage: "Welcome %user% to the %server% you are the %member count% member."
    }]).run()
    .catch((e) => console.log(e))
  }

  updatePrefix(guildID, newPrefix) {
    return this.r.table('guilds').get(guildID).update({
        prefix: newPrefix
    }).run();
  }

  updateLogs(guildID, newLog) {
    return this.r.table('guilds').get(guildID).update({
        modLogChannel: newLog
    }).run();
  }

  updateAdminRole(guildID, newAdmin) {
    return this.r.table('guilds').get(guildID).update({
        adminRole: newAdmin
    }).run();
  }

  updateModRole(guildID, newMod) {
    return this.r.table('guilds').get(guildID).update({
        modRole: newMod
    }).run();
  }
}