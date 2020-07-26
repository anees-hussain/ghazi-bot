const keyboardOpts = require("./utils/keyboardOpts");

function engagementRound(bot) {
  setInterval(() => {
    let date = new Date();
    let hours = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    bot.sendMessage(
      "939580232",
      `⚫️ DROP YOUR USERNAME TO JOIN ⚫️

How to DROP your username:
1. To join the round, drop your username by clicking your Instagram username in the box below.

2. To cancel your participation, remove your username by clicking the 'Remove username' box bellow (Under the 'Username received!' notification).

3. Once the round starts, you must engage with all the lists of Instagram usernames given by liking on the latest post of their accounts.
4. The round will last for 30 Minutes.

You will be notified when the round starts.`,
      keyboardOpts([[{ text: "Username", callback_data: "username" }]])
    );
  }, 1.8e6);
}

module.exports = engagementRound;
