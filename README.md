[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/AmigoDevTeam/Amigo/)
[![Discord Bots](https://discordbots.org/api/widget/servers/464551154114756609.svg)](https://discordbots.org/bot/464551154114756609)

## Amigo Bot

###### Amigo is a Discord bot created for the Discord server The Fur Retreat.

## Setup
1. Install the latest version of node.js.
2. Install RethinkDB server, instructions can be found [here](https://rethinkdb.com/docs/install/) and create a Database with the name Amigo.
2. Make sure all dependencies are installed by running the command `npm install`
3. Change `config.json.example` to `config.json` and insert the bot token, the Bot Owner's ID and the Discord webhook logging link.
4. Use `npm start` to run the bot. ([pm2 Docs](https://pm2.io/doc/en/runtime/features/commands-cheatsheet/))

##### Note: If the database init doesn't work, try making the tables named 'guilds' and 'punishments' under the Database in localhost:8080. If this doesn't work, join the support server found on the [website](https://amigo.fun/)

### Invite the bot!
We have a hosted version of the bot which you can invite [here.](https://amigo.fun/)
