require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.bot_token;
const bot = new TelegramBot(token, { polling: true });
const registerUser = require("./src/registerUser");
const updateProfile = require("./src/updateUserProfile");

bot.on("polling_error", (err) => console.log(err));

registerUser(bot);
updateProfile(bot);

module.exports = bot;
