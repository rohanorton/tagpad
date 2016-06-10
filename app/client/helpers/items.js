var model = require('./model.js');
var navigation = require('./navigation.js');
var constants = require('./constants.js');

exports.getNewItem = function () {
  return Object.assign({}, constants.ITEM_TEMPLATE);
};

exports.updateItemForm = function (itemForm) {
  // remember we just need to set the changes.
  var itemForms = Object.assign({}, model.getState().itemForms);
  itemForms[itemForm.id] = itemForm;
  model.setState({
    itemForms: itemForms
  });
};

// when add or edit item is canceled 
exports.cancel = function (e) {
  e.preventDefault();
  // delete the edits.
  model.setState({ newItem: exports.getNewItem()}); 
  // go back to the browse page.
  navigation.startNavigating('browse');
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
