require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.bot_token;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\hi/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Hi, I am Ghazi Bot.");
});

//curl -F "url=https://ghazi-seven.now.sh/"  https://api.telegram.org/bot1076997129:AAFt4ANG3nPQgj5uk8N-ceqyrSf5cMA_YkI/setWebhook