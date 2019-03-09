[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/AmigoDevTeam/Amigo/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9ae3bb75f11848ddb759899b612f79dc)](https://www.codacy.com/app/ben071/Amigo?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=TheDeveloperNetwork/Amigo&amp;utm_campaign=Badge_Grade)
[![Discord Badge](https://img.shields.io/discord/517549312926810113.svg)](https://discord.gg/Mme7Smb/)
[![Language Badge](https://img.shields.io/github/languages/top/TheDeveloperNetwork/Amigo.svg)](https://github.com/AmigoDevTeam/Amigo/)

## Amigo Bot

###### Amigo is a Discord bot created for the Discord server The Fur Retreat.
[![Discord Bots](https://discordbots.org/api/widget/464551154114756609.svg)](https://discordbots.org/bot/464551154114756609)

## Setup
1. Install the latest version of node.js.
2. Install RethinkDB server, instructions can be found [here](https://rethinkdb.com/docs/install/) and create a Database with the name Amigo.
3. Make sure all dependencies are installed by running the command `npm install`
4. Change `config.json.example` to `config.json` and insert the bot token, the Bot Owner's ID and the Discord webhook logging link.
5. Use `npm start` to run the bot. ([pm2 Docs](https://pm2.io/doc/en/runtime/features/commands-cheatsheet/))

##### Note: If the database init doesn't work, try making the tables named 'guilds' and 'punishments' under the Database in localhost:8080. If this doesn't work, join the support server found on the [website](https://amigo.fun/)

### Invite the bot!
We have a hosted version of the bot and dashboard which you can view [here.](https://amigo.fun/)
