const db = require("../firebase");
const keyboardOpts = require("../utils/keyboardOpts");

//--> Inline - Keyboard
let user;

function updateProfile(bot) {
  bot.onText(/update_profile/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(
      chatId,
      "Which information would you like to update?",
      keyboardOpts([
        [{ text: "Email", callback_data: "Email" }],
        [
          { text: "IG Username", callback_data: "Ig_username" },
          { text: "Location", callback_data: "Location" },
        ],
      ])
    );
  });

  //--> Use Inline-Keyboard data
  bot.on("callback_query", (callback_query) => {
    const chatId = callback_query.message.chat.id;
    const data = callback_query.data;

    bot.sendMessage(
      chatId,
      `Please provide your ${data} in this format.\n/update${data} Your Info`
    );
  });

  bot.onText(/updateEmail/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const email = userReply.slice(1, userReply.length).join(" ");

    //Update user data in DB
    db.ref(`users/${chatId}`).update({ email });

    // User data from Firebase DB
    db.ref(`users/${chatId}`).on("value", (snapshot) => {
      user = snapshot.val();
      bot.sendMessage(
        chatId,
        `Congratulations! Your account is updated now. 🥳\nPlease review your details below.\n\nName: ${
          user.first_name + " " + user.last_name
        }\nLocation: ${user.location}\nEmail: ${user.email}\nIG Username: ${
          user.ig_username
        }\n\nWant to do some more changes? Please choose one field below!`,
        opts
      );
    });
  });

  bot.onText(/updateIg_username/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const Ig_username = userReply.slice(1, userReply.length).join(" ");

    //Update user data in DB
    db.ref(`users/${chatId}`).update({ ig_username: Ig_username });

    // User data from Firebase DB
    db.ref(`users/${chatId}`).on("value", (snapshot) => {
      user = snapshot.val();
      bot.sendMessage(
        chatId,
        `Congratulations! Your account is updated now. 🥳\nPlease review your details below.\n\nName: ${
          user.first_name + " " + user.last_name
        }\nLocation: ${user.location}\nEmail: ${user.email}\nIG Username: ${
          user.ig_username
        }\n\nWant to do some more changes? Please choose one field below!`,
        opts
      );
    });
  });

  bot.onText(/updateLocation/, (msg, match) => {
    const chatId = msg.chat.id;
    const userReply = match.input.split(" ");
    const location = userReply.slice(1, userReply.length).join(" ");

    //Update user data in DB
    db.ref(`users/${chatId}`).update({ location });

    // User data from Firebase DB
    db.ref(`users/${chatId}`).on("value", (snapshot) => {
      user = snapshot.val();
      bot.sendMessage(
        chatId,
        `Congratulations! Your account is updated now. 🥳\nPlease review your details below.\n\nName: ${
          user.first_name + " " + user.last_name
        }\nLocation: ${user.location}\nEmail: ${user.email}\nIG Username: ${
          user.ig_username
        }\n\nWant to do some more changes? Please choose one field below!`,
        opts
      );
    });
  });
}

module.exports = updateProfile;
