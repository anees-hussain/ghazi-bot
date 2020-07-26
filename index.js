require("dotenv").config();
const Sentry = require("@sentry/node");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.bot_token;
const bot = new TelegramBot(token, { polling: true });
const registerUser = require("./src/registerUser");
const updateProfile = require("./src/user/updateUserProfile");
const engagementRound = require('./src/engagementRound');

Sentry.init({ dsn: process.env.sentry_dsn });
bot.on("polling_error", (err) => Sentry.captureException(err));
bot.on("polling_error", (err) => console.log(err));

registerUser(bot);
updateProfile(bot);
engagementRound(bot);

module.exports = bot;
