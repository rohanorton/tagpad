var model = require('./model.js');
var navigation = require('./navigation.js');
var constants = require('./constants.js');

exports.getNewItem = function () {
  return Object.assign({}, constants.ITEM_TEMPLATE);
};

exports.validate = function (item) {  
  item.errors = {};
  if (!item.title) {
    item.errors.title = ["Please enter your new item's title"];
  }
  // Test that 'item.email' looks like a real email address using a RegExp
  if (!item.content) {
    item.errors.content = ["Please enter your new item's description"];
  }
}
