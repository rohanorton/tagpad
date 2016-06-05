import 'babel-polyfill';
import Relay from 'react-relay';
import React from 'react';
import Menu from './Menu/Menu';
import Browse from './Browse/Browse.js';
import NoteForm from './NoteForm/NoteForm.js';

/*var Login = require('./Login/Login.jsx');
var itemActions = require('./../actions/items.js');*/

function NotFound() {
  return (
    <div className="ui main text container">
      <h1 className="ui header"> Not Found </h1>
      <a href="#/browse">go back to browse page</a>
    </div>
  );
}


// object which represents item whilst being edited.
function getItemForm (state, id) {
  // use one we are editing already, if we aren't already editing then get the existing item.
  var itemForm = state.itemForms[id];
  if (!itemForm) { 
    itemForm = state.items.filter(function(item) { return item.id === id; })[0];
  }
  return itemForm;
}

function loginSubmit(e) {
  e.preventDefault();
  alert('loginSubmit, value = ' + JSON.stringify(e.target.value));
}

function App (props) {
  // props {location:Array, query:Object}
  const page = props.location[0];
  if (page === "login") {
    return <Login onSubmit={loginSubmit}/>;
  } else if (page === "browse") {
    return (
      <div>
        <Menu page={page} />
        <Browse search={props.query.search || ''}/>;
      </div>
    );
  } else if (page === "add") {
    return (
      <div>
        <Menu page={page} />
        <h1> todo: Note add form here </h1>
        <NoteForm />;
      </div>
    );
  } else if (page === "items") {
    if (props.location.length === 2) {
      let id = Number(props.location[1]);
      return (
        <div>
          <Menu page={page} />
          <h1> todo: Note edit form for item with id: {id} here </h1>
          <NoteForm itemId={id} />
        </div>
      );
    }
  } 
  return <NotFound />;
};


module.exports = App;
