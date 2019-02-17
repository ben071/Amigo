[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/AmigoDevTeam/Amigo/)
[![Discord Bots](https://discordbots.org/api/widget/servers/464551154114756609.svg)](https://discordbots.org/bot/464551154114756609)

## Amigo Bot

###### Amigo is a Discord bot created for the Discord server The Fur Retreat.

## Setup
1. Install the latest version of node.js.
2. Install RethinkDB server, instructions can be found [here](https://rethinkdb.com/docs/install/) and create a Database with the name Amigo.
2. Make sure all dependencies are installed by running the command `npm install`
3. Change `config.json.example` to `config.json` and insert the bot token, the Bot Owner's ID and the Discord webhook logging link.
4. If you're on Windows, click `run.bat` and you should be good to go! Alternatively, you can use `pm2 start index.js` or `node index.js` to run.

##### Note: If the database init doesn't work, try making a table named 'guilds' under the Database in localhost:8080. If this doesn't work, join the support server found on the [website](https://amigo.fun/)

### Invite the bot!
We have a hosted version of the bot which you can invite [here.](https://amigo.fun/)
