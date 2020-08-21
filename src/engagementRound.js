// After starting a round:
  // Bot should get latest posts links of all participants.
  // Bot should send a list of links to all participants.

// Bot should set a countdown of current round.
// Bot should send a round end message when countdown ends
// Bot should warning OR success message to particiants.

const db = require("./firebase");
const keyboardOpts = require("./utils/keyboardOpts");

let user;
let chatId;
let participant;
let username;

// Getting Ig_username from DB

//--> Here I need to add a loop to get all registered users chatids **IMPORTANT_NOTE**
db.ref(`/users/939580232`).on("value", (snapshot) => {
  user = snapshot.val();
  username = user.ig_username || '';
  chatId = user.id
});

// Get Participant chatId and send message about round status
db.ref(`/engagementRound/participants/939580232/`).on("value", (snapshot) => {
  let user = snapshot.val();
  participant = user;
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
  }, 600000); // 1.8e6 30 Mints


// Adding Participant to round
  bot.on("callback_query", (callback_query) => {
    const chatId = callback_query.message.chat.id;
    const data = callback_query.data;

    db.ref("engagementRound/participants/" + user.id).set({id : user.id, username});

    bot.sendMessage(
      chatId,
      "Congratulations 🥳\nYou have dropped your username successfully."
    );
  });

  setInterval(() => {
    bot.sendMessage(
      participant.id,
      "Round has been started. Please engage with all usernames to avoid any warning."
    );
  }, 90000);

  setInterval(() => {
    bot.sendMessage(
      chatId,
      "Following usernames are remaining. Please engage with these usernames to complete round successfully."
    );
  }, 900000);

//   setInterval(() => {
//     bot.sendMessage(
//       chatId,
//       "Round Ended.\nThank you so much for engaging in round. I would like to see you in next round.\nHappy Enagaging!"
//     );
//   }, 3.6e6); // 60 Mints
}

module.exports = engagementRound;
