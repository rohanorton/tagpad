import 'babel-polyfill';
import React from 'react';
import Menu from './Menu/Menu';
import Browse from './Browse/Browse.js';
import Notification from './Notification/Notification.js';
import NoteForm from './NoteForm/NoteForm.js';
import Login from './Login/Login.js';
import itemHelpers from './../helpers/items';

function NotFound() {
  return (
    <div className="ui main text container">
      <h1 className="ui header"> Not Found </h1>
      <a href="#/browse">go back to browse page</a>
    </div>
  );
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
      <div className="ui center aligned">
        <Menu page={page} />
        <Notification {...props.notification} />
        <Browse search={props.query.search || ''}/>
      </div>
    );
  } else if (page === "add") {
    return (
      <div>
        <Menu page={page} />
        <NoteForm mode='add'/>
      </div>
    );
  } else if (page === "items") {
    if (props.location.length === 2) {
      let id = props.location[1];
      return (
        <div>
          <Menu page={page} />
          <NoteForm mode='update' itemId={id} />
        </div>
      );
    }
  } 
  return <NotFound />;
}

module.exports = App;
