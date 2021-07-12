const moment = require('moment');

function combineAll(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = combineAll;