var React = require('react');
var Menu = require('./Menu/Menu.jsx');
var NoteForm = require('./NoteForm/NoteForm.jsx');
var Browse = require('./Browse/Browse.jsx');
var itemActions = require('./../actions/items.js');


function NotFound() {
  return (
    <div>
      <br />
      <br />
      <h1> Not Found </h1>
      <a href="#/browse">Browse page</a>
    </div>
  );
}

function getItemForm (state, id) {
  // use one we are editing already, if we aren't already editing then get the existing item.
  var itemForm = state.itemForms[id];
  if (!itemForm) { 
    itemForm = state.items.filter(function(item) { return item.id === id; })[0];
    itemActions.updateItemForm(itemForm);
  }
  return itemForm;
}

module.exports = function Application (props) {
  var component,
    page = props.location[0];
  if (page === "browse") {
    component = <Browse {...props} />;
  } else if (page === "add") {
    component = <NoteForm 
      item={props.newItem}
      submit={itemActions.submitNewItem} 
      update={itemActions.updateNewItem} 
      cancel={itemActions.cancel}
    />;
  } else if (page === "items") {
    if (props.location.length === 2) {
      let id = Number(props.location[1]);
      let item = getItemForm(props, id);
      if (item) {
        component = <NoteForm
            item={item}
            submit={itemActions.submitItemForm}
            update={itemActions.updateItemForm}
            cancel={itemActions.cancel}
          />;
      }
    }
  }
  return (
    <div>
      <Menu page={page} />
      {component || <NotFound />} 
    </div>
  );
};
