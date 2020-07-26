const db = require("./firebase");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  email: Joi.string().email().required(),
});

function registerUser(bot) {
  let user = {
    id: null,
    first_name: null,
    last_name: null,
    location: null,
    email: null,
    telegram_username: null,
    ig_username: null,
    isBan: false,
    warnCount: 0,
  };

  let currentUser = [1];

  bot.onText(/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name;

    // bot.sendMessage(
    //   chatId,
    //   `Welcome ${firstName}!\nLet's start engaging in next round. If you need any assistance, please use /rules command.`
    // );

    user.id = chatId;
    user.first_name = msg.chat.first_name;
    user.last_name = msg.chat.last_name || "";
    user.telegram_username = msg.chat.username || '';

    bot.sendMessage(
      chatId,
      `Hi ${firstName} \nYou have to register yourself in order to engage in rounds. \nPlease write your location in this format below. \ne.g. /location New York, USA`
    );
  });

  bot.onText(/register/, (msg, match) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name;

    user.id = chatId;
    user.first_name = msg.chat.first_name;
    user.last_name = msg.chat.last_name || "";
    user.telegram_username = msg.chat.username || "";

    bot.sendMessage(
      chatId,
      `Hi ${firstName} \nYou have to register yourself in order to engage in rounds. \nPlease write your location in this format below. \ne.g. /location New York, USA`
    );
  });

  bot.onText(/location/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const location = userReply.slice(1, userReply.length).join(" ");

    if (!location) {
      bot.sendMessage(
        chatId,
        `Please provide your location to complete your registration!`
      );
    } else {
      user.location = location;

      bot.sendMessage(
        chatId,
        `Thank you so much for providing your location.\nPlease write your email address in this format below. \ne.g. /email abc@example.com`
      );
    }
  });

  bot.onText(/email/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const email = userReply.slice(1, userReply.length).join(" ");

    if (!email) {
      bot.sendMessage(
        chatId,
        `Please provide your email address to complete your registration!`
      );
      return;
    }

    bot.sendMessage(
      chatId,
      `Thank you so much for providing your email address.\nPlease provide your Instagram Username in this format below.\n/ig_username username`
    );

    user.email = email;

    // --> Email Validation via Joi (Not functional now!)
    // if (email) {
    //   const { error } = schema.validate({ email });
    //   const message = error.details[0].message;
    //   console.log(error);

    //   if (message) {
    //     bot.sendMessage(chatId, "Please enter a valid email address.");
    //   }

    //   if (!error) {
    //     bot.sendMessage(
    //       chatId,
    //       `Thank you so much for providing your email address.\nPlease provide your Instagram Username in this format below.\n/ig_username username`
    //     );
    //   }
    // }
  });

  bot.onText(/ig_username/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const igUserName = userReply.slice(1, userReply.length).join(" ");
    const firstName = msg.chat.first_name;
    const lastName = msg.chat.last_name || "";

    if (!igUserName) {
      bot.sendMessage(
        chatId,
        `Please provide your Instagram Username to engage in rounds!`
      );
    } else {
      user.ig_username = igUserName;

      db.ref("users/" + user.id).set(user);

      bot.sendMessage(
        chatId,
        `Congratulations! You are registered now. 🥳\nPlease use /update_profile to modify your details.\n\nHere are your details:\nName: ${
          firstName + " " + lastName
        }\nLocation: ${user.location}\nEmail: ${user.email}\nIG Username: ${
          user.ig_username
        }\n\nYou can use /rules command to see round rules and you can use /round command to check time left for next round.`
      );
    }
  });
}

module.exports = registerUser;
