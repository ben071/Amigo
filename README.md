[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/AmigoDevTeam/Amigo/)
[![Language Badge](https://img.shields.io/github/languages/top/TheDeveloperNetwork/Amigo.svg)](https://github.com/AmigoDevTeam/Amigo/)

# Amigo

## Note: Amigo is an archived project, as of 20/12/19.

### Setup
1. Install the latest version of node.js.
2. Install RethinkDB server, instructions can be found [here](https://rethinkdb.com/docs/install/) and create a Database with the name Amigo.
3. Make sure all dependencies are installed by running the command `npm install`
4. Change `config.json.example` to `config.json` and insert the bot token, the Bot Owner's ID and the Discord webhook logging link.
5. Use `npm start` to run the bot. ([pm2 Docs](https://pm2.io/doc/en/runtime/features/commands-cheatsheet/))

#### Note: If the database init doesn't work, try making the tables named 'guilds' and 'punishments' under the Database in localhost:8080.


