var React = require('react');
var Menu = require('./Menu/Menu.jsx');
var NoteForm = require('./NoteForm/NoteForm.jsx');
var Browse = require('./Browse/Browse.jsx');
var itemActions = require('./../actions/items.js');

module.exports = function Application (props) {
  var component,
    page = props.location[0];
  if (page === "browse") {
    component = <Browse {...props} />;
  } else if (page === "add") {
    component = <NoteForm 
      {...props} 
      submitNewItem={itemActions.submitNewItem} 
      updateNewItem={itemActions.updateNewItem} 
      cancel={itemActions.cancel}
    />;
  } else {
    component = (
      <div>
        <br />
        <br />
        <h1> Not Found </h1>
        <a href="#/browse">Browse page</a>
      </div>
    );
  }
  return (
    <div>
      <Menu page={page} />
      {component}
    </div>
  );
};
