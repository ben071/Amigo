const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: false,
  messageCacheLifetime: 1200,
  messageSweepInterval: 1200,
  disabledEvents: [
    "TYPING_START"
  ]
});
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const databaseFile = require("./modules/db.js");

client.logger = require("./utils/logger.js");
const config = require("./config.json");
client.config = config;

client.db = new databaseFile();
client.db.init();

require("./modules/functions.js")(client);

client.website = require("./website/dashboard.js");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const init = async () => {
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`)
  cmdFiles.forEach(file => {

    if (!file.endsWith(".js")) return;
    let cmdFunction = require(`./commands/${file}`);
    if (!cmdFunction.help) return;
    if (!cmdFunction.help.name) return;
    client.commands.set(cmdFunction.help.name, cmdFunction);
    console.log(`Loaded command ${cmdFunction.help.name} from ${file}`)
    if (cmdFunction.help.aliases) {
      cmdFunction.help.aliases.forEach(alias => {
        client.aliases.set(alias,cmdFunction.help.name)
      })
    }
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    const mod = require.cache[require.resolve(`./events/${file}`)];
    delete require.cache[require.resolve(`./events/${file}`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
  });

  client.login(config.token);
};

init();