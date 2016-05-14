var model = require('./model.js');
var helpers = require('./helpers.js');

exports.updateNewItem = function (item) {
  model.setState({ newItem: item });
};
exports.submitNewItem = function () {
  var state = model.getState();
  console.log('submit new item function');
  var item = Object.assign(
    {}, 
    state.newItem, 
    { 
      id: state.items.length + 1,
      errors: {}
    }
  );
  // TODO move these into helpers and write unit tests.
  if (!item.title) {
    item.errors.title = ["Please enter your new item's title"];
  }
  // Test that 'item.email' looks like a real email address using a RegExp
  if (!item.description) {
    item.errors.description = ["Please enter your new item's description"];
  }
  

  // if the new item has 0 errors then clear the fields.
  if (Object.keys(item.errors).length === 0) {
  console.log('submit new ietm')
    // convert tags to array.
    if (!item.tags) {
      item.tags = [];
    } else {
      item.tags = item.tags.split(',');
    }
    item.type = 'note';
    model.setState({
      newItem: helpers.getNewItem(),
      // slice is just used to get a copy of the array
      // without modifying the existing state.items array.
      items: state.items.slice(0).concat(item)
    });
  } else {
    alert(JSON.stringify(item.errors));
    model.setState({
      newItem: item
    });
  }
};
