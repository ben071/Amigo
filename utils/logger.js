const moment = require("moment");
const config = require("../config.json");
const Discord = require("discord.js");

exports.log = (content, type = "log") => {
    const checkWebhook = config.webhook.match(/discordapp.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/);
    if (!checkWebhook) return;
    const webhook = new Discord.WebhookClient(checkWebhook[1], checkWebhook[2]);
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    switch (type) {
        case "log": {
            return webhook.send(`**${timestamp}** ${type.toUpperCase()} ${content}`);
        }
        case "warn": {
            return webhook.send(`**${timestamp}** ${type.toUpperCase()} ${content}`);
        }
        case "error": {
            return webhook.send(`<@${config.ownerID}> **${timestamp}** ${type.toUpperCase()} ${content}`);
        }
        case "cmd": {
            return webhook.send(`**${timestamp}** ${type.toUpperCase()} ${content}`);
        }
        case "ready": {
            return webhook.send(`**${timestamp}** ${type.toUpperCase()} ${content}`);
        }
        default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
};

exports.error = (...args) => this.log(...args, "error");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");