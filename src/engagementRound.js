const db = require("./firebase");
const keyboardOpts = require("./utils/keyboardOpts");

let user;
let chatId = "939580232";
let username;

// Getting Ig_username from DB
db.ref(`/users/${chatId}`).on("value", (snapshot) => {
  user = snapshot.val();
  username = user.ig_username;
});

// Enagagement Round after n interval
function engagementRound(bot) {
  setInterval(() => {
    bot.sendMessage(
      chatId,
      `⚫️ DROP YOUR USERNAME TO JOIN ⚫️

How to DROP your username:
1. To join the round, drop your username by clicking your Instagram username in the box below.

2. To cancel your participation, remove your username by clicking the 'Remove username' box bellow (Under the 'Username received!' notification).

3. Once the round starts, you must engage with all the lists of Instagram usernames given by liking on the latest post of their accounts.
4. The round will last for 30 Minutes.

You will be notified when the round starts.`,
      keyboardOpts([[{ text: username, callback_data: username }]])
    );
  }, 1.8e6); // 30 Mints

  bot.on("callback_query", (callback_query) => {
    const chatId = callback_query.message.chat.id;
    const data = callback_query.data;

    // Adding Participant to round

    db.ref("engagementRound/participants/" + user.id).set(username);

    bot.sendMessage(
      chatId,
      "Congratulations 🥳\nYou have dropped your username successfully."
    );
  });

  setInterval(() => {
    bot.sendMessage(
      chatId,
      "Round has been started. Please engage with all usernames to avoid any warning."
    );
  }, 2.1e6); // 35 Mints

  setInterval(() => {
    bot.sendMessage(
      chatId,
      "Following usernames are remaining. Please engage with these usernames to complete round successfully."
    );
  }, 3e6); // 50 Mints

  setInterval(() => {
    bot.sendMessage(
      chatId,
      "Round Ended.\nThank you so much for engaging in round. I would like to see you in next round.\nHappy Enagaging!"
    );
  }, 3.6e6); // 60 Mints
}

module.exports = engagementRound;
