var constants = require('./constants.js');

exports.getNewItem = function () {
  return Object.assign({}, constants.ITEM_TEMPLATE);
};
