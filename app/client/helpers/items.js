var model = require('./model.js');
var navigation = require('./navigation.js');
var constants = require('./constants.js');

exports.getNewItem = function () {
  return Object.assign({}, constants.ITEM_TEMPLATE);
};

exports.updateNewItem = function (item) {
  model.setState({ newItem: item });
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
  item.errors = item.errors || {};
  if (!item.title) {
    item.errors.title = ["Please enter your new item's title"];
  }
  // Test that 'item.email' looks like a real email address using a RegExp
  if (!item.description) {
    item.errors.description = ["Please enter your new item's description"];
  }
}

exports.submitItemForm = function (e) {
  var state = model.getState();
  e.preventDefault();
  var id = Number(state.location[1]);
  var itemForm = state.itemForms[id];
  // if the temporary form representation of the item does not exist
  // that means no edits were made so safe to just redirect away.
  if (!itemForm) {
    navigation.startNavigating('browse');
    return;
  }
  validate(itemForm);
  if (Object.keys(itemForm.errors).length === 0) {
    state.items = state.items.slice(0).map(function (item) {
      if (item.id === id) {
        return itemForm;
      }
      return item;
    });
    delete state.itemForms[id];
    model.setState(state);
    navigation.startNavigating('browse');
  } else {
    // if validation errors then show the errors
    model.setState(state);
  }
};


exports.submitNewItem = function (e) {
  var state = model.getState();
  e.preventDefault();
  var item = Object.assign(
    {}, 
    state.newItem, 
    { 
      id: state.items.length + 1,
      errors: {}
    }
  );
  validate(item);
  
  // if the new item has 0 errors then clear the fields.
  if (Object.keys(item.errors).length === 0) {
    console.log('need to submit new item here');
    return;
    // convert tags to array.
    if (!item.tags) {
      item.tags = [];
    } else {
      item.tags = item.tags.split(',');
    }
    item.type = 'note';
    model.setState({
      newItem: exports.getNewItem(),
      // slice is just used to get a copy of the array
      // without modifying the existing state.items array.
      items: state.items.slice(0).concat(item)
    });
    navigation.startNavigating('browse');
  } else {
    model.setState({
      newItem: item
    });
  }

};
