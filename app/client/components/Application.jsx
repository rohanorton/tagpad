var React = require('react');
var Menu = require('./menu/Menu.jsx');
var Add = require('./add/Add.jsx');
var Browse = require('./browse/Browse.jsx');
var itemActions = require('./../actions/items.js');

module.exports = function Application (props) {
  var component,
    page = props.location[0];
  if (page === "browse") {
    component = <Browse {...props} />;
  } else if (page === "add") {
    component = <Add 
      {...props} 
      submitNewItem={itemActions.submitNewItem} 
      updateNewItem={itemActions.updateNewItem} 
    />;
  } else {
    component = (
      <div>
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
