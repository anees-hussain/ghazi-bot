require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.bot_token;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\hi/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hi, I am Ghazi Bot.");
});

module.exports = bot;

// desolate-temple-06187
// https://desolate-temple-06187.herokuapp.com/ | https://git.heroku.com/desolate-temple-06187.git
