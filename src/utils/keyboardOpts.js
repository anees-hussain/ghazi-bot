function keyboardOpts(buttonArray) {
  return {
    reply_markup: {
      inline_keyboard: buttonArray,
    },
  };
}

module.exports = keyboardOpts;
