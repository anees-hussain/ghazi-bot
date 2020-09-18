//......> Remaining Tasks
// Find User ID of an Instagram account
// Install Express
// Paste User ID in this link, and use app.get() on the URL to get shortcode of latest post.
// https://instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"1951415043","first":20,"after":null}
// https://www.instagram.com/anees__hussain/?__a=1

// Bot should get participant's latest post from instagram
// Bot should send list of posts' links to all participants
// Bot should send warning/success messages to all participants
// Bot should ban a user for 2 days.
// Set adjacent time for round engagement when bot functionality is complete
// Fix email registration joi issue & inline keyboard issue.
// Refractoring

const db = require("./firebase");
const fetch = require("node-fetch");
let fetchSettings = { method: "Get" };
const keyboardOpts = require("./utils/keyboardOpts");
const {
  dropMessage,
  reminderMessage,
  roundEndMessage,
  roundStartNotice,
  roundStartedButNotEngaged,
  roundStartedInfo,
} = require("./utils/botMessages");

// Enagagement Round after n interval
function engagementRound(bot) {
  let user = [];
  let chatId = [];
  let participant;
  let username = [];

  let daysInTime;
  let hoursInTime;
  let minutesInTime;
  let secondsInTime;
  let timeLeftAfterStartRound;

  let oneSecond = 1000; // ms
  let totalRoundDuration = 60000; // 30 Mints in ms
  let initialRoundTime = new Date().getTime() + totalRoundDuration; // Adding 30 minutes in ms
  let announcementTime = 40000; // 25 Minutes in ms
  let roundStartTime = 30000; // 20 Minutes in ms
  let reminderTime = 10000; // 10 Minutes in ms
  let roundEndTime = oneSecond; // 1 Second in ms

  // Getting Ig_username & ChatIds from DB
  db.ref(`/users/`).on("value", (snapshot) => {
    let usersData = snapshot.val();
    for (let key in usersData) {
      db.ref(`/users/${key}`).on("value", (keySnap) => {
        user.push(keySnap.val());
        username.push(keySnap.val().ig_username || "");
        chatId.push(key);
      });
    }
  });

  // Adding Participants to round
  bot.on("callback_query", (callback_query) => {
    const participantId = callback_query.message.chat.id;
    const data = callback_query.data;

    db.ref("engagementRound/participants/" + participantId).set({
      id: participantId,
      username: data,
    });

    bot.sendMessage(
      participantId,
      "Congratulations 🥳\nYou have dropped your username successfully."
    );
  });

  //------------------> Starting an interval for Round Engagement Flow
  setInterval(() => {
    let currentTime = new Date().getTime();
    let timeLeft = initialRoundTime - currentTime;
    console.log(timeLeft);

    daysInTime = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    hoursInTime = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    minutesInTime = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    secondsInTime = Math.floor((timeLeft % (1000 * 60)) / 1000);

    console.log(
      `${daysInTime}d : ${hoursInTime}h : ${minutesInTime}m : ${secondsInTime}s`
    );

    //------------------> Sending Drop Message Announcement to Registered Users
    if (
      timeLeft < announcementTime &&
      timeLeft > announcementTime - oneSecond
    ) {
      for (let counter = 0; counter < chatId.length; counter++) {
        bot.sendMessage(
          chatId[counter],
          dropMessage,
          keyboardOpts([
            [{ text: username[counter], callback_data: username[counter] }],
          ])
        );
      }
    }

    //------------------> Sending Round start message to participants
    if (timeLeft < roundStartTime && timeLeft > roundStartTime - oneSecond) {
      timeLeftAfterStartRound = timeLeft;
      for (let counter = 0; counter < chatId.length; counter++) {
        db.ref("engagementRound/participants/").on("value", (snap) => {
          let participantId = snap.val();

          //------------------> Adding recent post URLs of participants to DB
          for (let id in participantId) {
            db.ref("engagementRound/participants/" + id).on(
              "value",
              (snapshot) => {
                let participant = snapshot.val();

                //------------------> Fetching URL from Instagram and adding it to DB
                fetch(
                  `https://www.instagram.com/${participant.username}/?__a=1`,
                  fetchSettings
                )
                  .then((res) => res.json())
                  .then((json) =>
                    db.ref("engagementRound/postURLs/" + id).set({
                      url: `https://www.instagram.com/p/${json.graphql.user.edge_owner_to_timeline_media.edges[0].node.shortcode}/`,
                    })
                  );
              }
            );
          }

          if (!participantId) {
            bot.sendMessage(chatId[counter], roundStartNotice);
            return;
          }
          for (let id in participantId) {
            if (id === chatId[counter]) {
              bot.sendMessage(
                chatId[counter],
                roundStartedInfo + `\nPlease engage with this list. \na`
              );
            } else {
              bot.sendMessage(chatId[counter], roundStartedButNotEngaged);
            }
          }
        });
      }
    }

    //------------------> Sending Reminders to participants if not engaged with given list
    if (timeLeft < reminderTime && timeLeft > reminderTime - oneSecond) {
      for (let counter = 0; counter < chatId.length; counter++) {
        bot.sendMessage(chatId[counter], reminderMessage);
      }
    }

    //------------------> Sending Round End message to participants
    if (timeLeft <= roundEndTime) {
      for (let counter = 0; counter < chatId.length; counter++) {
        bot.sendMessage(chatId[counter], roundEndMessage);
      }
      initialRoundTime = new Date().getTime() + totalRoundDuration;
      db.ref("engagementRound/").remove();
    }
  }, oneSecond);

  function getRoundTime() {
    let initialTime = initialRoundTime - roundStartTime;
    let currentTime = new Date().getTime();
    let timeLeft = initialTime - currentTime;
    let millisecondsToMinutes = Math.round(
      (timeLeftAfterStartRound + roundStartTime) / 60000
    );

    let hoursInTime = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutesInTime = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let secondsInTime = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (secondsInTime < 0) {
      return `Round has already started. Please check again after ${millisecondsToMinutes} minutes.`;
    } else {
      return `Round will start after ${hoursInTime}h : ${minutesInTime}m : ${secondsInTime}s.`;
    }
  }

  bot.onText(/round/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, getRoundTime());
  });
}

module.exports = engagementRound;
