const rethink = require("rethinkdbdash");
const config = require("../config.json");
const tables = ["guilds", "punishments", "filters", "qotd"];

module.exports = class {
  constructor() {
    this.r = rethink({
      db: "Amigo",
    })
  }

  init() {
    this.r(tables)
        .difference(this.r.tableList())
        .forEach(table => this.r.tableCreate(table))
        .run();
  };

  createGuild(guild) {
    return this.r.table("guilds").insert([{
        id: guild.id,
        guildname: guild.name,
        prefix: config.defaultPrefix,
        modLogChannel: "amigo-logs",
        welcomeEnabled: false,
        welcomeMessage: "Welcome %user% to the %server% you are the %member count% member",
        welcomeChannel: "general",
        autoRoleEnabled: false,
        autoRoleName: "Member",
        bypassRole: null
      }]).run()
      .catch((e) => console.log(e))
  }

  async createPunish(client, message, type, user, reason, modLogs) {
    return this.r.table("punishments").insert([{
      guildid: message.guild.id,
      type: type,
      punisher: `${message.guild.id}-${message.author.id}`,
      offender: `${message.guild.id}-${user.id}`,
      reason: reason,
      time: client.db.r.now()
    }]).run()
    .then(r => client.sendPunishment(message, type, user, reason, modLogs, r.generated_keys))
    .catch((e) => console.log(e))
  }

  async updateGuildName(guildID, newGuildName) {
    return this.r.table("guilds").get(guildID).update({
        guildname: newGuildName
    }).run();
  }

  async updatePrefix(guildID, newPrefix) {
    return this.r.table("guilds").get(guildID).update({
      prefix: newPrefix
    }).run();
  }

  async updateLogs(guildID, newLogs) {
    return this.r.table("guilds").get(guildID).update({
      modLogChannel: newLogs
    }).run();
  }

  async toggleWelcome(guildID, newWelcome) {
    return this.r.table("guilds").get(guildID).update({
      welcomeEnabled: newWelcome
    }).run();
  }

  async updateWelcomeMessage(guildID, newWelcomeMessage) {
    return this.r.table("guilds").get(guildID).update({
      welcomeMessage: newWelcomeMessage
    }).run();
  }

  async updateWelcomeChannel(guildID, newWelcomeChannel) {
    return this.r.table("guilds").get(guildID).update({
      welcomeChannel: newWelcomeChannel
    }).run();
  }

  async toggleAutoRole(guildID, newAutoRole) {
    return this.r.table("guilds").get(guildID).update({
      autoRoleEnabled: newAutoRole
    }).run();
  }

  async updateAutoRoleName(guildID, newAutoRoleName) {
    return this.r.table("guilds").get(guildID).update({
      autoRoleName: newAutoRoleName
    }).run();
  }

  async addChannelFilter(channel, regex, action) {
    return this.r.table("filters").insert({
      guild: channel.guild.id,
      channel: channel.id,
      regex: regex,
      action: action
    }).run();
  };
  
  async addGuildFilter(guildID, regex, action) {
    return this.r.table("filters").insert({
      guild: guildID,
      regex: regex,
      action: action
    }).run();
  };
};