const moment = require("moment");
const config = require("../config.json");
const Discord = require("discord.js");

exports.log = (content, type = "log") => {
    const checkWebhook = config.webhook.match(/discordapp.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/);
    if (!checkWebhook) return;
    const webhook = new Discord.WebhookClient(checkWebhook[1], checkWebhook[2]);
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    switch (type) {
        case "log": case "warn": case "cmd": case "ready": case "error": 
          console.log(`${timestamp} ${type.toUpperCase()}: ${content}`);
          return webhook.send(`**${timestamp}** ${type.toUpperCase()} ${content}`);
          
        default:
          throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
};

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");