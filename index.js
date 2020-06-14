// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");
// const token = process.env.bot_token;
// const bot = new TelegramBot(token, { polling: true });

// bot.onText(/\hi/, (msg, match) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, "Hi, I am Ghazi Bot.");
// });

// module.exports = bot;

const { Composer } = require("micro-bot");

const bot = new Composer();

bot.start((ctx) => {
  ctx.reply("Bot has started");
});

//curl -F "url=https://ghazi-seven.now.sh/"  https://api.telegram.org/bot1076997129:AAFt4ANG3nPQgj5uk8N-ceqyrSf5cMA_YkI/setWebhook

// desolate-temple-06187
// https://desolate-temple-06187.herokuapp.com/ | https://git.heroku.com/desolate-temple-06187.git
