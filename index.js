const Discord = require("discord.js");
const client = new Discord.Client();
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const databaseFile = require("./modules/db.js");

client.db = new databaseFile();
client.db.init();

require("./utils/functions.js")(client);
client.logger = require("./utils/logger.js")
client.commands = new Discord.Collection();
const config = require("./config.json");

const init = async () => {
    // I am actually gonna comment this code too

    const cmdFiles = await readdir("./commands/");
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(file => {
        if (!file.endsWith(".js")) return;
        let cmdFunction = require(`./commands/${file}`);
        client.commands.set(cmdFunction.help.name, cmdFunction);
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
